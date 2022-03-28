# Wrapper for Syncthing

## Dependencies

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [dasel](https://github.com/TomWright/dasel)
- [tiny-tmpl](https://github.com/Start9Labs/templating-engine-rs.git)
- [backend](https://github.com/Start9Labs/embassy-os/tree/master/backend)

## Cloning

```
git clone git@github.com:Start9Labs/syncthing-wrapper.git
cd syncthing-wrapper
```

## Building

```
make
```

## Installing (on Embassy)

After one has built the s9pk, copy this c9pk into the embassy for side loading, which we shall call Embassy.Could be Created in ~/.ssh/config.
Then on the device, we probably need to login, then followed by installing it.

```sh
scp syncthing.s9pk Embassy:/tmp # Copying our file across
ssh Embassy # Going into embassy
embassy-cli auth login # Login to the system
embassy-cli package install syncthing.s9pk # Install the sideloaded package
```
