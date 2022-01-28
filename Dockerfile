FROM alpine:3.15

ARG S6_OVERLAY_VERSION=3.0.0.0-1
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-noarch-${S6_OVERLAY_VERSION}.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-noarch-${S6_OVERLAY_VERSION}.tar.xz
ADD https://github.com/just-containers/s6-overlay/releases/download/v${S6_OVERLAY_VERSION}/s6-overlay-x86_64-${S6_OVERLAY_VERSION}.tar.xz /tmp
RUN tar -C / -Jxpf /tmp/s6-overlay-x86_64-${S6_OVERLAY_VERSION}.tar.xz

RUN apk add --no-cache syncthing

RUN adduser -S --disabled-password --home root syncthing_user

COPY docker_files/config.xml ~/.config/syncthing/config.xml

COPY docker_files/s6-rc.d /etc/s6-overlay/s6-rc.d


ENTRYPOINT ["/init"]