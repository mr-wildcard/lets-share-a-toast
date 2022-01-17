source .env

docker run --rm -it -v `pwd`:/code -w /code "$DOCKER_IMAGE" yarn
