#!/usr/bin/env bash

cd "$(dirname "$0")/.."

docker build --pull -t devblog-next-build:latest -f docker/Dockerfile_build .

function docker_run() {
    docker run -v "$PWD":/usr/src/app -w /usr/src/app devblog-next-build:latest "$@"
}

docker_run npm ci || exit 1
docker_run npm  run build || exit 1
docker_run npm run export || exit 1

docker build --pull -t devblog-next:latest -f docker/Dockerfile_nginx . || exit 1
