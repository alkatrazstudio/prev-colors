#!/usr/bin/env bash
set -e
cd "$(dirname -- "${BASH_SOURCE[0]}")"

VER="$1"
if [[ -z $VER ]]
then
    VER="$(./get-next-version.sh)"
fi

cd ..
rm -rf build
cp -a src build
cd build

NEW_MANIFEST="$(jq --arg VER "$VER" '.version = $VER' manifest.json)"
echo "$NEW_MANIFEST" > manifest.json
zip -r9 - . > ../prev-colors.xpi

cd ../
echo "Add-on file: $(pwd)/prev-colors.xpi"
