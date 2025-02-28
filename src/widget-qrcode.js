import QRCode from './module/qrcode.js';
import Draw from './module/draw.js';
import styleSheet from './style/default.css' assert { type: 'css'};

class WidgetQRCode extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:'open'});
    }
    static get observedAttributes(){
        return ['value','template','level','width','height','logo','text','text-color','text-stroke','foreground-image','background-image','foreground-color','background-color','inner-color','outer-color'];
    }
    get value(){
        return this.getAttribute('value')||'https://passer-by.com/';
    }
    set value(value){
        return this.setAttribute('value',value);
    }
    get template(){
        return this.getAttribute('template')||'default';
    }
    set template(value){
        return this.setAttribute('template',value);
    }
    get level(){
        return this.getAttribute('level')||'H';
    }
    set level(value){
        return this.setAttribute('level',value);
    }
    get width(){
        return +this.getAttribute('width')||0;
    }
    set width(value){
        return this.setAttribute('width',value);
    }
    get height(){
        return +this.getAttribute('height')||0;
    }
    set height(value){
        return this.setAttribute('height',value);
    }
    get logo(){
        return this.getAttribute('logo')||'';
    }
    set logo(value){
        return this.setAttribute('logo',value);
    }
    get text(){
        return this.getAttribute('text')||'';
    }
    set text(value){
        return this.setAttribute('text',value);
    }
    get textColor(){
        return this.getAttribute('text-color')||'';
    }
    set textColor(value){
        return this.setAttribute('text-color',value);
    }
    get textStroke(){
        return this.getAttribute('text-stroke')||'';
    }
    set textStroke(value){
        return this.setAttribute('text-stroke',value);
    }
    get foregroundImage(){
        return this.getAttribute('foreground-image')||'';
    }
    set foregroundImage(value){
        return this.setAttribute('foreground-image',value);
    }
    get backgroundImage(){
        return this.getAttribute('background-image')||'';
    }
    set backgroundImage(value){
        return this.setAttribute('background-image',value);
    }
    get foregroundColor(){
        return this.getAttribute('foreground-color')||'';
    }
    set foregroundColor(value){
        return this.setAttribute('foreground-color',value);
    }
    get backgroundColor(){
        return this.getAttribute('background-color')||'';
    }
    set backgroundColor(value){
        return this.setAttribute('background-color',value);
    }
    get innerColor(){
        return this.getAttribute('inner-color')||'';
    }
    set innerColor(value){
        return this.setAttribute('inner-color',value);
    }
    get outerColor(){
        return this.getAttribute('outer-color')||'';
    }
    set outerColor(value){
        return this.setAttribute('outer-color',value);
    }
    attributeChangedCallback(name, oldValue, newValue){
        if(oldValue!=newValue){
            this.context&&this.drawQRCode();
        }
    }
    connectedCallback () {
        let _ = this;
        // 模板
        const defaultSheet = new CSSStyleSheet();
        defaultSheet.insertRule(`
            :host{
                --width: attr(width px);
                --height: attr(height px);
                width: var(--width, 300px);
                height: var(--height, 300px); 
            }
        `);
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
        // 自适应
        _.addEventListener('resize',function(){
            _.resize();
        },false);
        // Edge浏览器切换tab画布被清空问题
        if(navigator.userAgent.includes('Edg/')){
            document.addEventListener('visibilitychange',function(){
                _.drawQRCode();
            });
        }
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
        let style = window.getComputedStyle(_);
        if(style.width&&style.height){
            let clientSize = Math.max(parseInt(style.width),parseInt(style.height));
            _.$canvas.width = clientSize*2;
            _.$canvas.height = clientSize*2;
            _.drawQRCode();
        }
    }
    drawQRCode(){
        let _ = this;
        let level =_.logo?'H':_.level;
        let data = QRCode(_.value, level);
        _.context.clearRect(0,0,_.$canvas.width,_.$canvas.height);
        (Draw[_.template]||Draw['default'])(_.context, data, {
            'foregroundImage':_.foregroundImage,
            'backgroundImage':_.backgroundImage,
            'foregroundColor':_.foregroundColor,
            'backgroundColor':_.backgroundColor,
            'innerColor':_.innerColor,
            'outerColor':_.outerColor,
            'logo':_.logo,
            'text':_.text,
            'textColor':_.textColor,
            'textStroke':_.textStroke
        });
    }
}

if(!customElements.get('widget-qrcode')){
    customElements.define('widget-qrcode', WidgetQRCode);
}
