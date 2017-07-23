const helper = {
    isAlpha: c => ((c >= 'a') && (c <= 'z')) || ((c >= 'A') && (c <= 'Z')),
    isDigit: c => (c >= '0') && (c <= '9'),
    isAlnum: c => helper.isAlpha(c) || helper.isDigit(c),
    isEmpty: a => !a || !a.length,
    toArray: s => Array.from(s, (v) => v),
    reAll: rs => rs

};

class JMXMLResult {
    constructor(tagName, innerText, matches) {
        this.tagName = tagName;
        this.innerText = innerText;
        this.matches = matches;
    }
}

class JMXMLSelector {
    constructor() {
        this.resultAction = {};
    }

    addRule(key, pattern) {
        const tmp = {tagName: '', attrName: '', attrValue: '', prevCh: '', filters: []};
        this.resultAction[key] = helper.toArray(pattern).reduce((res, ch, idx) => {
            console.log(ch, idx);
            switch (ch) {
                case '(':
                    tmp.prevCh = ch;
                    break;
                case '@':
                    if (!tmp.tagName) throw new Error('No tagName. ');
                    tmp.prevCh = ch;
                    break;
                case ')':
                    res = JMXMLSelector.generate(tmp.tagName, JMXMLSelector.attr(tmp.attrName, tmp.attrValue));
                    tmp.prevCh = tmp.tagName = tmp.attrName = tmp.attrValue = '';
                    break;
                default:
                    if (tmp.prevCh === '@') {
                        tmp.attrName += ch;
                    } else if (tmp.prevCh === '(') {
                        tmp.attrValue += ch;
                    } else {
                        tmp.tagName += ch;
                    }
                    break;
            }
            return res;
        }, undefined)
    }

    static generate(tagName, attr) {
        const pattern = JMXMLSelector.tag(tagName, attr);
        return (responseText) => {
            const allMatch = responseText.match(pattern);
            if (helper.isEmpty(allMatch)) return {found: false};
            return allMatch.reduce((res, matchItem) => {
                const execRes = pattern.exec(matchItem);
                pattern.lastIndex = 0;
                const matchRes =  execRes && execRes.slice(1) || [];
                return res.concat([new JMXMLResult(tagName, matchRes[1], matchRes)]);
            }, []);
        }
    }

    static tag(name, attr) {
        return new RegExp(`<${name}.*?${attr}.*?>(.*)<\/${name}>`, 'gi');
    }

    static
    attr(name, value) {
        return `${name}="(${value})"`;
    }
}

JMXMLSelector
    .operationMap = {
    '.': 'class',
    '#': 'id'
}

function

addParseRule(searchInstance, parseRule) {
}