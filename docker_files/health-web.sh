#!/bin/sh

check_web(){
    echo 'Checking web'
    curl -u $(yq e '.username' /root/start9/config.yaml):$(yq e '.password' /root/start9/config.yaml) --silent --fail localhost:8384/ &>/dev/null
    RES=$?
    echo RES
    if test "$RES" != 0; then
        echo "Error: Web interface is unreachable" > /root/health-web
    else
        echo "Ok: Web interface is reachable" > /root/health-web
    fi
}
echo 'running check web'
while true ; do
    check_web
    sleep 60
done

