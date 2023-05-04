import { setupManifest } from '@start9labs/start-sdk/lib/manifest/setupManifest'
import { actionsMetadata } from './procedures/actions'

/**
 * In this function you define static properties of the service
 */
export const manifest = setupManifest({
  dependencies: {
    filebrowser: {
      description: 'Used to store persisted data for Syncthing',
      requirement: {
        type: 'required',
      },
      version: '^2.14.1.1',
    },
  },
  description: {
    long: 'Syncthing provides a simple file managing and synchronization interface which can be used to upload, download, organize, edit, and share your files across multiple devices.\n',
    short:
      'Synchronizes files between devices in real time, safely protected from prying eyes',
  },
  donationUrl: 'https://syncthing.net/donations/',

  id: 'syncthing',

  license: 'apache',
  marketingSite: 'https://syncthing.org/',
  releaseNotes: '* Use new eOS APIs for backups\n',
  supportSite: 'https://github.com/syncthing/syncthing/issues',
  title: 'Syncthing',
  upstreamRepo: 'https://github.com/syncthing/syncthing',
  version: '1.23.0.1',
  wrapperRepo: 'https://github.com/Start9Labs/syncthing-wrapper',
  volumes: {
    main: 'data',
    'file-browser': '/mnt/filebrowser',
  },
  containers: {
    main: {
      // Identifier for the main image volume, which will be used when other actions need to mount to this volume.
      image: 'main',
      // Specifies where to mount the data volume(s), if there are any. Mounts for pointer dependency volumes are also denoted here. These are necessary if data needs to be read from / written to these volumes.
      mounts: {
        // Specifies where on the service's file system its persistence directory should be mounted prior to service startup

        filebrowser: '/mnt/filebrowser',
        main: '/root',
      },
    },
  },
  actions: actionsMetadata,
  alerts: {
    install: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
    update: null,
  },
  assets: {
    icon: 'assets/icon.svg',
    instructions: 'assets/INSTRUCTIONS.md',
    license: 'assets/LICENSE.md',
  },
  replaces: [],
})

export type Manifest = typeof manifest
