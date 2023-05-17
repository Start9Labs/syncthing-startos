import { sdk } from '../../sdk'
import { configSpec } from './spec'

/**
 * This function executes on config get
 *
 * Use this function to gather data from various files and assemble into a valid config to display to the user
 */
export const read = sdk.setupConfigRead(configSpec, async ({ utils }) => {
  return {
    username: await utils.store.getOwn('/config/username').once(),
    password: null,
  }
})
