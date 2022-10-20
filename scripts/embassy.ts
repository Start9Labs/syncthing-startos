import {
  matches,
  types as T,
  util,
  // } from "https://deno.land/x/embassyd_sdk@v0.3.1.1.1/mod.ts";
} from "../../embassy-sdk-ts/mod.ts";

const { shape, number, string, some } = matches;
const { exists } = util;

const configFilePath = "./config.json";

const matchesStringRec = some(
  string,
  shape(
    {
      charset: string,
      len: number,
    },
    ["charset"],
  ),
);
const matchesConfig = shape({
  username: matchesStringRec,
  password: matchesStringRec,
});

const matchesConfigFile = shape({
  username: string,
  password: string,
});

export const getConfig: T.ExpectedExports.getConfig = async (
  effects: T.Effects,
) => {
  const config = await effects
    .readJsonFile({
      volumeId: "main",
      path: configFilePath,
    })
    .then((x) => matchesConfig.unsafeCast(x))
    .catch(() => undefined);

  return {
    result: {
      config,
      spec: {
        "tor-address": {
          name: "Tor Address",
          description: "The Tor address.",
          type: "pointer",
          subtype: "package",
          "package-id": "syncthing",
          target: "tor-address",
          interface: "main",
        },
        username: {
          type: "string",
          name: "Username",
          description:
            "The user for loging into the administration page of syncthing",
          nullable: false,
          copyable: true,
          masked: false,
          default: "admin",
        },
        password: {
          type: "string",
          name: "Password",
          description:
            "The password for loging into the administration page of syncthing",
          nullable: false,
          copyable: true,
          masked: true,
          default: {
            charset: "a-z,A-Z,0-9",
            len: 22,
          },
        },
      },
    },
  };
};

export const setConfig: T.ExpectedExports.setConfig = async (
  effects: T.Effects,
  input: T.Config,
) => {
  await effects.writeJsonFile({
    path: configFilePath,
    toWrite: {
      username: input?.username,
      password: input?.password,
    },
    volumeId: "main",
  });
  return {
    result: {
      signal: "SIGTERM",
      "depends-on": {},
    },
  };
};

const matchesSyncthingSystem = shape({
  myID: string,
});

type UnPromise<A> = A extends Promise<infer B> ? B : never;
const noPropertiesFound: UnPromise<ReturnType<T.ExpectedExports.properties>> = {
  result: {
    version: 2,
    data: {
      "Not Ready": {
        type: "string",
        value: "Could not find properties. The service might still be starting",
        qr: false,
        copyable: false,
        masked: false,
        description: "Fallback Message When Properties could not be found",
      },
    },
  },
} as const;

export const properties: T.ExpectedExports.properties = async (effects) => {
  if (
    (await exists(effects, { volumeId: "main", path: configFilePath })) ===
    false
  ) {
    return noPropertiesFound;
  }
  if (
    (await exists(effects, {
      volumeId: "main",
      path: "syncthing_stats.json",
    })) === false
  ) {
    return noPropertiesFound;
  }
  const syncthing_system_promise = effects.readJsonFile({
    volumeId: "main",
    path: "syncthing_stats.json",
  });
  const config_promise = effects.readJsonFile({
    volumeId: "main",
    path: configFilePath,
  });

  const syncthing_system = matchesSyncthingSystem.unsafeCast(
    await syncthing_system_promise,
  );
  const config = matchesConfigFile.unsafeCast(await config_promise);

  const result: T.Properties = {
    version: 2,
    data: {
      "Device Id": {
        type: "string",
        value: syncthing_system.myID,
        description: "his is the ID for syncthing to attach others to",
        copyable: true,
        qr: true,
        masked: false,
      },
      Username: {
        type: "string",
        value: config.username,
        description: "Username to login to the UI",
        copyable: true,
        qr: false,
        masked: false,
      },
      Password: {
        type: "string",
        value: config.password,
        description: "Password to login to the UI",
        copyable: true,
        qr: false,
        masked: true,
      },
    },
  };
  return { result };
};
const parsableInt = string.map(Number).refine(function isInt(x): x is number {
  return Number.isInteger(x);
});
const okRegex = /Ok:.+/;
const errorRegex = /Error:\s?(.+)/;
const isError = shape({ error: string }).test;
const isErrorCode = shape({ "error-code": matches.tuple(number, string) }).test;
const error = (error: string) => ({ error });
const errorCode = (code: number, error: string) => ({
  "error-code": [code, error] as const,
});
const ok = { result: null };
const dealWithError = (e: unknown) => {
  if (isError(e) || isErrorCode(e)) {
    return e;
  }
  throw e;
};

/** Call to make sure the duration is pass a minimum */
const guardDurationAboveMinimum = (input: {
  duration: number;
  minimumTime: number;
}) =>
  input.duration <= input.minimumTime
    ? Promise.reject(errorCode(60, "Starting"))
    : null;
function safeParse(x: string) {
  try {
    return JSON.parse(x)
  }
  catch (e) {
    return undefined
  }
}
export const health: T.ExpectedExports.health = {
  async version(effects, lastCall) {
    try {
      await guardDurationAboveMinimum({
        duration: lastCall,
        minimumTime: 10000,
      });
      const output = await (effects as any).runCommand({
        command: "sh",
        args: ["-c", "HOME=/mnt/filebrowser/syncthing syncthing cli config version get"],
      })
      if ("ok" in output && safeParse(output['ok']) === 36) {
        return ok
      } else if ("err" in output) {
        const err = safeParse(output)

        if (0 in err && 1 in err && typeof err[0] === 'number' && typeof err[1]) {
          return errorCode(err[0], err[1])
        }
      }
      return ok
    } catch (e) {
      dealWithError(e)
    }
    return error("Could not get the current status");
  },
  async "web-ui"(effects, lastCall) {
    try {
      await guardDurationAboveMinimum({
        duration: lastCall,
        minimumTime: 10000,
      });
    } catch (e) {
      return e;
    }
    try {
      const fileContents = await effects
        .readFile({
          volumeId: "main",
          path: "./health-web",
        })
        .then((x) => x.trim());
      const metaInformation = await effects.metadata({
        volumeId: "main",
        path: "./health-web",
      });
      const timeSinceLast = Date.now() -
        (metaInformation.modified?.valueOf() ?? Date.now());
      if (timeSinceLast > lastCall) {
        return error(
          `Health check has not run recently enough: ${timeSinceLast}ms`,
        );
      }
      if (okRegex.test(fileContents)) {
        return ok;
      }
      const errorExec = errorRegex.exec(fileContents);
      if (errorExec?.[1]) {
        return {
          error: errorExec[1],
        };
      }
      return {
        error: `Unknown file contents: ${fileContents}`,
      };
    } catch (e) {
      effects.error(`Health check failed: ${e}`);
      return errorCode(61, "Health check has never ran");
    }
  },
};

// deno-lint-ignore require-await
export const migration: T.ExpectedExports.migration = async () => ({
  result: { configured: true },
});
function noOp() { }

export const main = async (effects: T.Effects) => {
  effects.error("BLUJ Starting main")
  await effects.readFile({
    volumeId: "main",
    path: "healt-web",
  }).catch(noOp)
  await effects.readFile({
    volumeId: "main",
    path: "healt-version",
  }).catch(noOp)

  await effects.createDir({
    volumeId: "filebrowser",
    path: "syncthing"
  })

  await effects.runCommand({
    command: "chown",
    args: "-R syncthing_user /mnt/filebrowser/syncthing".split(' '),
  })

  const syncthingServer = effects.runCommand({
    command: "su",
    args: ["-s", "/bin/sh", "-c", "HOME=/mnt/filebrowser/syncthing syncthing serve --no-restart --no-default-folder", "syncthing_user"],
    timeoutMillis: Number.MAX_SAFE_INTEGER
  })

  const runCm = (command: string) => {
    return effects.runCommand({ command: "sh", args: ["-c", `HOME=/mnt/filebrowser/syncthing  ${command}`] }).then(x => {
      effects.error(`BLUJ Returned for ${command} is ${JSON.stringify(x)}`)
      return x;
    }).then(x => matches.shape({ Ok: matches.string }).unsafeCast(x)).then(({ Ok }) => Ok)
  }

  const testSyncthingStillStarting = async () => /no such file or directory/.test(await runCm(` syncthing cli show system`)) || /connection refused/.test(await runCm(` syncthing cli show system`)) || /connection refused/.test(await runCm(` syncthing cli config gui user get`))

  while (await testSyncthingStillStarting()) {
    await effects.sleep(200)
    await runCm("echo \"I'm sleeping\"")
  }
  await runCm("echo \"Syncthing settings\"")

  await effects.sleep(100)
  await runCm(`syncthing cli config gui raw-address set -- 0.0.0.0:8384`)
  await runCm(`syncthing cli config gui user set -- $(jq -r '.username' /root/config.json)`)
  await runCm(`syncthing cli config gui password set -- $(jq -r '.password' /root/config.json)`)
  await runCm(`syncthing cli config options uraccepted set -- -1`)
  await runCm(`syncthing cli config defaults device auto-accept-folders set true`)
  await runCm(`syncthing cli config defaults device introducer set true`)

  while (await testSyncthingStillStarting()) {
    await effects.sleep(200)
    await runCm("echo \"I'm sleeping\"")
  }
  await runCm("syncthing cli show system > /root/syncthing_stats.json")
  const watchAndOwn = effects.runCommand({ command: "watch-and-own.sh", args: [], timeoutMillis: Number.MAX_SAFE_INTEGER })
  effects.error("BLUJ waiting")
  await Promise.race([syncthingServer, watchAndOwn])
}

export const action: T.ExpectedExports.action = {
  async test(effects, config) {
    const start = Date.now();
    const returned = await effects.runCommand({
      command: "sleep",
      args: ["infinity"],
      timeoutMillis: 300
    });
    const end = Date.now();
    return {
      result: {
        version: "0",
        message: `Things have worked in ${end - start}ms`,
        value: JSON.stringify(returned),
        copyable: true,
        qr: true,
      },
    };
  },
};
