# Wrapper for Syncthing

This is a EmbassyOS wrapper for [Syncthing](https://github.com/syncthing/syncthing).

## Dependencies

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [embassy-sdk](https://github.com/Start9Labs/embassy-os/tree/master/backend)
- [deno](https://deno.land/#installation)

## Cloning

```
git clone git@github.com:Start9Labs/syncthing-wrapper.git
cd syncthing-wrapper
```

## Building

```sh
make
# If we just want to build old
make ARCH=aarch64
```

## Side Loading on Embassy

```sh
scp syncthing.s9pk root@embassy-<id>.local:/tmp # Copying our file across
ssh root@embassy-<id>.local
embassy-cli auth login
embassy-cli package install syncthing.s9pk # Install the sideloaded package
```
