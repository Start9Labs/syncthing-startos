```sh

docker build -t sync . --load # Build a sync image
docker run -it -p 8385:8384  --rm --name sync sync # Run container and call it sync with ports 80 and 3001 opened
docker exec -it sync /bin/sh # Go into test

docker build -t sync . --load && docker run -it -p 8385:8384  --rm --name sync  sync

scp -o ProxyJump=ThinClient syncthing.s9pk BluePi:/tmp # Proxy search
ssh -J ThinClient BluePi # Proxy through thin to blupi
ssh -J ThinClient BluePi -c "docker exec -it syncthing.embassy /bin/sh" # Proxy through thin to blupi Syncthing

make; scp syncthing.s9pk BluePi:/tmp # Proxy search

scp syncthing.s9pk BluePi:/tmp # Proxy search
ssh BluePi # Proxy through thin to blupi

embassy-cli auth login
embassy-cli package uninstall syncthing; embassy-cli package install syncthing.s9pk

```
