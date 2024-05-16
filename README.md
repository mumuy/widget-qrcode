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
        <tr><td>template</td><td>样式模板,可选：'default','water','star'</td></tr>
        <tr><td>level</td><td>纠错等级,可选：'M','L','H','Q'</td></tr>
        <tr><td>width</td><td>二维码宽度，默认：300</td></tr>
        <tr><td>height</td><td>二维码高度，默认：300</td></tr>
    </tbody>
</table>
