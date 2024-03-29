FROM syncthing/syncthing:1.27.3 AS build

RUN apk add --no-cache curl jq tini inotify-tools yq && \
    rm -rf /var/cache/apk/*

RUN adduser --disabled-password syncthing_user

COPY docker_files/* /usr/local/bin

ENV STGUIADDRESS=0.0.0.0:8384

EXPOSE 8384/tcp
EXPOSE 22000/tcp

EXPOSE 8384/udp
EXPOSE 22000/udp

ENTRYPOINT ["tini"]

CMD ["entrypoint.sh"]
