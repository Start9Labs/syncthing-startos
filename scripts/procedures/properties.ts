import { compat, matches, types as T, util, YAML } from "../deps.ts";
const { exists } = util;
const { shape, string } = matches;
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

const matchesConfigFile = shape({
  username: string,
  password: string,
});

export const properties: T.ExpectedExports.properties = async (effects) => {
  if (
    (await exists(effects, {
      volumeId: "main",
      path: "start9/config.yaml",
    })) ===
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
  const config_promise = effects.readFile({
    volumeId: "main",
    path: "start9/config.yaml",
  }).then(YAML.parse);

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
