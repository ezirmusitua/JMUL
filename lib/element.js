function toArray(s) {
    return Array.from(s, (v) => v);
}

class JMElement {
    constructor(tagOrElement) {
        this.element = tagOrElement;
        if (typeof tagOrElement === 'string') {
            this.element = document.createElement(tagOrElement);
        }
    }

    setAttribute(attrName, value) {
        this.element.setAttribute(attrName, value);
    }

    getAttribute(attrName) {
        return this.element.getAttribute(attrName);
    }

    setStyle(styleName, value) {
        this.element.style[styleName] = value;
    }

    setCss(styles) {
        if (!styles) return;
        for (const styleName in styles) {
            if (!styles.hasOwnProperty(styleName)) return;
            this.setStyle(styleName, styles[styleName]);
        }
    }

    setInnerHTML(value) {
        this.element.innerHTML = value;
    }
    setInnerText(value) {
	this.element.innerText = value;
    }

    setId(id) {
        this.setAttribute('id', id);
    }

    _setClass(_class) {
        this.setAttribute('class', _class);
    }

    addClass(newClass) {
        const oldClassStr = this.getAttribute('class');
        if (oldClassStr.indexOf(newClass) < 0) {
            this._setClass(oldClassStr + ' ' + newClass);
        }
        return this;
    }

    removeClass(className) {
        const oldClassStr = this.getAttribute('class');
        const idx = oldClassStr.indexOf(className);
        if (idx > -1) {
            const tmp = toArray(oldClassStr);
            tmp.splice(idx, className.length);
            this._setClass(tmp.join(''));
        }
        return this;
    }

    innerHTML(value) {
        this.element.innerHTML = value;
    }

    innerText(value) {
        this.element.innerText = value;
    }

    setValue(value) {
        this.element.value = value;
    }

    position(type) {
        const rect = this.element.getBoundingClientRect();
        switch (type) {
            case 'left-top':
                return {x: rect.left, y: rect.top};
            case 'right-top':
                return {x: rect.right, y: rect.top};
            case 'left-bottom':
                return {x: rect.left, y: rect.bottom};
            case 'right-bottom':
                return {x: rect.right, y: rect.bottom};
            case 'center':
                return {x: rect.left + rect.height / 2, y: rect.top + rect.height / 2};
        }
    }

    appendTo(parent) {
        parent.appendChild(this.element);
    }

    appendChild(child) {
        this.element.appendChild(child.element || child);
    }

    listen(eventName, fn) {
        JMElement.addEvent(this.element, eventName, fn);
    }

    toString() {
        return this.element.toString();
    }

    valueOf() {
        return this.element;
    }

    value() {
        return this.element.value;
    }

    static query(selector, index) {
        const els = document.querySelectorAll(selector);
        if (!els) throw new Error('element not found. ');
        if (index === -1) return els.map((el) => new JMElement(el));
        if (index === undefined) return new JMElement(els[0]);
        if (els.length < index + 1) throw new Error('index element not found. ');
        return new JMElement(els[index]);
    }

    static addEvent(element, eventName, fn) {
        element.addEventListener(eventName, fn, false);
    }

    static getSelectedPosition(type = 'left-top') {
        const focusNode = document.getSelection().focusNode;
        if (!focusNode) throw new Error('no selection, should not create node');
        const focusParentElement = focusNode.parentElement;
        return (new JMElement(focusParentElement())).position(type);
    }
}

module.exports = JMElement;

