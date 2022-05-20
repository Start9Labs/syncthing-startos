export async function getConfig(effects) {
  const defaults = await effects
    .readJsonFile({
      volumeId: "main",
      path: "config.json",
    })
    .catch(() => ({
      username: "admin",
      password: {
        charset: "a-z,A-Z,0-9",
        len: 22,
      },
    }));
  return {
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
        description: "The user for loging into the administration page of syncthing",
        nullable: false,
        copyable: true,
        masked: false,
        default: defaults.username,
      },
      password: {
        type: "string",
        name: "Password",
        description: "The password for loging into the administration page of syncthing",
        nullable: false,
        copyable: true,
        masked: true,
        default: defaults.password,
      },
    },
  };
}

export async function setConfig(effects, input) {
  effects.writeJsonFile({
    path: "./config.json",
    toWrite: {
      username: input?.username,
      password: input?.password,
    },
    volumeId: "main",
  });
  return {
    signal: "SIGTERM",
    "depends-on": {},
  };
}

export async function properties(effects) {
  effects.error("Should be in properties");
  const syncthing_system_promise = effects.readJsonFile({
    volumeId: "main",
    path: "syncthing_stats.json",
  });
  const config_promise = effects.readJsonFile({
    volumeId: "main",
    path: "config.json",
  });

  const syncthing_system = await syncthing_system_promise;
  const config = await config_promise;

  return {
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
}
