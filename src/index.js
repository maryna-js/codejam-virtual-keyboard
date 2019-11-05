const keyCodeLayout = [
    "Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace",
    "Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash",
    "CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter",
    "ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ArrowUp", "ShiftRight",
    "ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "ArrowLeft", "ArrowDown", "ArrowRight", "ControlRight"
   
];
const russian = [
    "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
    "tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "\u002F",
    "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
    "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "▲", "shift",
    "ctrl", "win", "alt", "space", "alt", "◀", "▼", "▶", "ctrl"
];

const keyLayoutSh = [
    "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "backspace",
    "tab", "Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ", "\u002F",
    "caps", "Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э", "enter",
    "shift", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "/", "▲", "shift",
    "ctrl", "win", "alt", "space", "alt", "◀", "▼", "▶", "ctrl"
];

const english = [
    "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace",
    "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\u002F",
    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
    "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "▲", "shift",
    "ctrl", "win", "alt", "space", "alt", "◀", "▼", "▶", "ctrl"
];

const Keyboard = {
    elements: {
        inp: null,
        main: null,
        keysContainer: null,
        keys: [],
        flag: false,
    },

    eventHandlers: {
        oninput: null,
        onclose: null,
    },

    properties: {
        value: '',
        capsLock: false,
        lang: false,
    },
    
    events: {
        availableLanguages: [russian, english],
        languageNow: russian,
    },

    init() {
         
        this.elements.inp = document.createElement('textarea');
        //Create keyboard div
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");
        //Add styles to divs
        this.elements.inp.classList.add("result");
        this.elements.main.classList.add("keyboard");
        this.elements.keysContainer.classList.add("keyboard--keys");
        let now = localStorage.getItem('language_Now') || 0; 
        this.elements.keysContainer.appendChild(this._createKeys(this.events.availableLanguages[now]));
        
        this.elements.flag = false;
        document.addEventListener('keyup', e => {
            if (e.code == "ControlLeft") this.elements.flag = true;
            if (e.code == "AltLeft" && this.elements.flag) {
                this.elements.flag = false;
                this._changeLang();
                this.elements.keysContainer.appendChild(this._createKeys(this.events.languageNow));
                location.reload();
            }
         });

        //array of keys
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard--key");
        //Add to Dom
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.inp);
        document.body.appendChild(this.elements.main);

        document.addEventListener('keydown', e => {
            document.querySelector('.keyboard--key[data="'+e.code || e.which || +'"]').classList.add('active');
        });

        document.addEventListener('keyup', e => {
            document.querySelectorAll('.keyboard--key').forEach(function(element) {
                element.classList.remove('active');
            });
            e.preventDefault();
            this.elements.inp.focus();
            document.querySelector('.keyboard--key[data="'+e.code || e.which || +'"]').classList.remove('active');
        });

        document.addEventListener('mousedown', e => {
            e.preventDefault();
            this.elements.inp.focus();
        });

        document.querySelectorAll(".result").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });

    },

    _createKeys(language) {
        const fragment = document.createDocumentFragment();
        

        //creates html for icons
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };
        
        language.forEach((key, i) => {
            const keyElement = document.createElement("button");
            
            const insertLineBreak = ["backspace", "\u002F", "enter"].indexOf(key) !== -1;

            //add attributes and classes to buttons
            keyElement.setAttribute("type", "button");
            
            keyElement.classList.add("keyboard--key");

            keyElement.setAttribute("data", keyCodeLayout[i]);
 
            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard--key_wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

                case "tab":
                    keyElement.classList.add("keyboard--key_wide");
                    keyElement.innerHTML = createIconHTML("keyboard_tab");
    
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "    ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard--key_wide");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");
                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle(this.properties.capsLock);
                        this._triggerEvent("oninput");
                    });

                    document.addEventListener('keyup', e => {
                        if (e.code == "CapsLock") {
                            this._toggleCapsLock();
                        }
                    });

                    break;

                case "enter":
                    keyElement.classList.add("keyboard--key_wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;
                
                //доделать нажата шифт чтобы значение заносилось в textarea
                case "shift":
                    keyElement.classList.add("keyboard--key_wide");
                    keyElement.innerHTML = createIconHTML("arrow_upward");
                    
    
                    keyElement.addEventListener("mousedown", () => {
                        
                        this.elements.keys.forEach((key, i) => {
                            key.textContent = keyLayoutSh[i];
                            
                        });
                    });

                    keyElement.addEventListener("mouseup", () => {
                        this.elements.keys.forEach((key, i) => {
                            key.textContent = russian[i];
                        });
                    });

                    document.addEventListener('keydown', e => {
                        if (e.code == "ShiftLeft" || e.code == "ShiftRight") {
                            //console.log('shift left')
                            this._toggleCapsLock();
                            this.elements.keys.forEach((key, i) => {
                                key.textContent = keyLayoutSh[i];
                                this.properties.value = key.textContent;
                                
                                //this.properties.value.toUpperCase();
                                // document.querySelectorAll(".result").forEach(element => {
                                //     element.addEventListener("focus", () => {
                                //         element.value.toUpperCase();
                                //         //console.log(key);
                                //         // this.open(element.value, currentValue => {
                                //         //     element.value = currentValue;
                                //         //});
                                //     });
                                // });
                            });
                            
                    }});

                    document.addEventListener('keyup', e => {
                        if (e.code == "ShiftLeft" || e.code == "ShiftRight") {
                            //console.log('shift left')
                            this._toggleCapsLock();
                            this.elements.keys.forEach((key, i) => {
                                key.textContent = russian[i];
                                key.textContent.toUpperCase();
                            });
                    }});                  

                    break;

                case "space":
                    keyElement.classList.add("keyboard--key_extra_wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "ctrl":
                    keyElement.classList.add("keyboard--key");
                    keyElement.innerHTML = 'ctrl';
                    keyElement.addEventListener("click", () => {
                       this._changeLang();
                        //this._triggerEvent("oninput");
                    });
                    break;

                case "alt":
                    keyElement.classList.add("keyboard--key");
                    keyElement.innerHTML = 'alt';
                    break;
            
                case "win":
                    keyElement.classList.add("keyboard--key");
                    keyElement.innerHTML = 'win';
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                    });

                    break;
            }


            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });
        

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;
        for (const key of this.elements.keys) {
            if (key.childElementCount === 0 && key.textContent.length < 2) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    _changeLang() {
        let now = localStorage.getItem('language_Now') || -1;
        console.log(now);
        let next = +now + 1;
        console.log(next);
        if (next == this.events.availableLanguages.length) next = 0;
        this.events.languageNow = this.events.availableLanguages[next];
        localStorage.setItem('language_Now', next);
    },

    _toLangEn() {
        Array.prototype.splice.apply(keyLayout, [0, keyLayoutEn.length].concat(keyLayoutEn));
        console.log(keyLayout);
        return keyLayout;
    },


    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
    }

};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});
