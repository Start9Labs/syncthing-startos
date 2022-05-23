VERSION_TAG := $(shell git describe --abbrev=0 --tags)
VERSION := $(VERSION_TAG:v%=%)
EMVER := $(shell dasel -f manifest.yaml ".version")

SYNCTHING_VERSION := "v1.19.1"

.DELETE_ON_ERROR:

all: verify

install: syncthing.s9pk
	embassy-cli package install syncthing.s9pk

syncthing.s9pk: manifest.yaml image.tar INSTRUCTIONS.md LICENSE $(ASSET_PATHS) scripts/embassy.js
	embassy-sdk pack
	
verify: syncthing.s9pk
	embassy-sdk verify s9pk syncthing.s9pk

image.tar: Dockerfile templates
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/syncthing/main:${EMVER} --platform=linux/arm64/v8 -o type=docker,dest=image.tar .

scripts/embassy.js: scripts/embassy-pre.js
	deno bundle scripts/embassy-pre.js scripts/embassy.js

scripts/embassy-pre.js: .

templates: 

check_manifest: manifest.yaml Makefile
	test $(shell dasel -f manifest.yaml ".version") == "$(VERSION)" || { echo "failure!"; exit 1; }
	test $(shell dasel -f manifest.yaml ".release-notes") == "https://github.com/syncthing/syncthing/releases/$(SYNCTHING_VERSION)"  || { echo "failure!"; exit 1; }
	echo "Manifest is good"
