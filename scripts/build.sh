#!/usr/bin/env bash
set -e
cd "$(dirname -- "${BASH_SOURCE[0]}")"

cd ../src
rm -f ../prev-colors.xpi
zip -r9 ../prev-colors.xpi .

cd ../
echo "Add-on file: $(pwd)/prev-colors.xpi"
