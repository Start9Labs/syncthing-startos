#!/bin/sh

# export HOME=/root
su -s /bin/sh -c "syncthing serve --no-restart" syncthing_user &
syncthing_process=$!
# su -c /bin/sh syncthing_user
export HOME=/home/syncthing_user
while [[ "$(syncthing cli show system)" =~ 'no such file or directory' ]] || [[ "$(syncthing cli show system)" =~ 'connection refused' ]] || [[ "$(syncthing cli config gui user get)" =~ 'connection refused' ]]; do
  sleep .2
done
echo "Syncthing Settings"
syncthing cli config gui raw-address set -- 0.0.0.0:8384
sleep .1
syncthing cli config gui user set -- admin
sleep .1
syncthing cli config gui password set -- test123
sleep .1
syncthing cli config options uraccepted set -- -1

wait -n
