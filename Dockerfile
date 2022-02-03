FROM alpine:3.15

# ARG S6_OVERLAY_VERSION=3.0.0.0-1
# ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch-${S6_OVERLAY_VERSION}.tar.xz /tmp
# RUN tar -C / -Jxpf /tmp/s6-overlay-noarch-${S6_OVERLAY_VERSION}.tar.xz
# ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-x86_64-${S6_OVERLAY_VERSION}.tar.xz /tmp
# RUN tar -C / -Jxpf /tmp/s6-overlay-x86_64-${S6_OVERLAY_VERSION}.tar.xz

RUN apk add --no-cache syncthing
RUN apk add --no-cache tini

RUN adduser --disabled-password syncthing_user

COPY docker_files/entrypoint.sh /usr/local/bin/entrypoint.sh
EXPOSE 8384/tcp
EXPOSE 22000/tcp

EXPOSE 8384/udp
EXPOSE 22000/udp

ENTRYPOINT ["tini"]

CMD ["entrypoint.sh"]