#!/bin/bash

set -e
source `pwd`/.env
rsync -avzrhcP \
  -e 'ssh -i ~/.ssh/id_rsa' \
  --exclude=".git" --exclude=".next" \
  --exclude=".env" --exclude=".env.local" \
  --exclude="*.csv" \
  --exclude="out/" \
  --exclude="etc/" \
  --exclude="public/image" \
  --exclude="node_modules" \
  --exclude="server/" \
  ./ rifqi@$DEPLOY_SERVER:/home/www/hop

echo Building...
ssh -i ~/.ssh/id_rsa rifqi@$DEPLOY_SERVER 'PATH="$PATH:$HOME/.nvm/versions/node/v16.13.0/bin"' "/home/www/hop/build.sh {$*}"
ssh -i ~/.ssh/id_rsa rifqi@$DEPLOY_SERVER 'PATH="$PATH:$HOME/.config/yarn/global/node_modules/pm2/bin:$HOME/.nvm/versions/node/v16.13.0/bin"' pm2 start "/home/www/hop/ecosystem.config.js" --fresh

echo "Web deployed!".


