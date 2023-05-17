import { v4_0_0 } from './v4_0_0'
import { sdk } from '../../sdk'

/**
 * Add each new migration as the next argument to this function
 */
export const migrations = sdk.setupMigrations(v4_0_0)
