import { matches, types as T, util } from "../deps.ts";
const { ok } = util;

const { shape, string, tuple, number, matches: match } = matches;

const okMatch = shape({ result: string })
const errorCodeMatch = shape({ "error-code": tuple(number, string) })
const errorMatch = shape({ error: string })



function toMessage(response: unknown) {
  return match(response)
    .when(okMatch, ({ result }) => result)
    .when(errorCodeMatch, (resp) => resp["error-code"][1])
    .when(errorMatch, ({ error }) => error)
    .defaultTo("")
}

export const main: T.ExpectedExports.main = async (effects: T.Effects) => {
  await effects.createDir({
    volumeId: "filebrowser",
    path: "syncthing",
  });

  await effects.runCommand({
    command: "chown",
    args: "-R syncthing_user /mnt/filebrowser/syncthing".split(" "),
  });

  const syncthingServer = effects.runDaemon({
    command: "su",
    args: [
      "-s",
      "/bin/sh",
      "-c",
      "HOME=/mnt/filebrowser/syncthing syncthing serve --no-restart --no-default-folder",
      "syncthing_user",
    ],
  });
  const runCm = (command: string) => {
    let response: unknown;
    return effects.runCommand({
      command: "sh",
      args: ["-c", `HOME=/mnt/filebrowser/syncthing  ${command}`],
    }).then((x) => {
      response = x;
      return x;
    }).then(toMessage)
      .catch(e => {
        throw new Error(`Could not figure it out for (${command}) and response = (${JSON.stringify(response)})`);
      });
  };

  const testSyncthingStillStarting = async () =>
    /no such file or directory/.test(
      await runCm(` syncthing cli show system`),
    ) || /connection refused/.test(await runCm(` syncthing cli show system`)) ||
    /connection refused/.test(
      await runCm(` syncthing cli config gui user get`),
    );

  while (await testSyncthingStillStarting()) {
    await effects.sleep(200);
    await runCm('echo "I\'m sleeping"');

  }
  await runCm('echo "Syncthing settings"');

  await effects.sleep(100);
  await runCm(`syncthing cli config gui raw-address set -- 0.0.0.0:8384`);
  await runCm(
    `syncthing cli config gui user set -- $(yq eval '.username' /root/start9/config.yaml)`,
  );
  await runCm(
    `syncthing cli config gui password set -- $(yq eval '.password' /root/start9/config.yaml)`,
  );
  await runCm(`syncthing cli config options uraccepted set -- -1`);
  await runCm(
    `syncthing cli config defaults device auto-accept-folders set true`,
  );
  await runCm(`syncthing cli config defaults device introducer set true`);

  while (await testSyncthingStillStarting()) {
    await effects.sleep(200);
    await runCm('echo "I\'m sleeping"');

  }
  await runCm("syncthing cli show system > /root/syncthing_stats.json");
  const watchAndOwn = effects.runDaemon({ command: "watch-and-own.sh" });
  await Promise.race([syncthingServer.wait(), watchAndOwn.wait()]);
  return ok;
};
