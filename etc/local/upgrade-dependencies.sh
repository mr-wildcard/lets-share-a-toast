#!/usr/bin/env bash

source .env

docker run --rm -it -v "$(PWD)":/code -w /code "$DOCKER_IMAGE" pnpm up -r -i --latest
