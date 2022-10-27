FROM syncthing/syncthing:1.22.0

FROM alpine:3.15

RUN apk add --no-cache yq

COPY --from=0 /bin/syncthing /usr/bin/

RUN adduser --disabled-password syncthing_user

COPY docker_files/watch-and-own.sh /usr/bin
COPY docker_files/version-old.sh /usr/bin

EXPOSE 8384/tcp
EXPOSE 22000/tcp

EXPOSE 8384/udp
EXPOSE 22000/udp