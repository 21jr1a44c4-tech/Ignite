#!/bin/sh
cd /home/site/wwwroot
export NODE_PATH=/usr/local/lib/node_modules:$NODE_PATH
export PORT=8080
npm install
npm start
