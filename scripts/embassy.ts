import {
  compat,
  exists,
  matches,
  types as T,
} from "https://deno.land/x/embassyd_sdk@v0.3.1.0.3/mod.ts";
const { shape, number, string, some } = matches;

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
      path: "config.json",
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
    path: "./config.json",
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
    await exists(effects, { volumeId: "main", path: "config.json" }) === false
  ) {
    return noPropertiesFound;
  }
  if (
    await exists(effects, {
      volumeId: "main",
      path: "syncthing_stats.json",
    }) ===
      false
  ) {
    return noPropertiesFound;
  }
  const syncthing_system_promise = effects.readJsonFile({
    volumeId: "main",
    path: "syncthing_stats.json",
  });
  const config_promise = effects.readJsonFile({
    volumeId: "main",
    path: "config.json",
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
const error = (error: string) => ({ error });
const errorCode = (code: number, error: string) => ({
  "error-code": [code, error] as const,
});
const ok = { result: null };

/** Call to make sure the duration is pass a minimum */
const guardDurationAboveMinimum = (
  input: { duration: number; minimumTime: number },
) =>
  (input.duration <= input.minimumTime)
    ? Promise.reject(errorCode(60, "Starting"))
    : null;

export const health: T.ExpectedExports.health = {
  async version(effects, lastCall) {
    try {
      await guardDurationAboveMinimum({
        duration: lastCall,
        minimumTime: 10000,
      });
    } catch (e) {
      return e;
    }
    try {
      const version = await effects.readFile({
        volumeId: "main",
        path: "./health-version",
      }).then((x) => x.trim());
      const metaInformation = await effects.metadata({
        volumeId: "main",
        path: "./health-version",
      });
      const timeSinceLast = Date.now() -
        (metaInformation.modified?.valueOf() ?? Date.now());
      if (
        (timeSinceLast >
          lastCall)
      ) {
        return error(
          `Health check has not run recently enough: ${timeSinceLast}ms`,
        );
      }
      if (parsableInt.test(version)) {
        return ok;
      }
      return {
        error: `Unknown value in check: ${version}`,
      };
    } catch (e) {
      effects.error(`Health check failed: ${e}`);
      return errorCode(61, "Health check has never run");
    }
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
      const fileContents = await effects.readFile({
        volumeId: "main",
        path: "./health-web",
      }).then((x) => x.trim());
      const metaInformation = await effects.metadata({
        volumeId: "main",
        path: "./health-web",
      });
      const timeSinceLast = Date.now() -
        (metaInformation.modified?.valueOf() ?? Date.now());
      if (
        (timeSinceLast >
          lastCall)
      ) {
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
      return errorCode(61, "Health check has never run");
    }
  },
};

// deno-lint-ignore require-await
export const migration: T.ExpectedExports.migration = async () => ({
  result: { configured: true },
});
