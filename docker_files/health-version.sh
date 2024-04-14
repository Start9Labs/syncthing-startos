while true ; do
    echo "Health Check into file"
  HOME=/mnt/filebrowser/syncthing syncthing cli config version get > /root/data/health-version
  sleep 60
done

