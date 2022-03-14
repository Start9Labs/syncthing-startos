#!/bin/sh

while true; do
    inotifywait -q -r /mnt/filebrowser/syncthing
    sleep 10
    chown -R syncthing_user /mnt/filebrowser/syncthing
done