FROM alpine:3.15

RUN apk add --no-cache syncthing
RUN apk add --no-cache tini

RUN apk add --no-cache jq python3 py3-pip
RUN pip3 install yq

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
ENV STGUIADDRESS=0.0.0.0:8384


ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]