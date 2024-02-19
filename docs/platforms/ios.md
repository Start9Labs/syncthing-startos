# iOS Setup

Currently there are no officially supported applications for iOS. The only actively maintained project is Möbius Sync - this is _not free_ and will require a one-time payment of $4.99 after the first 20 MB.

Start by downloading Möbius Sync - https://www.mobiussync.com/


# Add Your Start9 Server

You can add any Syncthing device to any other Syncthing device

1. In your Syncthing dashboard, click "Add Remote Device."
    ![Add Device](/docs/assets/lin-syncthing4.png)

1. In your Start9 Server, go to "Syncthing > Properties" and copy your Start9 Server Syncthing device ID. This can also be obtained from your Start9 Server Syncthing web interface
1. Paste into the "Device ID" field of the Syncthing on your iOS device.  You may name the device if you wish or leave blank for default.
    ![Device Options](/docs/assets/lin-syncthing5.png)

1. Under the "Sharing" tab, you may wish to enable the device as an "Introducer," but we recommend leaving it disabled until you have time to understand what it is for and how it works.  You could also choose to share additional folders here, if you had any setup.  Click "Save."
    ![Sharing](/docs/assets/lin-syncthing6.png)

1. Back on the device you are adding, you will see a banner pop up and ask you to confirm adding the device. If you do not see it, wait 10 seconds and refresh the page. Click "+ Add Device."
    ![Connect](/docs/assets/lin-syncthing7.png)

1. Back on your Start9 Server Syncthing Dashboard, you will see a banner pop up and ask you to confirm adding the device.  If you do not see it, wait 5 seconds and refresh the page.  Click "+ Add Device."
1. You will see the same "Add Device" dialogue as before.  Select your desired options (leaving the Device ID alone).  Click "Save."

# Share A folder

1. Open the app and add any local folder you wish to share (it can be empty)
1. Under "Folder Type", we recommend setting it to "Send Only". This means that your Start9 Server is truly just a backup. If you edit, add, or delete files inside this shared folder in your Start9 Server, those changes will not be honored. Your iOS device is the source of truth. By using "Send and Receive" or "Receive Only" you are granting your Start9 Server the power to edit, add, or delete files from your device. While this is very powerful, it can also be dangerous, so be careful.
1. Then click "Save."
1. You can now add data to this folder and it will be shared by any device you pair with and share the folder with (next step).

That's it!  The folder you selected will begin to sync immediately.  This will show in both Syncthing dashboards, but we can also verify by visiting the `syncthing` folder in File Browser in Start9 Server to ensure the new files are there.
