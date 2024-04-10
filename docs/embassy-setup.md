# Initial Setup

**Note:** On StartOS, Syncthing depends on File Browser as its underlying file system.

1. Install Syncthing from the Start9 Service Marketplace.
1. Configure Syncthing. A default username and random password are created for you, but feel free to change either.
1. Click "Start".
1. Go into "Properties" and copy your password.
1. When Syncthing health checks show "Success," go ahead and launch the UI. You can use Syncthing on either LAN or Tor.
1. Enter your username and paste in your password from Properties (above). We recommend saving these credentials on your Vaultwarden Server for secure, easy access later on.
1. Inside Actions -> Settings, give your device a name. Something like "Bob on Start9".
1. It is recommended to familiarize yourself with the various other settings available to you.
1. Notice in File Browser, there is now a folder called "syncthing". **DO NOT** delete or rename this folder. It is where all your future shared folders will live.

## Basic Usage Instructions

Syncthing is very powerful, and also very complex. If you use it recklessly, you may experience buggy behavior or loss of data, _so be careful_.

How you use Syncthing will depend on your needs and how comfortable you become with the software. _Practice makes perfect_.

### **Our Recommendation**

We recommend that you begin using Syncthing as an automated cloud backup solution for your various client devices: phones, laptops, tablets, etc. This is a straightforward and easy-to-understand use case.

To accomplish this, you will install Syncthing on your client device, then add your Start9 server as a remote device. Then, you can select which folders to share with your Start9 server. From then on, those folders on your client device will be automatically backed up to your Start9 server's File Browser. It's magic :)

See the following guides for each device you would like to set up:

[Linux](./platforms/linux.md)

[MacOS](./platforms/macos.md)

[Windows](./platforms/windows.md)

[Android](./platforms/android.md)

[iOS](./platforms/ios.md)
