#!/bin/sh
mkdir /root/syncthing
chown -R syncthing_user /root/syncthing
su -s /bin/sh -c "HOME=/root/syncthing syncthing serve --no-restart" syncthing_user &
syncthing_process=$!
export HOME=/root/syncthing

while [[ "$(syncthing cli show system)" =~ 'no such file or directory' ]] || [[ "$(syncthing cli show system)" =~ 'connection refused' ]] || [[ "$(syncthing cli config gui user get)" =~ 'connection refused' ]]; do
  sleep .2
  echo "I'm sleeping"
done
echo "Syncthing Settings"
syncthing cli config gui raw-address set -- 0.0.0.0:8384
sleep .1
syncthing cli config gui user set -- $(yq eval '.username' /root/start9/config.yaml)
sleep .1
syncthing cli config gui password set -- $(yq eval '.password' /root/start9/config.yaml)
sleep .1
syncthing cli config options uraccepted set -- -1

stats

wait -n
