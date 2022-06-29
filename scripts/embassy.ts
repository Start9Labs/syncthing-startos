import matches from "https://deno.land/x/ts_matches@5.1.5/mod.ts";
const { shape, number, string, some, literal } = matches;

import {
  Config,
  Effects,
  ExpectedExports,
  Properties,
} from "https://start9.com/procedure/types.0.3.1.d.ts";

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

export const getConfig: ExpectedExports.getConfig = async (
  effects: Effects,
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

export const setConfig: ExpectedExports.setConfig = async (
  effects: Effects,
  input: Config,
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

type UnPromise<A> = A extends Promise<infer B> ? B : never
const noPropertiesFound: UnPromise<ReturnType<ExpectedExports.properties>> = {
  result: {
    version: 2,
    data: {
      "Not Ready": {
        type: "string",
        value: "Could not find properties. The service might still be starting",
        qr: false,
        copyable: false,
        masked: false,
        description: "Fallback Message When Properties could not be found"
      }
    }
  }
} as const

const fetchProperties: ExpectedExports.properties = async (effects) => {
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

  const result: Properties = {
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
export const properties: ExpectedExports.properties = async (effects) => {
  try {
    return await fetchProperties(effects)
  }
  catch (_e) {
    return noPropertiesFound;
  }
}
const parsableInt = string.map(Number).refine(function isInt(x): x is number {
  return Number.isInteger(x);
});
const okRegex = /Ok:.+/;
const errorRegex = /Error:\s?(.+)/;
export const health: ExpectedExports.health = {
  async version(effects, lastCall) {
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
        return {
          "error": `Health has not ran recent enough: ${timeSinceLast}ms`,
        };
      }
      if (parsableInt.test(version)) {
        return {
          result: null,
        };
      }
      return {
        error: `Unknown value in check: ${version}`,
      };
    } catch (e) {
      effects.error(`Health check failed: ${e}`);
      return {
        "error-code": [61, "No file indicating health has ran"] as const,
      };
    }
  },
  async "web-ui"(effects, lastCall) {
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
        return {
          "error": `Health has not ran recent enough: ${timeSinceLast}ms`,
        };
      }
      if (okRegex.test(fileContents)) {
        return {
          result: null,
        };
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
      return {
        "error-code": [61, "No file indicating health web has ran"] as const,
      };
    }
  },
};

export const migration: ExpectedExports.migration = async () => ({
  result: { configured: true },
});
