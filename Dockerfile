FROM syncthing/syncthing:1.27.3 AS build

FROM alpine:3.19

RUN apk add --no-cache curl jq tini inotify-tools yq && \
    rm -rf /var/cache/apk/*

COPY --from=build /bin/syncthing /usr/bin/

RUN adduser --disabled-password syncthing_user

COPY docker_files/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker_files/* /usr/bin

ENV STGUIADDRESS=0.0.0.0:8384

EXPOSE 8384/tcp
EXPOSE 22000/tcp

EXPOSE 8384/udp
EXPOSE 22000/udp

ENTRYPOINT ["tini"]

CMD ["entrypoint.sh"]
