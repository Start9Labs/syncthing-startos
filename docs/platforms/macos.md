# Mac Setup

1. Syncthing can be downloaded for MacOS here -> https://github.com/syncthing/syncthing-macos/releases/tag/v1.19.1-1
1. Open the DMG, drag Syncthing into you applications folder and open it from there.
1. You will be warned that it was downloaded from the internet -> click Open.
    ![Warning](/docs/assets/macwarning.png)

1. It will appear in the system tray at the top.
    ![Tray](/docs/assets/sycnthingsystemtray.png)

1. Click on it and click "Open" -> This will take you to the browser interface.

# Add Your Embassy

Your Syncthing dashboard is now showing with "Folders" on the left and "Devices" on the right.  You may add any Syncthing device from any other Syncthing device.

1. In your Syncthing dashboard, click "Add Remote Device."
    ![Add Device](/docs/assets/lin-syncthing4.png)

1. In your Embassy, go to "Syncthing > Properties" and copy your Embassy Syncthing device ID. This can also be obtained from your Embassy Syncthing web interface
1. Paste into the "Device ID" field of the Syncthing on your Mac.  You may name the device if you wish or leave blank for default.
    ![Device Options](/docs/assets/lin-syncthing5.png)

1. Under the "Sharing" tab, you may wish to enable the device as an "Introducer," but we recommend leaving it disabled until you have time to understand what it is for and how it works.  You could also choose to share additional folders here, if you had any setup.  Click "Save."
    ![Sharing](/docs/assets/lin-syncthing6.png)

1. Back on your Embassy Syncthing Dashboard, you will see a banner pop up and ask you to confirm adding the device.  If you do not see it, wait 5 seconds and refresh the page.  Click "+ Add Device."
    ![Connect](/docs/assets/lin-syncthing7.png)

1. You will see the same "Add Device" dialogue as before.  Select your desired options (leaving the Device ID alone).  Click "Save."

# Add a Folder

We could use the default folder, but to learn the process, let's add a new folder.  For this example we've created a directory in my Home called `synctest` and added some files to it.

1. Click "Add Folder"
    ![Add Folder](/docs/assets/lin-syncthing2.png)

1. Type in a "Folder Label."  If you use the name of the directory, Syncthing will make a guess at the path below.  Verify this is correct and change if it is not.
    ![Folder Options](/docs/assets/lin-syncthing3.png)

1. Under "Folder Type", we recommend setting it to "Send Only". This means that your Embassy is truly just a backup. If you edit, add, or delete files inside this shared folder in your Embassy, those changes will not be honored. Your Mac is the source of truth. By using "Send and Receive" or "Receive Only" you are granting your Embassy the power to edit, add, or delete files from your Mac. While this is very powerful, it can also be dangerous, so be careful.
1. Then click "Save."

That's it!  The folder you selected will begin to sync immediately.  This will show in both Syncthing dashboards, but we can also verify by visiting the `syncthing` folder in File Browser in Embassy to ensure the new files are there.
