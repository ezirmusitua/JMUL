#!/bin/bash
npm install -g browserify
echo " = = = = = Browserify Install = = = = = "
browserify -r ./lib/index.js:JMUL -o dist/bundle.js
echo " = = = = = Browserify done = = = = = = "
sed -i.old '1s;^;// ==UserScript==\n// @name JMUL\n// @name:zh-CN 自用脚本工具库\n// @namespace https://greasyfork.org/users/34556\n// @version 0.1.0\n// @description  utilities for monkey scripts\n// @author jferroal\n// @grant GM_xmlhttpRequest\n// ==/UserScript==\n\n;' ./dist/bundle.js
echo " = = = = = Replace bundle with greasyfork head done = = = = = "
rm ./dist/bundle.js.old