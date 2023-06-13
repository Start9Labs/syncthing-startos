import { sdk } from '../sdk'
import { configSpec } from './config/spec'

export const uiPort = 8384
export const webUiInterfaceId = 'webui'

/**
 * ======================== Interfaces ========================
 *
 * In this section, you will decide how the service will be exposed to the outside world
 *
 * This function runs on service install/update AND on config save
 */
export const setInterfaces = sdk.setupInterfaces(
  configSpec,
  async ({ effects, utils, input }) => {
    const multi = utils.host.multi('multi') // technically just a multi hostname
    const multiOrigin = await multi.bindPort(uiPort, { protocol: 'http' })
    const multiInterface = utils.createInterface({
      name: 'Syncthing Ui',
      id: webUiInterfaceId,
      description: 'This interface is where we control the syncthing',
      ui: true,
      username: null,
      path: '',
      search: {},
      disabled: false,
      hasPrimary: true,
    })

    const multiReceipt = await multiInterface.export([multiOrigin])

    return [multiReceipt]
  },
)
