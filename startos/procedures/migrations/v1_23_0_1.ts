import { sdk } from '../../sdk'

/**
 * This is an example migration file
 *
 * By convention, each version service requiring a migration receives its own file
 *
 * The resulting migration (e.g. v4000) is exported, then imported into migration/index.ts
 */
export const v1_23_0_1 = sdk.Migration.of({
  version: '1.23.0.1',
  up: async ({ effects }) => await effects.setConfigured(false),
  down: async ({ effects }) => {},
})
