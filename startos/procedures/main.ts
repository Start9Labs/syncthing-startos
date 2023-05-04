import { checkPortListening } from '@start9labs/start-sdk/lib/health/checkFns'
import { setupMain } from '@start9labs/start-sdk/lib/mainFn'
import exportInterfaces from '@start9labs/start-sdk/lib/mainFn/exportInterfaces'
import { ExpectedExports } from '@start9labs/start-sdk/lib/types'
import { WrapperData } from '../wrapperData'
import { NetworkInterfaceBuilder } from '@start9labs/start-sdk/lib/mainFn/NetworkInterfaceBuilder'
import { healthCheck } from '@start9labs/start-sdk/lib/health/HealthCheck'
import { HealthReceipt } from '@start9labs/start-sdk/lib/health/HealthReceipt'
import { Daemons } from '@start9labs/start-sdk/lib/mainFn/Daemons'

const CONNECTION_REFUSED = 'connection refused'
const NO_SUCH_FILE_OR_DIRECTORY = 'no such file or directory'
export const main: ExpectedExports.main = setupMain<WrapperData>(
  async ({ effects, utils, started }) => {
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
     * ======================== Interfaces ========================
     *
     * In this section, you will decide how the service will be exposed to the outside world
     *
     * Naming convention reference: https://developer.mozilla.org/en-US/docs/Web/API/Location
     */

    // ------------ Reverse Proxy ----------------

    // set up a reverse proxy to enable https for Tor/LAN
    await effects.reverseProxy({
      bind: {
        port: 443,
        ssl: true,
      },
      dst: {
        port: 8384,
        ssl: false,
      },
    })

    // ------------ Tor ------------

    // Find or generate a random Tor hostname by ID
    const torHostname = utils.torHostName('torHostname')

    // Create a Tor host with the assigned port mapping
    const torHostTcp = await torHostname.bindTor(8384, 80)
    // Assign the Tor host a web protocol (e.g. "http", "ws")
    const torOriginHttp = torHostTcp.createOrigin('http')
    // Create a Tor host with the assigned port mapping
    const torHostSsl = await torHostname.bindTor(443, 443)
    // Assign the Tor host a web protocol (e.g. "https", "wss")
    const torOriginHttps = torHostSsl.createOrigin('https')

    // ------------ LAN ------------

    // Create a LAN host with the assigned internal port
    const lanHostSsl = await utils.bindLan(443)
    // Assign the LAN host a web protocol (e.g. "https", "wss")
    const lanOriginsHttps = lanHostSsl.createOrigins('https')

    // ------------ Interface ----------------

    // An interface is a grouping of addresses that expose the same resource (e.g. a UI or RPC API).
    // Addresses are different "routes" to the same destination

    // Define the Interface for user display and consumption
    const webInterface = new NetworkInterfaceBuilder({
      effects,
      name: 'Web UI',
      id: 'webui',
      description: 'The web interface for syncthing',
      ui: true,
      basic: null,
      path: '',
      search: {},
    })

    // Choose which origins to attach to this interface. The resulting addresses will share the attributes of the interface (name, path, search, etc)
    const webReceipt = await webInterface.export([
      torOriginHttp,
      torOriginHttps,
      ...lanOriginsHttps.all,
      lanOriginsHttps.local,
    ])

    // Export all address receipts for all interfaces to obtain interface receipt
    const interfaceReceipt = exportInterfaces(webReceipt)

    /**
     * ======================== Additional Health Checks (optional) ========================
     *
     * In this section, you will define additional health checks beyond those associated with daemons
     */
    let running = false
    const healthReceipts: HealthReceipt[] = [
      healthCheck({
        name: 'Syncthing Cli Running',
        effects,
        fn: async () => {
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
            return {
              status: 'passing',
            }
          }
          return {
            status: 'warning',
            message: 'Syncthing is not reachable in CLI',
          }
        },
        onFirstSuccess: async () => {
          await effects.runCommand(
            `syncthing cli config gui raw-address set -- 0.0.0.0:8384`,
            { env },
          )
          await effects.runCommand(
            `syncthing cli config gui user set -- ${await utils
              .getOwnWrapperData('/config/username')
              .const()}`,
            { env },
          )
          await effects.runCommand(
            `syncthing cli config gui password set -- ${await utils
              .getOwnWrapperData('/config/password')
              .const()}`,
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
        },
      }),
      healthCheck({
        name: 'Syncthing Web UI Reachable',
        effects,
        fn: async () => {
          const username = await utils
            .getOwnWrapperData('/config/username')
            .const()
          const password = await utils
            .getOwnWrapperData('/config/password')
            .const()
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
    return Daemons.of({
      effects,
      started,
      interfaceReceipt, // Provide the interfaceReceipt to prove it was completed
      healthReceipts, // Provide the healthReceipts or [] to prove they were at least considered
    }).addDaemon('syncthing', {
      command:
        'su syncthing_user syncthing serve --no-restart --reset-deltas --no-default-folder', // The command to start the daemon
      env,
      ready: {
        display: null,
        // The function to run to determine the health status of the daemon
        fn: () =>
          checkPortListening(effects, 8384, {
            successMessage: 'The web interface is ready',
            errorMessage: 'The web interface is not ready',
          }),
      },
      requires: [],
    })
  },
)
