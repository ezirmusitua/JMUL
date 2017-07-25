


let ButtonFactory = null;
class IconButton extends JMElement {
    constructor(icon, size, clickFn) {
        super('button');
        this.button = new JMElement('button');
        IconButton.initBtnStyle(this.button, typeof size === 'string' ? '128px' : size + 'px');
        this.image = new JMElement('img');
        this.image.setAttribute('src', icon);
        IconButton.initImageStyle(this.image);
        this.button.appendChild(this.image);
        this.element = this.button;
        this.btnClickedStyleChangeTimeout = null;
        IconButton.listenClick(this, clickFn)
    }

    static initBtnStyle(button, size) {
        button.setCss({
            position: 'relative',
            height: size,
            width: size,
            padding: '0',
            borderRadius: '50%',
            border: 'none',
            outline: 'none'
        });
    }

    static setNormalBtnBox(button) {
        button.setStyle('boxShadow', '0 0 2px 2px rgba(0, 0, 0, 0.08)');
    }

    static setClickedBtnBox(button) {
        button.setStyle('boxShadow', 'none');
    }

    static initImageStyle(image) {
        image.setCss({
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            cursor: 'pointer'
        })
    }

    static listenClick(iconBtn, fn) {
        iconBtn.button.listen('click', (e) => {
            IconButton.setClickedBtnBox(iconBtn.button);
            if (iconBtn.button.btnClickedStyleChangeTimeout) {
                clearTimeout(button.btnClickedStyleChangeTimeout);
                iconBtn.button.btnClickedStyleChangeTimeout = null;
            }
            iconBtn.button.btnClickedStyleChangeTimeout = setTimeout(() => {
                IconButton.setNormalBtnBox(iconBtn.button);
            }, 100);
            fn(e, iconBtn);
        })
    }
}

class NormalButton {
    constructor(label, clickFn) {
    }
}

class JMButtonFactory {
    constructor() {
        if (!ButtonFactory) {
            ButtonFactory = this;
        }
        return ButtonFactory;
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