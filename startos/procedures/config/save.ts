import { ConfigSpec } from './spec'
import { WrapperData } from '../../wrapperData'
import { Save } from '@start9labs/start-sdk/lib/config/setupConfig'
import { Manifest } from '../../manifest'
import fs from 'fs'

/**
 * This function executes on config save
 *
 * Use it to persist config data to various files and to establish any resulting dependencies
 */
export const save: Save<WrapperData, ConfigSpec, Manifest> = async ({
  effects,
  utils,
  input,
  dependencies,
}) => {
  const newPassword = await utils.createOrUpdateVault({
    key: 'password',
    value: input.password,
    generator: {
      charset: 'a-z,A-Z,0-9',
      len: 22,
    },
  })
  if (newPassword) {
    fs.writeFileSync('/root/.password', newPassword)
  }
  await utils.setOwnWrapperData('/config', { ...input, password: null })
  const dependenciesReceipt = await effects.setDependencies([
    dependencies.exists('filebrowser'),
  ])

  return {
    dependenciesReceipt,
    restart: false,
  }
}
