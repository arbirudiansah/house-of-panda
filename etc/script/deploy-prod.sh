#!/bin/bash

set -e

rsync -avzrhcP --delete-after -e "ssh -p 22" \
    ./.next \
    ./dist \
    ./public \
    ./package.json \
    ./etc/script/ecosystem.config.js \
    ./next.config.js \
    hop@149.129.215.102:/home/www/hop