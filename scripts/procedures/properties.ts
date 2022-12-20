import { compat, matches, types as T, util, YAML } from "../deps.ts";
const { exists } = util;
const { shape, string } = matches;
const matchesSyncthingSystem = shape({
  result: string
    .map((x) => JSON.parse(x))
    .concat(
      shape({
        myID: string,
      })
    ),
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
const noCliRunning: UnPromise<ReturnType<T.ExpectedExports.properties>> = {
  result: {
    version: 2,
    data: {
      "Not Ready": {
        type: "string",
        value: "Could not query the running syncthing server.",
        qr: false,
        copyable: false,
        masked: false,
        description: "Fallback Message When Properties could not be found",
      },
    },
  },
} as const;

const matchesConfigFile = shape({
  username: string,
  password: string,
});

export const properties: T.ExpectedExports.properties = async (effects) => {
  const promiseMyId = effects
    .runCommand({
      command: "sh",
      args: ["-c", `HOME=/mnt/filebrowser/syncthing syncthing cli show system`],
    })
    .then((x) => matchesSyncthingSystem.unsafeCast(x).result.myID)
    .catch((e) => {
      effects.warn("Cli Issue: " + e);
    });
  if (
    (await exists(effects, {
      volumeId: "main",
      path: "start9/config.yaml",
    })) === false
  ) {
    return noPropertiesFound;
  }
  const myId = await promiseMyId;
  if (myId == null) {
    return noCliRunning;
  }
  if (
    (await exists(effects, {
      volumeId: "main",
      path: "syncthing_stats.json",
    })) === false
  ) {
    return noPropertiesFound;
  }
  const config_promise = effects
    .readFile({
      volumeId: "main",
      path: "start9/config.yaml",
    })
    .then(YAML.parse);
  const config = matchesConfigFile.unsafeCast(await config_promise);

  const result: T.Properties = {
    version: 2,
    data: {
      "Device Id": {
        type: "string",
        value: myId,
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
