#!/bin/bash

pushd /home/www/hop

if [[ $1 && $1 == "--skip-build" ]]; then
    echo "Skipping build..."
else
    NODE_ENV=development yarn

    source .env
    yarn build

    if [[ $1 && $1 == "--skip-seed" ]]; then
        echo "Skipping db:seed!"
        exit 1
    fi
fi

yarn db:seed
