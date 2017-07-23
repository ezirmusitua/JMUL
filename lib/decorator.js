function selectable(je) {
    je.select = select;
    je.getSelection = getSelection;
    je.copyToClipboard = copyToClipboard;
    console.log(je);
    return je;
    function select(start, end) {
        if (!je.element.focus) {
            console.error('this element can not be selected.');
        }
        je.element.focus();
        start = !!start ? start : 0;
        end = !!end ? end : -1;
        je.element.setSelectionRange(start, end);
    }

    function getSelection(start, end) {
        start = !start ? 0 : start;
        // default will get the selected text
        let result = String.prototype.slice.apply(document.getSelection(), [start, end]);
        // if not selected, get current element's text
        if (!result) {
            this.select(start, end);
            result = String.prototype.slice.apply(document.getSelection(), [start, end === -1 ? end += 1 : end]);
        }
        return result;
    }

    function copyToClipboard(start, end) {
        start = !start ? 0 : start;
        document.getSelection().removeAllRanges();
        const range = document.createRange();
        range.setStart(je.element, start);
        range.setEnd(je.element, end);
        range.selectNode(je.element);
        document.getSelection().addRange(range);
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Oops, unable to copy');
        }
        document.getSelection().removeAllRanges();
    }
}

function addParser(request, parser) {
    request.sendAndParse = function () {
        return new Promise(resolve => request.send().then((res) => {
            const result = {};
            for (const key of Object.keys(parser.rules)) {
                result[key] = parser.rules[key](res);
            }
            resolve(result);
        }));
    };
    return request;
}