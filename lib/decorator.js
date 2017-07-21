function selectable(je) {
    je.select = select;
    je.getSelection = getSelection;
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
        start = !!start ? start : 0;
        // default will get the selected text
        let result = String.prototype.slice.apply(document.getSelection(), [start, end]);
        // if not selected, get current element's text
        if (!result) {
            this.select();
            result = String.prototype.slice.apply(document.getSelection(), [start, end]);
        }
        return result;
    }
}