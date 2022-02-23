VERSION_TAG := $(shell git describe --abbrev=0 --tags)
VERSION := $(VERSION_TAG:v%=%)
EMVER := $(shell yq e ".version" manifest.yaml)

SYNCTHING_VERSION := "v1.18.4"

.DELETE_ON_ERROR:

all: verify

install: syncthing.s9pk
	embassy-cli package install syncthing.s9pk

syncthing.s9pk: manifest.yaml image.tar INSTRUCTIONS.md LICENSE $(ASSET_PATHS)
	embassy-sdk pack
	
verify: syncthing.s9pk
	embassy-sdk verify s9pk syncthing.s9pk

image.tar: Dockerfile templates makeStats
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/syncthing/main:${EMVER} --platform=linux/arm64/v8 -o type=docker,dest=image.tar .

makeStats: stats
	docker run --rm -it -v ~/.cargo/registry:/root/.cargo/registry -v "$(shell pwd)"/stats:/home/rust/src start9/rust-musl-cross:aarch64-musl cargo build --release

templates: 

manifest.yaml:
	yq eval -i ".version = \"$(VERSION)\"" manifest.yaml
	yq eval -i ".release-notes = \"https://github.com/syncthing/syncthing/releases/$(SYNCTHING_VERSION)\"" manifest.yaml
