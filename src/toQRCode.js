/*
*   将文本内容转化成Base64图片
*/
import QRCode from './module/qrcode.js';

export default function(params){
    const options = Object.assign({
        'value':'https://passer-by.com',
        'width':160
    },params);
    let data = QRCode(params.value, 'L');
    const $canvas = document.createElement('CANVAS');
    const context = $canvas.getContext('2d')
    $canvas.width = options.width;
    $canvas.height = options.width;
    context.clearRect(0,0,options.width,options.width);

    /***** 公共方法 *****/
    let getValue = function(x, y) {
        if(!data){
            return false;
        }
        let len = data.length;
        return (!(x < 0 || y < 0 || x >= len || y >= len) && data[x][y]);
    };
    // 画图
    let len = data.length;
    let pxWidth = $canvas.width/(len+2);
    let x = Math.ceil(pxWidth);
    let y = Math.ceil(pxWidth);
    context.save();
    context.fillStyle = '#ffffff';
    context.fillRect(0,0,$canvas.width,$canvas.height);
    context.translate(x,y);
    context.fillStyle = '#000000';
    for(let i=0;i<len;i++){
        for(let j=0;j<len;j++){
            if(getValue(i,j)){
                context.fillRect(Math.ceil(i*pxWidth),Math.ceil(j*pxWidth),Math.ceil(pxWidth),Math.ceil(pxWidth));
            }
        }
    }
    context.restore();

    return $canvas.toDataURL();
}