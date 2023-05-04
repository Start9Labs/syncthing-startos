import { Config } from '@start9labs/start-sdk/lib/config/builder/config'
import { Value } from '@start9labs/start-sdk/lib/config/builder/value'

export const configSpec = Config.of({
  'tor-address':
    /* TODO deal with point removed point "Tor Address" */ null as any,
  username: Value.text({
    name: 'Username',
    required: {
      default: 'admin',
    },
    description:
      'The user for loging into the administration page of syncthing',
    warning: null,
    masked: false,
    placeholder: null,
    inputmode: 'text',
    patterns: [],
    minLength: null,
    maxLength: null,
  }),
  password: Value.text({
    name: 'Password',
    required: {
      default: {
        charset: 'a-z,A-Z,0-9',
        len: 22,
      },
    },
    description:
      'The password for loging into the administration page of syncthing',
    warning: null,
    masked: true,
    placeholder: null,
    inputmode: 'text',
    patterns: [],
    minLength: null,
    maxLength: null,
  }),
})
export const matchConfigSpec = configSpec.validator
export type ConfigSpec = typeof matchConfigSpec._TYPE
