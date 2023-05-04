import { matches } from '@start9labs/start-sdk/lib'
import FileHelper from '@start9labs/start-sdk/lib/util/fileHelper'

const { string } = matches

export const passwordFile = FileHelper.json('/config', string)
