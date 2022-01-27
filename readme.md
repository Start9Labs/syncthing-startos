```sh

docker build -t sync . --load # Build a sync image
docker run -it -p 8385:8384  --rm --name sync sync # Run container and call it sync with ports 80 and 3001 opened
docker exec -it sync /bin/sh # Go into test

```
