#!/bin/sh
if ! test -d /mnt/filebrowser
then
  exit 0
fi

mkdir /mnt/filebrowser/syncthing
chown -R syncthing_user /mnt/filebrowser/syncthing
su -s /bin/sh -c "HOME=/mnt/filebrowser/syncthing syncthing serve --no-restart" syncthing_user &
syncthing_process=$!
export HOME=/mnt/filebrowser/syncthing

while [[ "$(syncthing cli show system)" =~ 'no such file or directory' ]] || [[ "$(syncthing cli show system)" =~ 'connection refused' ]] || [[ "$(syncthing cli config gui user get)" =~ 'connection refused' ]]; do
  sleep .2
  echo "I'm sleeping"
done
echo "Syncthing Settings"
sleep .1
syncthing cli config gui raw-address set -- 0.0.0.0:8384
syncthing cli config gui user set -- $(yq eval '.username' /root/start9/config.yaml)
syncthing cli config gui password set -- $(yq eval '.password' /root/start9/config.yaml)
syncthing cli config options uraccepted set -- -1
syncthing cli config defaults device auto-accept-folders set true
syncthing cli config defaults device introducer set true


controller create-stats

watch-and-own.sh &

wait -n
