#!/usr/bin/env bash
set -e
cd "$(dirname -- "${BASH_SOURCE[0]}")"

CUR_VER="$(git tag | sort -Vr | grep -Po '^v\K\d+\.\d+$' | head -1)"
MAJ_VER="${CUR_VER%.*}"
MIN_VER="${CUR_VER#*.}"

NEXT_MIN_VER=$(( MIN_VER + 1 ))

echo "$MAJ_VER.$NEXT_MIN_VER"
