#!/bin/sh

_term() { 
  echo "Caught SIGTERM signal!" 
  kill -TERM "$filebrowser_process" 2>/dev/null
}

# if [ ! -f /root/filebrowser.db ]; then
    # mkdir -p /root/start9
    # mkdir /root/www
    # mkdir /root/data
    # mkdir /root/dav
    # filebrowser config init
    # filebrowser config set --address=0.0.0.0 --port=8080 --root=/root/data
    # password=$(cat /dev/urandom | base64 | head -c 16)
    # echo 'version: 2' > /root/start9/stats.yaml
    # echo 'data:' >> /root/start9/stats.yaml
    # echo '  Default Username:' >> /root/start9/stats.yaml
    # echo '    type: string' >> /root/start9/stats.yaml
    # echo '    value: admin' >> /root/start9/stats.yaml
    # echo '    description: This is your default username. While it is not necessary, you may change it inside your File Browser web application. That change, however, will not be reflected here. If you change your default username and forget your new username, you can regain access by resetting the root user.' >> /root/start9/stats.yaml
    # echo '    copyable: true' >> /root/start9/stats.yaml
    # echo '    masked: false' >> /root/start9/stats.yaml
    # echo '    qr: false' >> /root/start9/stats.yaml
    # echo '  Default Password:' >> /root/start9/stats.yaml
    # echo '    type: string' >> /root/start9/stats.yaml
    # echo '    value: "'"$password"'"' >> /root/start9/stats.yaml
    # echo '    description: This is your randomly-generated, default password. While it is not necessary, you may change it inside your File Browser web application. That change, however, will not be reflected here.' >> /root/start9/stats.yaml
    # echo '    copyable: true' >> /root/start9/stats.yaml
    # echo '    masked: true' >> /root/start9/stats.yaml
    # echo '    qr: false' >> /root/start9/stats.yaml
    # filebrowser users add admin "$password" --perm.admin=true
# fi

# if [ "$1" = "reset-root-user" ]; then
    # password=$(cat /dev/urandom | base64 | head -c 16)
    # echo 'version: 2' > /root/start9/stats.yaml
    # echo 'data:' >> /root/start9/stats.yaml
    # echo '  Default Username:' >> /root/start9/stats.yaml
    # echo '    type: string' >> /root/start9/stats.yaml
    # echo '    value: admin' >> /root/start9/stats.yaml
    # echo '    description: This is your default username. While it is not necessary, you may change it inside your File Browser web application. That change, however, will not be reflected here. If you change your default username and forget your new username, you can regain access by resetting the root user.' >> /root/start9/stats.yaml
    # echo '    copyable: true' >> /root/start9/stats.yaml
    # echo '    masked: false' >> /root/start9/stats.yaml
    # echo '    qr: false' >> /root/start9/stats.yaml
    # echo '  Default Password:' >> /root/start9/stats.yaml
    # echo '    type: string' >> /root/start9/stats.yaml
    # echo '    value: "'"$password"'"' >> /root/start9/stats.yaml
    # echo '    description: This is your randomly-generated, default password. While it is not necessary, you may change it inside your File Browser web application. That change, however, will not be reflected here.' >> /root/start9/stats.yaml
    # echo '    copyable: true' >> /root/start9/stats.yaml
    # echo '    masked: true' >> /root/start9/stats.yaml
    # echo '    qr: false' >> /root/start9/stats.yaml
    # filebrowser users update 1 -u admin >/dev/null
    # filebrowser users update 1 -p "$password" > /dev/null
    # filebrowser users update 1 --perm.admin > /dev/null
    # action_result="    {
    #     \"version\": \"0\",
    #     \"message\": \"Here is your new password. This will also be reflected in the Properties page for this service.\",
    #     \"value\": \"$password\",
    #     \"copyable\": true,
    #     \"qr\": false
    # }"
    # echo $action_result
    # exit 0
# fi

syncthing generate

xq -x '.configuration.gui.address |= "0.0.0.0:8384"' ~/.config/syncthing/config.xml > ~/.config/syncthing/config2.xml
mv ~/.config/syncthing/config2.xml ~/.config/syncthing/config.xml
tini -sp SIGTERM -- syncthing --config=/root/.config/syncthing --data=/root/db --gui-address=0.0.0.0:8384 &
syncthing_process=$1

trap _term SIGTERM

wait -n $syncthing_process