let ButtonFactory = null;
class IconButton {
    constructor(icon, clickFn) {
        this.image = document.createElement('img');
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

    create(type) {

    }

}