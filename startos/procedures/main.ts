import { passwordFile } from './config/fileHelpers/passwordFile'
import { sdk } from '../sdk'
import { object, string } from 'ts-matches'

const matchStats = object({
  myID: string,
})

const sleep = (seconds: number) => new Promise((r) => setTimeout(r, seconds))

const CONNECTION_REFUSED = 'connection refused'
const NO_SUCH_FILE_OR_DIRECTORY = 'no such file or directory'
export const main = sdk.setupMain(async ({ effects, utils, started }) => {
  function setupSettingLoop(env: { HOME: string }) {
    new Promise(async () => {
      while (true) {
        const showSystem = await effects
          .runCommand('syncthing cli show system', { env })
          .catch(() => CONNECTION_REFUSED)
        const userGet = await effects
          .runCommand('syncthing cli config gui user get', { env })
          .catch(() => '')
        if (
          showSystem.indexOf(NO_SUCH_FILE_OR_DIRECTORY) > -1 ||
          showSystem.indexOf(CONNECTION_REFUSED) > -1 ||
          userGet.indexOf(CONNECTION_REFUSED) > -1
        ) {
          break
        }
        await sleep(10)
      }
      while (true) {
        try {
          await effects.runCommand(
            `syncthing cli config gui raw-address set -- 0.0.0.0:8384`,
            { env },
          )
          await effects.runCommand(
            `syncthing cli config gui user set -- ${await utils.store
              .getOwn('/config/username')
              .const()}`,
            { env },
          )
          await effects.runCommand(
            `syncthing cli config gui password set -- ${await passwordFile.read(
              effects,
            )}`,
            { env },
          )
          await effects.runCommand(
            `syncthing cli config options uraccepted set -- -1`,
            { env },
          )
          await effects.runCommand(
            `syncthing cli config defaults device auto-accept-folders set true`,
            { env },
          )
          await effects.runCommand(
            `syncthing cli config defaults device introducer set true`,
            { env },
          )
          const { myID } = await effects
            .runCommand(`syncthing cli show system `, { env })
            .then(JSON.parse)
            .then(matchStats.unsafeCast)

          await utils.vault.set('password', myID)
        } catch (e) {}
      }
    })
  }

  /**
   * ======================== Setup ========================
   *
   * In this section, you will fetch any resources or run any commands necessary to run the service
   */

  const env = {
    HOME: '/mnt/filebrowser/syncthing',
  }

  setInterval(async () => {
    await effects.runCommand(
      'chown -R syncthing_user /mnt/filebrowser/syncthing',
    )
  }, 10_000)

  /**
   * ======================== Additional Health Checks (optional) ========================
   *
   * In this section, you will define additional health checks beyond those associated with daemons
   */
  await setupSettingLoop(env)
  const healthReceipts = [
    sdk.healthCheck.of({
      name: 'Syncthing Web UI Reachable',
      effects,
      fn: async () => {
        const username = await utils.store.getOwn('/config/username').const()
        const password = await passwordFile.read(effects)
        await effects.fetch(`http://${username}:${password}@localhost:8384/`)
        return {
          status: 'passing',
        }
      },
    }),
  ]

  /**
   * ======================== Daemons ========================
   *
   * In this section, you will create one or more daemons that define the service runtime
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user
   */
  return sdk.Daemons.of({
    effects,
    started,
    healthReceipts, // Provide the healthReceipts or [] to prove they were at least considered
  }).addDaemon('syncthing', {
    command:
      'su syncthing_user syncthing serve --no-restart --reset-deltas --no-default-folder', // The command to start the daemon
    env,
    ready: {
      display: null,
      // The function to run to determine the health status of the daemon
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, 8384, {
          successMessage: 'The web interface is ready',
          errorMessage: 'The web interface is not ready',
        }),
    },
    requires: [],
  })
})
