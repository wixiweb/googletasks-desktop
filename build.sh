#!/usr/bin/env bash
./node_modules/.bin/electron-packager . "GoogleTasksDesktop" --platform=darwin --arch=x64 --electron-version=1.4.6 --out=./build --overwrite --icon=./src/images/shortcut.icns --app-copyright="Wixiweb" --asar
