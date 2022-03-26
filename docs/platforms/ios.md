# Syncthing Setup iPhone/iOS:

- Currently there are no officially supported applications for iOS. The only actively maintained project is Möbius Sync - this is _not free_ and will require a one-time payment of $4.99 after the first 20 MB.

Start by downloading Möbius Sync - https://www.mobiussync.com/

# Add a folder

1. Open the app and add any local folder you wish to share (it can be empty)

2. You can now add data to this folder and it will be shared by any device you pair with and share the folder with (next step).

# Add a device

You can add any Syncthing device to any other Syncthing device

1. In your Syncthing dashboard, click "Add Remote Device."

![Add Device](/docs/assets/lin-syncthing4.png)

2. On the Syncthing dashboard of the device you are adding, click the "Device ID" and copy it.

3. Paste into the "Device ID" field of the Syncthing you are adding to. You may name the device if you wish or leave blank for default.

![Device Options](/docs/assets/lin-syncthing5.png)

4. Under the "Sharing" tab, you may wish to enable the device as an "Introducer," meaning that it can share its device list. You could also choose to share additional folders here, if you had any setup. Click "Save."

![Sharing](/docs/assets/lin-syncthing6.png)

5. Back on the device you are adding, you will see a banner pop up and ask you to confirm adding the device. If you do not see it, wait 10 seconds and refresh the page. Click "+ Add Device."

![Connect](/docs/assets/lin-syncthing7.png)

6. You will see the same "Add Device" dialogue as before, this time for the device you were adding from. Select your desired options (leaving the Device ID alone). Make sure to select the folders you want to share, in this case, `synctest`. Click "+ Add Device."

That's it! In just a moment the folders you selected will begin to sync. This will show in both Syncthing dashboards, but we can also verify by visiting File Browser in Embassy to ensure the new files are there.
