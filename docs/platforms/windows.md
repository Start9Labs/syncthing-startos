# Windows Setup

First, download Syncthing for your system from Syncthing.net.  You may choose the base install, but for this guide we will use the SyncTrazor application, available from https://syncthing.net/downloads.

1. Complete the installation and launch the application
1. You will be asked if you would like to provide usage information for the developers, make your decision
    ![Usage Info](/docs/assets/lin-syncthing0.png)

1. Syncthing will ask if you'd like to setup a user/password for the GUI.  Since you are only accessing this on your computer, this is not necessary.  If you want to expose the GUI to the network, then you may wish to add a user and password.
    ![GUI User](/docs/assets/lin-syncthing1.png)

# Add Your Start9 Server

Your Syncthing dashboard is now showing with "Folders" on the left and "Devices" on the right.  You may add any Syncthing device from any other Syncthing device.

1. In your Syncthing dashboard, click "Add Remote Device."
    ![Add Device](/docs/assets/win-syncthing4.png)

1. In your Start9 Server, go to "Syncthing > Properties" and copy your Start9 Server Syncthing device ID. This can also be obtained from your Start9 Server Syncthing web interface
1. Paste into the "Device ID" field of the Syncthing on your Windows machine.  You may name the device if you wish or leave blank for default.
    ![Device Options](/docs/assets/win-syncthing5.png)

1. Under the "Sharing" tab, you may wish to enable the device as an "Introducer," but we recommend leaving it disabled until you have time to understand what it is for and how it works.  You could also choose to share additional folders here, if you had any setup.  Click "Save."
    ![Sharing](/docs/assets/win-syncthing6.png)

1. Back on your Start9 Server Syncthing Dashboard, you will see a banner pop up and ask you to confirm adding the device.  If you do not see it, wait 5 seconds and refresh the page.  Click "+ Add Device."
1. You will see the same "Add Device" dialogue as before.  Select your desired options (leaving the Device ID alone).  Click "Save."

# Share a Folder
We could use the default folder, but to learn the process, let's add a new folder.  For this example we've created a directory on my desktop called `synctest` and added some files to it.

1. Click "Add Folder"
    ![Add Folder](/docs/assets/win-syncthing2.png)

1. Type in a "Folder Label."  If you use the name of the directory, Syncthing will make a guess at the path below.  Verify this is correct and change if it is not.
    ![Folder Options](/docs/assets/win-syncthing3.png)

1. Under "Folder Type", we recommend setting it to "Send Only". This means that youStart9 Server is truly just a backup. If you edit, add, or delete files inside this shared folder in your Start9 Server, those changes will not be honored. Your Windows machine is the source of truth. By using "Send and Receive" or "Receive Only" you are granting your Start9 Server the power to edit, add, or delete files from your Windows machine. While this is very powerful, it can also be dangerous, so be careful.
1. Then click "Save."

That's it!  The folder you selected will begin to sync immediately.  This will show in both Syncthing dashboards, but we can also verify by visiting the `syncthing` folder in File Browser in your Start9 Server to ensure the new files are there.
