import QRCode from './module/qrcode.js';
import Draw from './module/draw.js';
import styleSheet from './style/default.css' assert { type: 'css'};

class WidgetQRCode extends HTMLElement {
    constructor() {
        super();
    }
    static get observedAttributes(){
        return ['text','level','width','height'];
    }
    get text(){
        return this.getAttribute('text')||'https://passer-by.com/';
    }
    get level(){
        return +this.getAttribute('level')||'H';
    }
    get width(){
        return +this.getAttribute('width')||0;
    }
    get height(){
        return +this.getAttribute('height')||0;
    }
    attributeChangedCallback(name, oldValue, newValue){
        if(name=='text'&&oldValue!=newValue){
            this.context&&this.drawQRCode();
        }
    }
    connectedCallback () {
        let _ = this;
        // 模板
        _.attachShadow({mode:'open'});
        const defaultSheet = new CSSStyleSheet();
        defaultSheet.insertRule(`:host{
            width: ${this.width||300}px;
            height: ${this.height||300}px;
        }`);
        console.log('[test]',[defaultSheet,styleSheet]);
        if(_.shadowRoot.adoptedStyleSheets){
            _.shadowRoot.adoptedStyleSheets = [defaultSheet,styleSheet];
        }else{
            const $style = document.createElement('style');
            $style.rel = 'stylesheet';
            $style.textContent = [defaultSheet.cssRules,...styleSheet.cssRules].map(item=>item.cssText).join('');
            _.shadowRoot.appendChild($style);
        }

        // 节点
        _.render();
        _.drawQRCode();

        _.addEventListener('resize',function(){
            console.log('[resize!]');
            _.resize();
        },false);
    }
    render(parser){
        let _ = this;
        _.shadowRoot.innerHTML = `<div class="mod-qrcode">
            <canvas></canvas>
        </div>`;
        _.$module = _.shadowRoot.querySelector('.mod-qrcode');
        _.$canvas = _.$module.querySelector('canvas');
        _.context = _.$canvas.getContext('2d');
        _.resize();

        if (typeof ResizeObserver !== 'undefined') {
            let observer = new ResizeObserver(() => {
                _.resize();
            });
            observer.observe(_);
        }
    }
    resize(){
        let _ = this;
        let clientSize = Math.max(_.clientWidth,_.clientHeight);
        _.$canvas.width = clientSize*2;
        _.$canvas.height = clientSize*2;
        _.drawQRCode();
    }
    drawQRCode(){
        let _ = this;
        let data = QRCode(_.text, _.level);
        _.context.clearRect(0,0,_.$canvas.width,_.$canvas.height);
        Draw['default'](_.context, data, {});
    }
}

if(!customElements.get('widget-qrcode')){
    customElements.define('widget-qrcode', WidgetQRCode);
}
