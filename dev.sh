#!/bin/bash
mkdir -p tmp
CompileDaemon \
  --build="go build -o ./tmp/main main.go" \
  --command="./tmp/main" \
  --directory="." \
  --pattern="\.go$" \
  --exclude-dir="fe" \
  --exclude-dir="tmp" \
  --color \
  --graceful-kill \
  --polling \
  --polling-interval=100