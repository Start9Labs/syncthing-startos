FROM syncthing/syncthing:1.19.1

FROM alpine:3.15

RUN apk add --no-cache tini
RUN apk add --no-cache yq
RUN apk add --no-cache curl

COPY --from=0 /bin/syncthing /usr/bin/

RUN adduser --disabled-password syncthing_user

COPY docker_files/entrypoint.sh /usr/local/bin/entrypoint.sh

COPY controller/target/aarch64-unknown-linux-musl/release/controller /usr/bin
COPY docker_files/health-check.sh /usr/bin
COPY docker_files/watch-and-own.sh /usr/bin

EXPOSE 8384/tcp
EXPOSE 22000/tcp

EXPOSE 8384/udp
EXPOSE 22000/udp

ENTRYPOINT ["tini"]

CMD ["entrypoint.sh"]