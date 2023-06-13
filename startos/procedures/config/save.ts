import { PASSWORD_GENERATOR, configSpec } from './spec'
import { passwordFile } from './fileHelpers/passwordFile'
import { sdk } from '../../sdk'
import { setInterfaces } from '../interfaces'
import { getRandomString } from '@start9labs/start-sdk/lib/util/getRandomString'

/**
 * This function executes on config save
 *
 * Use it to persist config data to various files and to establish any resulting dependencies
 */
export const save = sdk.setupConfigSave(
  configSpec,
  async ({ effects, utils, input, dependencies }) => {
    const newPassword = await (async () => {
      const password = await utils.store.getOwn('/password').once()
      if (!!password) return password
      const newPassword = getRandomString(PASSWORD_GENERATOR)
      await utils.store.setOwn('/password', newPassword)
      return newPassword
    })()
    if (newPassword) {
      await passwordFile.write(newPassword, effects)
    }
    const { username } = input

    await utils.store.setOwn('/config', { username })
    const dependenciesReceipt = await effects.setDependencies([
      dependencies.exists('filebrowser'),
    ])

    return {
      interfacesReceipt: await setInterfaces({ effects, utils, input }), // This is plumbing, don't touch it
      dependenciesReceipt,
      restart: false,
    }
  },
)
