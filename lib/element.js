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

    setId(id) {
        this.setAttribute('id', id);
    }

    setClass(_class) {
        this.setAttribute('class', _class);
    }

    innerHTML(value) {
        this.element.innerHTML = value;
    }

    innerText(value) {
        this.element.innerText = value;
    }

    position(type) {
        const rect = this.element.getBoundingClientRect()
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
        console.log(child);
        this.element.appendChild(child.element || child);
    }

    listen(eventName, doAction) {
        JMElement.addEvent(this.element, eventName, (e) => doAction(elem, e));
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

    toString() {
        return this.element.toString();
    }

    valueOf() {
        return this.element;
    }
}

