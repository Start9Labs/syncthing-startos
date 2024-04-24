FROM syncthing/syncthing:1.27.6 AS build

RUN apk add --no-cache curl tini inotify-tools yq && \
    rm -rf /var/cache/apk/*

RUN adduser --disabled-password -h /mnt/filebrowser/syncthing syncthing_user

COPY docker_files/* /usr/local/bin

ENV STGUIADDRESS=0.0.0.0:8384
ENV HOME="/mnt/filebrowser/syncthing"
ENV STHOMEDIR="/mnt/filebrowser/syncthing/.config/syncthing"

EXPOSE 8384/tcp
EXPOSE 22000/tcp

EXPOSE 8384/udp
EXPOSE 22000/udp

ENTRYPOINT ["tini"]

CMD ["entrypoint.sh"]
