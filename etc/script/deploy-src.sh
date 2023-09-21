#!/usr/bin/env bash

set -e

rsync -avzrhcP \
  -e 'ssh -i ~/.ssh/id_rsa' \
  --exclude=".git" --exclude=".next" \
  --exclude=".env" \
  --exclude="*.csv" \
  --exclude="data/" \
  --exclude="out/" \
  --exclude="etc/" \
  --exclude="public/image" \
  --exclude="node_modules" \
  --exclude="server/" \
  --exclude=".env.local" \
  ./ ubuntu@$DEPLOY_SERVER:/home/www/hop



