import { configSpec } from './spec'
import { passwordFile } from './fileHelpers/passwordFile'
import { sdk } from '../../sdk'
import { setInterfaces } from '../interfaces'

/**
 * This function executes on config save
 *
 * Use it to persist config data to various files and to establish any resulting dependencies
 */
export const save = sdk.setupConfigSave(
  configSpec,
  async ({ effects, utils, input, dependencies }) => {
    const newPassword = await utils.createOrUpdateVault({
      key: 'password',
      value: input.password,
      generator: {
        charset: 'a-z,A-Z,0-9',
        len: 22,
      },
    })
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
