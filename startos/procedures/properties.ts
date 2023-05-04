import { setupProperties } from '@start9labs/start-sdk/lib/properties'
import { WrapperData } from '../wrapperData'
import { PropertyString } from '@start9labs/start-sdk/lib/properties/PropertyString'
import { PropertyGroup } from '@start9labs/start-sdk/lib/properties/PropertyGroup'

/**
 * With access to WrapperData, in this function you determine what to include in the Properties section of the UI
 */
export const properties = setupProperties<WrapperData>(
  async ({ wrapperData }) => {
    const {
      config: { password, username },
      deviceId,
    } = wrapperData
    return [
      PropertyGroup.of({
        header: null,
        values: [
          PropertyString.of({
            // The display label of the property
            name: 'Device ID',
            // A human-readable description of the property
            description: 'This is the ID for syncthing to attach others to',
            // The value of the property
            value: deviceId,
            // optionally display a copy button with the property
            copyable: true,
            // optionally permit displaying the property as a QR code
            qr: true,
            // optionally mask the value of the property
            masked: false,
          }),
          PropertyString.of({
            // The display label of the property
            name: 'Username',
            // A human-readable description of the property
            description: 'Username to login to the UI',
            // The value of the property
            value: username,
            // optionally display a copy button with the property
            copyable: true,
            // optionally permit displaying the property as a QR code
            qr: false,
            // optionally mask the value of the property
            masked: false,
          }),
          PropertyString.of({
            // The display label of the property
            name: 'Password',
            // A human-readable description of the property
            description: 'Password to login to the UI',
            // The value of the property
            value: password,
            // optionally display a copy button with the property
            copyable: true,
            // optionally permit displaying the property as a QR code
            qr: false,
            // optionally mask the value of the property
            masked: true,
          }),
        ],
      }),
    ]
  },
)
