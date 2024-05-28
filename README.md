# 基于Web component的二维码组件


## 网页组件
```html
<widget-qrcode value="https://passer-by.com/"></widget-code>
```


## 属性说明
<table>
    <caption><h3>组件属性</h3></caption>
    <thead>
        <tr><th>属性</th><th>说明</th></tr>
    </thead>
    <tbody>
        <tr><td>value</td><td>二维码内容</td></tr>
        <tr><td>template</td><td>样式模板,可选：'default','water','diamond','hexagon','star','rect','bar','heart','glitter','fusion'</td></tr>
        <tr><td>level</td><td>纠错等级,可选：'M','L','Q','H'</td></tr>
        <tr><td>width</td><td>二维码宽度，默认：300</td></tr>
        <tr><td>height</td><td>二维码高度，默认：300</td></tr>
        <tr><td>background-color</td><td>背景色，默认：#ffffff</td></tr>
        <tr><td>foreground-color</td><td>前景色，默认：#000000;（多色用逗号分隔）</td></tr>
        <tr><td>inner-color</td><td>定位点内层颜色，默认：#000000</td></tr>
        <tr><td>outer-color</td><td>定位点外层颜色，默认：#000000</td></tr>
        <tr><td>background-image</td><td>背景图片地址</td></tr>
        <tr><td>foreground-image</td><td>前景图片地址</td></tr>
        <tr><td>logo</td><td>logo图片地址</td></tr>
        <tr><td>text</td><td>悬浮文本内容</td></tr>
        <tr><td>text-color</td><td>悬浮文本颜色</td></tr>
        <tr><td>text-stroke</td><td>悬浮文本描边</td></tr>
    </tbody>
</table>
