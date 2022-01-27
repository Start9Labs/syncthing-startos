VERSION_TAG := $(shell git describe --abbrev=0)
VERSION := $(VERSION_TAG:v%=%)
EMVER := $(shell yq e ".version" manifest.yaml)

.DELETE_ON_ERROR:

all: verify

install: filebrowser.s9pk
	embassy-cli package install filebrowser.s9pk

filebrowser.s9pk: manifest.yaml image.tar instructions.md LICENSE icon.png $(ASSET_PATHS)
	embassy-sdk pack
	
verify: filebrowser.s9pk
	embassy-sdk verify filebrowser.s9pk

image.tar: Dockerfile docker_entrypoint.sh templates
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/filebrowser/main:${EMVER} --platform=linux/arm64/v8 -o type=docker,dest=image.tar .

nginx.conf: manifest.yaml nginx.conf.template 
	tiny-tmpl manifest.yaml < nginx.conf.template > nginx.conf

nginxDav.conf: manifest.yaml nginxDav.conf.template
	tiny-tmpl manifest.yaml < nginxDav.conf.template > nginxDav.conf

templates: nginx.conf nginxDav.conf

manifest.yaml
	yq eval -i ".version = \"$(VERSION)\"" manifest.yaml
	yq eval -i ".release-notes = \"https://github.com/filebrowser/filebrowser/releases/tag/$(VERSION_TAG)\"" manifest.yaml
