# Embassy Setup

**Note:** File Browser is a prerequisite for Syncthing, so make sure you have that installed first.

1. Head over to the Marketplace and install Syncthing.

2. Once it is installed, hit Config.  A random, strong password has been generated for your admin account, but you may change it if you wish.  Then click Save.

3. Click Start to run the Service.  While it is starting, click Properties and copy your password.  We will need this shortly.

4. Once you see the Health Checks showing "Success," go ahead and launch the UI.  This will work on both LAN and Tor.  Obviously LAN is a bit faster if it is available to you.  You may like to [Setup LAN Access](https://start9.com/latest/user-manual/connecting/connecting-lan), if you have not already.

5. Enter your username and paste in your password from earlier.  Save these into your Bitwarden for easy access.

## Setup Folders

Welcome to your Syncthing Admin Interface.  This is the control panel for adding devices and folders that you would like to keep in sync.

The panel on the left side are the folders for syncing, and the right side are the devices, with your Embassy as "This Device," with additional metrics.

Let's set up an example folder to sync photos with

1. Within your Syncthing interface click "Add Folder"

2. In "Folder ID" enter the name of the folder you'd like to create - this will automatically be placed within the directory FileBrowser already has for Syncthing.

3. Next - click "Save"

4. In the future, once you have added other devices, you can return to this folder, click "Edit", go to "Sharing" and add any device you wish to share this folder with.

That's it, you have a folder ready to sync to other devices!

See the following guides for each device you would like to setup:

[Linux](./linux.md)

[MacOS](./macos.md)

[Windows](./windows.md)

[Android](./android.md)

[iOS](./ios.md)
