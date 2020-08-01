#!/usr/bin/env bash
set -ex
cd "$(dirname -- "${BASH_SOURCE[0]}")"

export DEBIAN_FRONTEND=noninteractive
apt-get -y update > /dev/null
apt-get -y install git jq zip > /dev/null

./build.sh "$@"
