# Android Setup

## Initial Setup

1. Download Syncthing from your application store of choice
1. Grant Syncthing the permissions it needs to operate smoothly.
1. Inside "Settings", review the various options, such as when Syncthing should run, whether or not it should run in the background, whether it should use WiFi or cellular data. These are important considerations, as they will affect your experince and may have significant impact on your battery and/or phone bill.

## Add Your Embassy

1. Go to Settings -> Syncthing Options -> Device Name, and give your Android device a name you won't forget
1. Back on the main screen, in the "Devices" tab click "+"
1. In your Embassy, go to "Syncthing > Properties" and get your Embassy Syncthing device ID. This can also be obtained from your Embassy Syncthing web interface
1. Back in the Android Syncthing app, enter your Embassy device ID. You could also scan the QR code
1. We recommend disabling "Introducer" until you have had time to understand what it does and how to use it
1. Click the checkmark in the top right to save

## Share a Folder

1. In your Android Syncthing app, in the folders tab click "+" 
1. Name the folder
1. Click "Directory" and select the folder you want to share
1. Turn on the toggle to share with your Embassy
1. Under "Folder Type", we recommend setting it to "Send Only". This means that your Embassy is truly just a backup. If you edit, add, or delete files inside this shared folder in your Embassy, those changes will not be honored. You Android device is the source of truth. By using "Send and Receive" or "Receive Only" you are granting your Embassy the power to edit, add, or delete files from your phone. While this is very powerful, it can also be dangerous, so be careful
1. Optionally set "Watch for Changes" and "File Pull Order"
1. Tap the checkmark to save
1. This folder should immediately begin syncing to File Browser on your Embassy inside the "syncthing folder"
