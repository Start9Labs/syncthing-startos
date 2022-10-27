#!/bin/sh
if ! test -d /mnt/filebrowser
then
  exit 0
fi

rm /root/health-web
rm /root/health-version
mkdir /mnt/filebrowser/syncthing
chown -R syncthing_user /mnt/filebrowser/syncthing
su -s /bin/sh -c "HOME=/mnt/filebrowser/syncthing syncthing serve --no-restart --reset-deltas --no-default-folder" syncthing_user &
syncthing_process=$!
export HOME=/mnt/filebrowser/syncthing

while [[ "$(syncthing cli show system)" =~ 'no such file or directory' ]] || [[ "$(syncthing cli show system)" =~ 'connection refused' ]] || [[ "$(syncthing cli config gui user get)" =~ 'connection refused' ]]; do
  sleep .2
  echo "I'm sleeping"
done
echo "Syncthing Settings"
sleep .1
syncthing cli config gui raw-address set -- 0.0.0.0:8384
syncthing cli config gui user set -- $(jq -r '.username' /root/config.json)
syncthing cli config gui password set -- $(jq -r '.password' /root/config.json)
syncthing cli config options uraccepted set -- -1
syncthing cli config defaults device auto-accept-folders set true
syncthing cli config defaults device introducer set true

while [[ "$(syncthing cli show system)" =~ 'no such file or directory' ]] || [[ "$(syncthing cli show system)" =~ 'connection refused' ]] || [[ "$(syncthing cli config gui user get)" =~ 'connection refused' ]]; do
  sleep .2
  echo "I'm sleeping"
done

syncthing cli show system > /root/syncthing_stats.json

watch-and-own.sh &

health-version.sh &
health-web.sh &

wait -n
