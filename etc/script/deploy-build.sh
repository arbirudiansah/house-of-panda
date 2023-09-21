#!/usr/bin/env bash

set -e
source $(pwd)/.env.production
echo Building...

yarn build

rsync -avzrhcP \
    -e 'ssh -i ~/.ssh/id_rsa' \
    --exclude=".git" --exclude=".next" \
    --exclude=".env*" \
    --exclude="*.csv" \
    --exclude="data/" \
    --exclude="out/" \
    --exclude="etc/" \
    --exclude="public/image" \
    --exclude="node_modules" \
    --exclude="server/" \
    ./ ubuntu@$DEPLOY_SERVER:/home/www/hop

ssh -i ~/.ssh/id_rsa ubuntu@$DEPLOY_SERVER sudo rm -rf /home/www/hop/.next
ssh -i ~/.ssh/id_rsa ubuntu@$DEPLOY_SERVER sudo chown -R ubuntu:ubuntu /home/www/hop
ssh -i ~/.ssh/id_rsa ubuntu@$DEPLOY_SERVER "/home/www/hop/build.sh --skip-build"
ssh -i ~/.ssh/id_rsa ubuntu@$DEPLOY_SERVER pm2 start "/home/www/hop/ecosystem.config.js" --fresh
echo Done.
