# Syncthing Setup Mac

1. Syncthing can be downloaded for MacOS here -> https://github.com/syncthing/syncthing-macos/releases/tag/v1.19.1-1

2. Open the DMG, drag Syncthing into you applications folder and open it from there.

3. You will be warned that it was downloaded from the internet -> click Open.

![Warning](/docs/assets/macwarning.png)

4. It will appear in the system tray at the top.

![Tray](/docs/assets/sycnthingsystemtray.png)

5. Click on it and click "Open" -> This will take you to the browser interface.

# Add a Folder

Your Syncthing dashboard is now showing with "Folders" on the left and "Devices" on the right.  We could use the default folder, but to learn the process, let's add a new folder.  For this example I've created a directory in my Home called `synctest` and added some files to it.

1. Click "Add Folder"

![Add Folder](/docs/assets/lin-syncthing2.png)

2. Type in a "Folder Label."  If you use the name of the directory, Syncthing will make a guess at the path below.  Verify this is correct and change if it is not.

![Folder Options](/docs/assets/lin-syncthing3.png)

3. Then click "Save."

# Add a Device

You may add any Syncthing device from any other Syncthing device

1. In your Syncthing dashboard, click "Add Remote Device."

![Add Device](/docs/assets/lin-syncthing4.png)

2. On the Syncthing dashboard of the device you are adding, click the "Device ID" and copy it.

3. Paste into the "Device ID" field of the Syncthing you are adding to.  You may name the device if you wish or leave blank for default.

![Device Options](/docs/assets/lin-syncthing5.png)

4. Under the "Sharing" tab, you may wish to enable the device as an "Introducer," meaning that it can share its device list.  You could also choose to share additional folders here, if you had any setup.  Click "Save."

![Sharing](/docs/assets/lin-syncthing6.png)

5. Back on the device you are adding, you will see a banner pop up and ask you to confirm adding the device.  If you do not see it, wait 10 seconds and refresh the page.  Click "+ Add Device."

![Connect](/docs/assets/lin-syncthing7.png)

6. You will see the same "Add Device" dialogue as before, this time for the device you were adding from.  Select your desired options (leaving the Device ID alone).  Make sure to select the folders you want to share, in this case, `synctest`. Click "+ Add Device."

That's it!  In just a moment the folders you selected will begin to sync.  This will show in both Syncthing dashboards, but we can also verify by visiting File Browser in Embassy to ensure the new files are there.
