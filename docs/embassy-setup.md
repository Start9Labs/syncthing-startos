# Embassy Setup

**Note:** File Browser is a prerequisite for Syncthing, so make sure you have that installed first.

1 - Head over to the Marketplace and install Syncthing.
2 - Once it is installed, hit Config.  A random, strong password has been generated for your admin account, but you may change it if you wish.  Then click Save.
3 - Click Start to run the Service.  While it is starting, click Properties and copy your password.  We will need this shortly.
4 - Once you see the Health Checks showing "Success," go ahead and launch the UI.  This will work on both LAN and Tor.  Obviously LAN is a bit faster if it is available to you.  You may like to [Setup LAN Access](https://start9.com/latest/user-manual/connecting/connecting-lan), if you have not already.
5 - Enter your username and paste in your password from earlier.  Save these into your Bitwarden for easy access.

## Setup Folders

Welcome to your Syncthing Admin Interface.  This is the control panel for adding devices and folders that you would like to keep in sync.

The panel on the left side are the folders for syncing, and the right side are the devices, with your Embassy as "This Device," with additional metrics.

Let's set up an example folder to sync photos with

1 - Open your File Browser UI from your Embassy
2 - You will see that a new directory has been created for you called "syncthing" - go ahead and enter this directory
3 - You will see a folder called Sync.  This is the default folder and it will automatically sync across all devices.  We recommend making your own folders so that you may fine tune for different use cases.  For this example, we create a directory and call it "Photos."  Then we'll drag in a couple pictures to test with.
4 - Next, back in your Admin Interface, Click "Add Folder."
5 - Fill in the Folder Label with the name of the directory ("Photos"), this will edit the folder path below.  Ensure it is correct.  Then click Save.

That's it, you have a folder with pictures, ready to sync to other devices!

See the following guides for each device you would like to setup:

[Linux](./linux.md)
[MacOS](./macos.md)
[Windows](./windows.md)
[Android](./android.md)
[iOS](./ios.md)
