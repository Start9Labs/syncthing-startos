#!/bin/sh
if ! test -d /mnt/filebrowser
then
  exit 0
fi

i=0

rm /root/health-web
rm /root/health-version
mkdir -p /mnt/filebrowser/syncthing
chown -R syncthing_user /mnt/filebrowser/syncthing
export HOME="/mnt/filebrowser/syncthing"
export STHOMEDIR="/mnt/filebrowser/syncthing/.local/state/syncthing"
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
syncthing cli config gui user set -- $(yq e '.username' /root/start9/config.yaml)
syncthing cli config gui password set -- $(yq e '.password' /root/start9/config.yaml)
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

syncthing cli show system > /root/syncthing_stats.json

watch-and-own.sh &

health-version.sh &
health-web.sh &

wait -n
