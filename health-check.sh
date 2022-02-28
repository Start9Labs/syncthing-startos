#!/bin/sh

check_web(){
    DURATION=$(</dev/stdin)
    if (($DURATION <= 10000 )); then
        exit 60
    else
        curl --silent --fail localhost:8384/ &>/dev/null
        RES=$?
        if test "$RES" != 0; then
            echo "Web interface is unreachable" >&2
            exit 1
        fi
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