# Linux Setup

First, download Syncthing for your system from syncthing.net, or via your package manager.

1. Install the Syncthing package of your choice.  You can get a GUI (GTK/Python) or use the tray application with a WebUI.  This example will use the WebUI.
1. The first screen will ask if you would like to provide reports to Syncthing to help them improve the software.  Make your decision.
    ![Usage](/docs/assets/lin-syncthing0.png)

1. Syncthing will ask if you'd like to setup a user/password for the GUI.  Since you are only accessing this on your computer, this is not necessary.  If you want to expose the GUI to the network, then you may wish to add a user and password.
    ![Usage](/docs/assets/lin-syncthing1.png)

# Add Your Embassy

Your Syncthing dashboard is now showing with "Folders" on the left and "Devices" on the right.  You may add any Syncthing device from any other Syncthing device.

1. Go to "Settings > Syncthing Options > Device Name," and give your Linux machine a name you won't forget
1. Click "Add Remote Device"
    ![Add Device](/docs/assets/lin-syncthing4.png)

1. In your Embassy, go to "Syncthing > Properties" and copy your Embassy Syncthing device ID. This can also be obtained from your Embassy Syncthing web interface
1. Paste into the "Device ID" field of Syncthing on your Linux machine.  Name the device something you will remember.
    ![Device Options](/docs/assets/lin-syncthing5.png)

1. Under the "Sharing" tab, you may wish to enable the device as an "Introducer," but we recommend leaving it disabled until you have time to understand what it is for and how it works.  You could also choose to share additional folders here, if you had any setup.  Click "Save."
    ![Sharing](/docs/assets/lin-syncthing6.png)

1. Back on your Embassy Syncthing Dashboard, you will see a banner pop up and ask you to confirm adding the device.  If you do not see it, wait 5 seconds and refresh the page.  Click "+ Add Device."
    ![Connect](/docs/assets/lin-syncthing7.png)

1. You will see the same "Add Device" dialogue as before.  Select your desired options (leaving the Device ID alone).  Click "Save."

# Share a Folder

We could use the default folder, but to learn the process, let's add a new folder.  For this example we've created a directory in my Home called `synctest` and added some files to it.

1. Click "Add Folder"
    ![Add Folder](/docs/assets/lin-syncthing2.png)

1. Type in a "Folder Label."  If you use the name of the directory, Syncthing will make a guess at the path below.  Verify this is correct and change if it is not.
    ![Folder Options](/docs/assets/lin-syncthing3.png)

1. Under "Folder Type", we recommend setting it to "Send Only". This means that your Embassy is truly just a backup. If you edit, add, or delete files inside this shared folder in your Embassy, those changes will not be honored. Your Linux machine is the source of truth. By using "Send and Receive" or "Receive Only" you are granting your Embassy the power to edit, add, or delete files from your Linux machine. While this is very powerful, it can also be dangerous, so be careful.

1. Then click "Save."

That's it!  The folder you selected will begin to sync immediately.  This will show in both Syncthing dashboards, but we can also verify by visiting the `syncthing` folder in File Browser in Embassy to ensure the new files are there.

