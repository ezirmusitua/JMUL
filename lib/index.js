// ==UserScript==
// @name         JMUL
// @name:zh-CN   自用脚本工具库
// @namespace    https://greasyfork.org/users/34556
// @version      0.1.0
// @description  utilities for monkey scripts
// @author       jferroal
// @grant        GM_xmlhttpRequest
// ==/UserScript==

module.exports = {
    Element: require('./element'),
    Decorator: require('./decorator'),
    Request: require('./request'),
    Parser: require('./parser')
};