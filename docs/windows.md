# Syncthing Setup Windows

First, download Syncthing for your system from Syncthing.net.  You may choose the base install, but for this guide we will use the SyncTrazor application, available from https://syncthing.net/downloads.

1. Complete the installation and launch the application

2. You will be asked if you would like to provide usage information for the developers, make your decision

![Usage Info](/docs/assets/lin-syncthing0.png)

3. Syncthing will ask if you'd like to setup a user/password for the GUI.  Since you are only accessing this on your computer, this is not necessary.  If you want to expose the GUI to the network, then you may wish to add a user and password.

![GUI User](/docs/assets/lin-syncthing1.png)

# Add a Folder

Your Syncthing dashboard is now showing with "Folders" on the left and "Devices" on the right.  We could use the default folder, but to learn the process, let's add a new folder.  For this example I've created a directory on my desktop called `synctest` and added some files to it.

1. Click "Add Folder"

![Add Folder](/docs/assets/win-syncthing2.png)

2. Type in a "Folder Label."  If you use the name of the directory, Syncthing will make a guess at the path below.  Verify this is correct and change if it is not.

![Folder Options](/docs/assets/win-syncthing3.png)

3. Then click "Save."

# Add a Device

You may add any Syncthing device from any other Syncthing device

1. In your Syncthing dashboard, click "Add Remote Device."

![Add Device](/docs/assets/win-syncthing4.png)

2. On the Syncthing dashboard of the device you are adding, click the "Device ID" and copy it.

3. Paste into the "Device ID" field of the Syncthing you are adding to.  You may name the device if you wish or leave blank for default.

![Device Options](/docs/assets/win-syncthing5.png)

4. Under the "Sharing" tab, you may wish to enable the device as an "Introducer," meaning that it can share its device list.  You could also choose to share additional folders here, if you had any setup.  Click "Save."

![Sharing](/docs/assets/win-syncthing6.png)

5. Back on the device you are adding, you will see a banner pop up and ask you to confirm adding the device.  If you do not see it, wait 10 seconds and refresh the page.  Click "+ Add Device."

6. You will see the same "Add Device" dialogue as before, this time for the device you were adding from.  Select your desired options (leaving the Device ID alone).  Make sure to select the folders you want to share, in this case, `synctest`. Click "+ Add Device."

That's it!  In just a moment the folders you selected will begin to sync.  This will show in both Syncthing dashboards, but we can also verify by visiting File Browser in Embassy to ensure the new files are there.
