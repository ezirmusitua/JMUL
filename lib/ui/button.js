class BaseButton extends JMElement {
    constructor() {
        super('button');
        this.btnClickedStyleChangeTimeout = undefined;
    }

    setNormalBtnBoxShadow() {
        this.setStyle('boxShadow', '0 0 2px 2px rgba(0, 0, 0, 0.08)');
    }

    setClickedBtnBoxShadow() {
        this.setStyle('boxShadow', 'none');
    }

    listenClick(fn) {
        this.listen('click', (e) => {
            this.setClickedBtnBoxShadow();
            if (this.btnClickedStyleChangeTimeout) {
                clearTimeout(this.btnClickedStyleChangeTimeout);
                this.btnClickedStyleChangeTimeout = null;
            }
            this.btnClickedStyleChangeTimeout = setTimeout(() => {
                this.setNormalBtnBoxShadow();
            }, 100);
            fn(e, this);
        })
    }
}
class IconButton {
    constructor(icon, size, clickFn) {
        this.button = new BaseButton();
        IconButton.initBtnStyle(this.button, typeof size === 'string' ? '128px' : size + 'px');
        this.image = new JMElement('img');
        this.image.setAttribute('src', icon);
        IconButton.initImageStyle(this.image);
        this.button.appendChild(this.image);
        this.button.listenClick(clickFn)
    }

    appendTo(parent) {
        this.button.appendTo(parent);
    }

    get element() {
        return this.button;
    }

    static initBtnStyle(button, size) {
        button.setCss({
            position: 'relative',
            height: size,
            width: size,
            padding: '0',
            borderRadius: '50%',
            border: 'none',
            outline: 'none',
        });
    }

    static initImageStyle(image) {
        image.setCss({
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            cursor: 'pointer'
        })
    }
}

class NormalButton {
    constructor(label, size, clickFn) {
        this.button = new BaseButton();
        NormalButton.initBtnStyle(this.button, NormalButton._handleSizeParam(size));
        this.label = new JMElement('p');
        NormalButton.initLabelStyle(this.label);
        this.label.innerText(label);
        this.button.appendChild(this.label);
        this.button.listenClick(clickFn)
    }

    appendTo(parent) {
        this.button.appendTo(parent);
    }

    get element() {
        return this.button;
    }

    static initBtnStyle(button, size) {
        button.setCss({
            height: size.height || '24px',
            width: '64px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'skyblue',
            cursor: 'pointer',
            outline: 'none',
        });
    }

    static initLabelStyle(label) {
        label.setCss({
            fontSize: '12px',
            color: 'rgba(255, 255,255, 0.87)',
            lineHeight: '100%',
            margin: '0',
        });
    }

    static _handleSizeParam(size) {
        switch (typeof size) {
            case 'object':
                return {
                    height: typeof size.height === 'string' ? size.height : size.height + 'px',
                    width: typeof size.width === 'string' ? size.width : size.width + 'px',
                };
            case 'string':
                return {height: size, width: size};
            case 'number':
                return {height: size + 'px', width: size + 'px'};
        }
    }
}

class JMButtonFactory {
    constructor() {
        if (!JMButtonFactory.ButtonFactory) {
            JMButtonFactory.ButtonFactory = this;
        }
        return JMButtonFactory.ButtonFactory;
    }

    create(type, iconOrLabel, size, clickFn) {
        switch (type) {
            case 'icon':
                return new IconButton(iconOrLabel, size, clickFn);
            case 'normal':
            default:
                return new NormalButton(iconOrLabel, size, clickFn);
        }
    }
}
JMButtonFactory.ButtonFactory = null;