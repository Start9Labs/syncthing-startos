#!/bin/sh

check_web(){
    curl -u $(jq -r '.username' /root/config.json):$(jq -r '.password' /root/config.json) --silent --fail localhost:8384/ &>/dev/null
    RES=$?
    echo RES
    if test "$RES" != 0; then
        echo "Web interface is unreachable" >&2
        exit 1
    fi
}

case "$1" in
	web)
        check_web
        ;;
    *)
        echo "Usage: $0 [command]"
        echo
        echo "Commands:"
        echo "         web"
esac