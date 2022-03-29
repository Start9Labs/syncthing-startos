VERSION_TAG := $(shell git describe --abbrev=0 --tags)
VERSION := $(VERSION_TAG:v%=%)
EMVER := $(shell dasel -f manifest.yaml ".version")

SYNCTHING_VERSION := "v1.19.1"

.DELETE_ON_ERROR:

all: verify

install: syncthing.s9pk
	embassy-cli package install syncthing.s9pk

syncthing.s9pk: manifest.yaml image.tar INSTRUCTIONS.md LICENSE $(ASSET_PATHS)
	embassy-sdk pack
	
verify: syncthing.s9pk
	embassy-sdk verify s9pk syncthing.s9pk

image.tar: Dockerfile templates make_controller
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/syncthing/main:${EMVER} --platform=linux/arm64/v8 -o type=docker,dest=image.tar .

make_controller: controller
	docker run --rm -it -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/controller:/home/rust/src start9/rust-musl-cross:aarch64-musl cargo build --release

templates: 

check_manifest: manifest.yaml Makefile
	test $(shell dasel -f manifest.yaml ".version") == "$(VERSION)" || { echo "failure!"; exit 1; }
	test $(shell dasel -f manifest.yaml ".release-notes") == "https://github.com/syncthing/syncthing/releases/$(SYNCTHING_VERSION)"  || { echo "failure!"; exit 1; }
	echo "Manifest is good"
