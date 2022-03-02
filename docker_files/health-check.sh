#!/bin/sh

check_web(){
    curl --silent --fail localhost:8384/ &>/dev/null
    RES=$?
    if test "$RES" != 0 && test "$RES" != 22; then
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