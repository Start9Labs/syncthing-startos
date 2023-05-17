import { sdk } from '../../../sdk'
import { configSpec } from '../../config/spec'
import * as F from 'filebrowser/startos/procedures/config/spec'

/**
 * In this function, you establish rules for auto configuring service dependencies
 *
 * See Hello Moon for an example
 */
export const dependencyConfig = sdk.setupDependencyConfig(configSpec, {
  filebrowser: sdk.DependencyConfig.of({
    localConfig: configSpec,
    remoteConfig: F.configSpec,
    dependencyConfig: async () => {},
  }),
})
