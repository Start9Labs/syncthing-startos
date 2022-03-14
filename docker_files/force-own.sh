#!/bin/sh

chown -R syncthing_user /mnt/filebrowser/syncthing
cat << EOF
{
    "version": "0",
    "message": "Has changed permissions",
    "value": null,
    "copyable": false,
    "qr": false
}
EOF