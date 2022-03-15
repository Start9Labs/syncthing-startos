# Syncthing Setup Linux

First, download Syncthing for your system from syncthing.net, or via your package manager.

1. Install the Syncthing package of your choice.  You can get a GUI (GTK/Python) or use the tray application with a WebUI.  This example will use the WebUI.
2. The first screen will ask if you would like to provide reports to Syncthing to help them improve the software.  Make your decision.
3. Syncthing will ask if you'd like to setup a user/password for the GUI.  Since you are only accessing this on your computer, this is not necessary.  If you want to expose the GUI to the network, then you may wish to add a user and password.

# Add a Folder

Your syncthing dashboard is now showing with Folders on the left and Devices on the right.  We could use the default folder, but to learn the process, let's add a new folder.  For this example I've created a directory in my Home called synctest and added some files to it.  

1. Click "Add Folder" and type in a description.  If you use the name of the directory, syncthing will make a guess at the path below.  Verify this is correct and change if it is not.  
2. Then click Save.

# Add a Device

You may add any syncthing device from any other syncthing device

1. In your Syncthing dashboard, click Add Device
2. On the Syncthing dashboard of the device you are adding, click the ID and copy it.
3. Paste into the device ID field of the Syncthing you are adding to.  You may name the device if you wish or leave blank for default
4. Under the Sharing tab, you may wish to enable the device as an "Introducer," meaning that it can share its device list.  You could also choose to share additional folders here, if you had any setup.  Click Save.
5. Back on the device you are adding, you will see a banner pop up and ask you to confirm adding the device.  If you do not see it, wait 10 seconds and refresh the page.  Click "+ Add Device"
6. You will see the same Add Device dialogue as before, this time for the device you were adding from.  Select your desired options (leaving the device ID alone).  Make sure to select the folders you want to share, in this case, synctest. Click Save

That's it!  In just a moment the folders you selected will begin to sync.  This will show in both Syncthing dashboards, but we can also verify by visiting File Browser in Embassy to ensure the new files are there.
