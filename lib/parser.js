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

class JMParser {
    constructor() {
        this.rules = {};
        this.filters = {};
    }

    addRule(key, pattern) {
        const tmp = {
            tagName: '',
            attrName: '',
            attrValue: '',
            prevCh: '',
            filterName: '',
            filterParams: [],
            currentFilterParams: ''
        };
        this.rules[key] = helper.toArray(pattern).reduce((res, ch, idx) => {
            switch (ch) {
                case ' ':
                    break;
                case '(':
                    tmp.prevCh = ch;
                    break;
                case '@':
                    if (!tmp.tagName) throw new Error('No tagName. ');
                    tmp.prevCh = ch;
                    break;
                case ')':
                    res = JMParser.generate(tmp.tagName, JMParser.attr(tmp.attrName, tmp.attrValue));
                    tmp.prevCh = tmp.tagName = tmp.attrName = tmp.attrValue = '';
                    break;
                case '|':
                    tmp.prevCh = '|';
                    const filter = this.filters[tmp.filterName];
                    if (filter) {
                        res = filter(res, ...tmp.filterParams);
                    }
                    tmp.filterName = tmp.currentFilterParams = '';
                    tmp.filterParams = [];
                    break;
                case ',':
                    tmp.prevCh = ',';
                    if (tmp.currentFilterParams) {
                        tmp.filterParams.push(tmp.currentFilterParams);
                    }
                    tmp.currentFilterParams = '';
                    break;
                default:
                    if (tmp.prevCh === '@') {
                        tmp.attrName += ch;
                    } else if (tmp.prevCh === '(') {
                        tmp.attrValue += ch;
                    } else if(tmp.prevCh === '|') {
                        tmp.filterName += ch;
                    } else if (tmp.prevCh === ',') {
                        tmp.currentFilterParams += ch;
                    } else {
                        tmp.tagName += ch;
                    }
                    break;
            }
            return res;
        }, undefined);
    }

    addFilter(name, fn) {
        this.filters[name] = (prevFn, ...params) => {
            return (responseText) => {
                const parseRes = prevFn(responseText);
                return fn(parseRes, ...params);
            }
        }
    }

    static generate(tagName, attr) {
        const pattern = JMParser.tag(tagName, attr);
        console.log(pattern);
        return (responseText) => {
            console.log(responseText);
            const allMatch = responseText.match(pattern);
            if (helper.isEmpty(allMatch)) return {found: false};
            return allMatch.reduce((res, matchItem) => {
                const execRes = pattern.exec(matchItem);
                pattern.lastIndex = 0;
                const matchRes = execRes && execRes.slice(1) || [];
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

JMParser
    .operationMap = {
    '.': 'class',
    '#': 'id'
}

function

addParseRule(searchInstance, parseRule) {
}