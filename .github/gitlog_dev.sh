#!/usr/bin/env bash

echo -n '{"content":"Dev Web updated [https://dev.houseofpanda.co](https://dev.houseofpanda.co)\nCommit: ' > /tmp/twist_data.json
git log --pretty=format:"[%h](https://github.com/fatkhur1960/house-of-panda/commit/%h) - %s" -1 >> /tmp/twist_data.json
echo '"}' >> /tmp/twist_data.json