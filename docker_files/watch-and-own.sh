#!/bin/sh

while true; do
    inotifywait -q -r /mnt/filebrowser/syncthing
    chown -R syncthing_user /mnt/filebrowser/syncthing
    sleep 3
done