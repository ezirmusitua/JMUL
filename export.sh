#!/bin/bash
npm install
echo " = = = = = Browserify Install = = = = = "
echo "./node_modules/.bin/browserify -r ./lib/index.js:JMUL -o dist/bundle.js"
./node_modules/.bin/browserify ./lib/index.js -o dist/bundle.js
echo " = = = = = Browserify done = = = = = = "
echo "prepend greasyfork head "
sed -i.old '1s;^;\// ==UserScript==\
// @name              JMUL\
// @name:zh-CN        自用脚本工具库\
// @namespace         https://greasyfork.org/users/34556\
// @version           0.1.2\
// @description       utilities for monkey scripts\
// @description:zh-CN 工具库\
// @author            jferroal\
// @grant             GM_xmlhttpRequest\
// ==/UserScript==\n\n;' ./dist/bundle.js
echo " = = = = = prepend bundle with greasyfork head done = = = = = "
rm ./dist/bundle.js.old
cp ./dist/bundle.js ./export/jmul.user.js

