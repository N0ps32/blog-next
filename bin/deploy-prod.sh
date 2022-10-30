#!/usr/bin/env bash

cd "$(dirname "$0")/.."

docker compose -f docker/docker-compose.yaml up -d
