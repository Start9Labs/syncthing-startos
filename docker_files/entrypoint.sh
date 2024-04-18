#!/bin/sh

printf "\n\n [i] Starting Syncthing ...\n\n"

if ! test -d /mnt/filebrowser
then
  exit 0
fi

rm -f /root/data/health-web
rm -f /root/data/health-version
export HOME="/mnt/filebrowser/syncthing"
export STHOMEDIR="/mnt/filebrowser/syncthing/.config/syncthing"
SU=$(yq '.username' /root/data/start9/config.yaml)
SP=$(yq '.password' /root/data/start9/config.yaml)
ln -s $STHOMEDIR /var/syncthing/config
mkdir -p $HOME
chown -R syncthing_user $HOME

su-exec syncthing_user syncthing generate --no-default-folder --skip-port-probing --gui-user=$SU --gui-password=$SP

echo "Adjusting Syncthing Default Settings"
yq -i -p xml -o xml '.configuration.options.urAccepted = "-1"' $STHOMEDIR/config.xml
yq -i -p xml -o xml '.configuration.gui.address = "0.0.0.0:8384"' $STHOMEDIR/config.xml
yq -i -p xml -o xml '.configuration.device.autoAcceptFolders = "true"' $STHOMEDIR/config.xml
yq -i -p xml -o xml '.configuration.defaults.device.+@introducer = "true"' $STHOMEDIR/config.xml

DID=$(yq -oy '.configuration.device.+@id' $STHOMEDIR/config.xml)

cat << BTC > /root/data/start9/stats.yaml
---
version: 2
data:
  Device ID:
    type: string
    value: $DID
    description: This is the ID for syncthing to attach others to this device.
    copyable: true
    qr: true
    masked: false
  Username:
    type: string
    value: $SU
    description: Username to login to the UI.
    copyable: true
    qr: false
    masked: false
  Password:
    type: string
    value: $SP
    description: Password to login to the UI.
    copyable: true
    qr: false
    masked: true
BTC

su-exec syncthing_user syncthing serve --no-restart --reset-deltas --no-default-folder &
syncthing_process=$!

watch-and-own.sh &

health-version.sh &
health-web.sh &

wait -n
