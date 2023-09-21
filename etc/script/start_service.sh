#!/bin/bash
set -e
source .env

get_password() {
    prompt="Enter password: "
    local password=""
    while IFS= read -p "$prompt" -r -s -n 1 char
    do
        if [[ $char == $'\0' ]]; then
            break
        fi
        prompt='*'
        password+="$char"
    done

    yarn -s cryptutil:validate --input="$ADMIN_KEY" --password="$password" > /dev/null

    if [[ $? -eq 1 ]]; then
        password=""
        get_password
    fi

    echo "$password"
}

PASSWORD=$(get_password)

echo ""

if [[ $1 == "staging" ]]; then
  eval "PASSWORD=$PASSWORD pm2 start dev-ecosystem.config.js --fresh --env staging"
else
  eval "PASSWORD=$PASSWORD pm2 start ecosystem.config.js --fresh"
fi