import { migrations } from './migrations'
import { sdk } from '../sdk'
import { setInterfaces } from './interfaces'

/**
 * Here you define arbitrary code that runs once, on fresh install only
 */
const install = sdk.setupInstall(async ({ effects, utils }) => {
  await utils.childProcess.exec('mkdir /mnt/filebrowser/syncthing')
  await utils.childProcess.exec(
    'chown -R syncthing_user /mnt/filebrowser/syncthing',
  )
})

const setupExports = sdk.setupExports(({ effects, utils }) => {
  return {
    ui: [
      {
        path: '/config/username',
        title: 'Username',
      },
      {
        path: '/password',
        title: 'Password',
      },
    ],
    services: [],
  }
})

/**
 * Here you define arbitrary code that runs once, on uninstall only
 */
const uninstall = sdk.setupUninstall(async ({ effects, utils }) => {})

/**
 * This is a static function. There is no need to make changes here
 */
export const { init, uninit } = sdk.setupInit(
  migrations,
  install,
  uninstall,
  setInterfaces,
  setupExports,
)
