#!/bin/sh

check_web(){
    echo 'Checking web'
    curl -u $(jq -r '.username' /root/config.json):$(jq -r '.password' /root/config.json) --silent --fail localhost:8384/ &>/dev/null
    RES=$?
    echo RES
    if test "$RES" != 0; then
        echo "Error: Web interface is unreachable" > /root/health-web
    else
        echo "Ok: Web interface is reachable" > /root/health-web
    fi
}
echo 'runing check web'
while true ; do
    check_web
    sleep 60
done

