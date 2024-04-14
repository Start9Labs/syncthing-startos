#!/bin/sh
if ! test -d /mnt/filebrowser
then
  exit 0
fi

i=0

rm /root/data/health-web
rm /root/data/health-version
mkdir -p /mnt/filebrowser/syncthing
chown -R syncthing_user /mnt/filebrowser/syncthing
export HOME="/mnt/filebrowser/syncthing"
export STHOMEDIR="/mnt/filebrowser/syncthing/.config/syncthing"
su -s /bin/sh -c "syncthing serve --no-restart --reset-deltas --no-default-folder" syncthing_user &
syncthing_process=$!
# wait to fix properties race condition
sleep 2

while [[ "$(syncthing cli show system)" =~ 'no such file or directory' ]] || [[ "$(syncthing cli show system)" =~ 'connection refused' ]] || [[ "$(syncthing cli config gui user get)" =~ 'connection refused' ]]; do
  sleep .2
  echo "I'm sleeping"
  echo "COUNT is $i"
  i=$(expr $i + 1)
  if test $i -gt 200
  then
    exit 1
  fi
done
echo "Syncthing Settings"
sleep .1
syncthing cli config gui raw-address set -- 0.0.0.0:8384
syncthing cli config gui user set -- $(yq e '.username' /root/data/start9/config.yaml)
syncthing cli config gui password set -- $(yq e '.password' /root/data/start9/config.yaml)
syncthing cli config options uraccepted set -- -1
syncthing cli config defaults device auto-accept-folders set true
syncthing cli config defaults device introducer set true

while [[ "$(syncthing cli show system)" =~ 'no such file or directory' ]] || [[ "$(syncthing cli show system)" =~ 'connection refused' ]] || [[ "$(syncthing cli config gui user get)" =~ 'connection refused' ]]; do
  sleep .2
  echo "I'm sleeping"
  echo "COUNT is $i"
  i=$(expr $i + 1)
  if test $i -gt 200
  then
    exit 1
  fi
done

syncthing cli show system > /root/data/syncthing_stats.json

SU=$(yq '.username' /root/data/start9/config.yaml)
SP=$(yq '.password' /root/data/start9/config.yaml)
DID=$(yq -oy '.myID' /root/data/syncthing_stats.json)

cat << BTC > /root/data/start9/stats.yaml
---
version: 2
data:
  Device ID:
    type: string
    value: $DID
    description: This is the ID for syncthing to attach others to this device.
    copyable: true
    qr: false
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

watch-and-own.sh &

health-version.sh &
health-web.sh &

wait -n
