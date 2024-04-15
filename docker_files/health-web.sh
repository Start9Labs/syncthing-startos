#!/bin/sh

check_web(){
    echo 'Checking web'
    curl --silent --fail localhost:8384/rest/noauth/health &>/dev/null
    RES=$?
    echo RES
    if test "$RES" != 0; then
        echo "Error: Web interface is unreachable" > /root/data/health-web
    else
        echo "Ok: Web interface is reachable" > /root/data/health-web
    fi
}
echo 'running check web'
while true ; do
    check_web
    sleep 60
done

