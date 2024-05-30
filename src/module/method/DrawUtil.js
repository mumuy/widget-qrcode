// 条件判断API
let imageCache = {};
export default function(context,data,options) {
    return {
        // 图片加载
        imageReady:function(resources){
            let result = {};
            let promoses = Object.entries(resources).map(function(item){
                return new Promise(function(resolve){
                    let [key,src] = item;
                    if(imageCache[src]&&imageCache[src].width){
                        result[key] = imageCache[src];
                        resolve();
                    }else{
                        let image = new Image();
                        image.src = src;
                        image.onload = function(){
                            result[key] = image;
                            imageCache[src] = image;
                            resolve();
                        };
                    }
                });
            });
            return promoses.length?Promise.all(promoses).then(()=>result):Promise.resolve({});
        },
        // 获取当前点的值
        getValue:(x, y) => data?.[x]?.[y],
        // 判断定位点
        isPositionPoint:function(i, j) {
            if(!data){
                return false;
            }
            let len = data.length;
            let status = 0;
            if ((i >= 2 && i < 5) && (j >= 2 && j < 5)) {//左上角内点
                status = 1;
            } else if (i < 7 && j < 7) {//左上角外框
                status = 2;
            } else if ((i >= len - 5 && i < len - 2 && j >= 2 & j < 5)) {//左下角内点
                status = 1;
            } else if ((i >= len - 7 && i < len && j >= 0 & j < 7)) {//左下角外框
                status = 2;
            } else if ((i >= 2 && i < 5 && j >= len - 5 & j < len - 2)) {//右上角内点
                status = 1;
            } else if ((i >= 0 && i < 7 && j >= len - 7 & j < len)) {//右上角外框
                status = 2;
            }
            return status;
        },
        //获取墙壁范围
        getRangeTrue:function(x, y, width, height){
            let isTrue = true;
            if(!data){
                return false;
            }else{
                let len = data.length;
                for(let i=x;i<x+width;i++){
                    for(let j=y;j<y+height;j++){
                        if(this.getValue(i,j)!=1){
                            isTrue = false;
                        }
                    }
                }
                return isTrue;
            }
        },
        //获取空白范围
        getRangeFalse:function(x, y, width, height){
            let isFalse = true;
            if(!data){
                return false;
            }else{
                let len = data.length;
                for(let i=x;i<x+width;i++){
                    for(let j=y;j<y+height;j++){
                        if(this.getValue(i,j)){
                            isFalse = false;
                        }
                    }
                }
                return isFalse;
            }
        },
        //设置范围，表示已被图片代替
        setRangeDisabled:function(x, y, width, height) {
            if(!data){
                return false;
            }else{
                let len = data.length;
                for(let i=x;i<x+width;i++){
                    for(let j=y;j<y+height;j++){
                        if(i < 0 || j < 0 || i >= len || j >= len){
                            continue;
                        }else{
                            data[i][j] = 2;
                        }
                    }
                }
            }
        },
        // 图片笔刷
        getImageBrush:function(image,fill='default'){
            let brush;
            if(image.width>context.canvas.width||image.height>context.canvas.height){
                let $canvas = document.createElement('canvas');
                let contextTemp = $canvas.getContext('2d');
                if(image.width>context.canvas.width&&image.height>context.canvas.height){
                    if(image.width/image.height<context.canvas.width/context.canvas.height){
                        $canvas.width = context.canvas.width;
                        $canvas.height = image.height/image.width*context.canvas.width;
                    }else{
                        $canvas.width = image.width/image.height*context.canvas.height;
                        $canvas.height = context.canvas.height;
                    }
                }else{
                    if(image.width>context.canvas.width){
                        $canvas.width = context.canvas.width;
                        $canvas.height = image.height/image.width*context.canvas.width;
                    }else{
                        $canvas.width = image.width/image.height*context.canvas.height;
                        $canvas.height = context.canvas.height;
                    }
                }
                contextTemp.drawImage(image,0,0,$canvas.width,$canvas.height);
                brush = context.createPattern($canvas,'repeat');
            }else{
                brush = context.createPattern(image,'repeat');
            }
            return brush;
        },
        // 绘制角
        drawRightAngle:function(x, y, dir, pxWidth) {
            let cx, cy;
            switch (dir) {
                case 0:
                    cx = x * pxWidth;
                    cy = y * pxWidth;
                    context.lineTo(cx, cy);
                    break;
                case 1:
                    cx = x * pxWidth + pxWidth;
                    cy = y * pxWidth;
                    context.lineTo(cx, cy);
                    break;
                case 2:
                    cx = x * pxWidth + pxWidth;
                    cy = y * pxWidth + pxWidth;
                    context.lineTo(cx, cy);
                    break;
                case 3:
                    cx = x * pxWidth;
                    cy = y * pxWidth + pxWidth;
                    context.lineTo(cx, cy);
                    break;
            }
        },
        // 绘制角补角
        drawRoundBrick:function(x, y, dir, pxWidth) {
            let round = pxWidth/2;
            let cx, cy;
            switch (dir) {
                case 0:
                    cx = x * pxWidth + round;
                    cy = y * pxWidth + round;
                    context.arc(cx, cy, round, Math.PI, Math.PI * 1.5, false);
                    break;
              case 1:
                    cx = x * pxWidth + pxWidth - round;
                    cy = y * pxWidth + round;
                    context.arc(cx, cy, round, Math.PI * 1.5, Math.PI * 2, false);
                    break;
              case 2:
                    cx = x * pxWidth + pxWidth - round;
                    cy = y * pxWidth + pxWidth - round;
                    context.arc(cx, cy, round, 0, Math.PI / 2, false);
                    break;
              case 3:
                    cx = x * pxWidth + round;
                    cy = y * pxWidth + pxWidth - round;
                    context.arc(cx, cy, round, Math.PI / 2, Math.PI, false);
                    break;
            }
        },
        // 填充圆
        fillRound:function(x, y, dir, pxWidth) {
            let round = pxWidth/2;
            let cx, cy;
            context.beginPath();
            switch (dir) {
                case 0:
                    cx = x * pxWidth + round;
                    cy = y * pxWidth + round;
                    context.arc(cx, cy, round, Math.PI, Math.PI * 1.5, false);
                    cx = x * pxWidth;
                    cy = y * pxWidth;
                    break;
                case 1:
                    cx = x * pxWidth + pxWidth - round;
                    cy = y * pxWidth + round;
                    context.arc(cx, cy, round, Math.PI * 1.5, Math.PI * 2, false);
                    cx = x * pxWidth + pxWidth;
                    cy = y * pxWidth;
                    break;
                case 2:
                    cx = x * pxWidth + pxWidth - round;
                    cy = y * pxWidth + pxWidth - round;
                    context.arc(cx, cy, round, 0, Math.PI / 2, false);
                    cx = x * pxWidth + pxWidth;
                    cy = y * pxWidth + pxWidth;
                    break;
                case 3:
                    cx = x * pxWidth + round;
                    cy = y * pxWidth + pxWidth - round;
                    context.arc(cx, cy, round, Math.PI / 2, Math.PI, false);
                    cx = x * pxWidth;
                    cy = y * pxWidth + pxWidth;
                    break;
                default:
            }
            context.lineTo(cx, cy);
            context.closePath();
            context.fill();
            context.stroke();
        },
        setText(){
            if(options.text){
                let fontSize = Math.ceil(context.canvas.height/12.5);
                let lineWidth = Math.ceil(context.canvas.height/50);
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.font = `bold ${fontSize}px 微软雅黑`;
                context.lineWidth = lineWidth;
                context.strokeStyle = options.textStroke||'#ffffff';
                context.strokeText(options.text,context.canvas.width/2,context.canvas.height/2);
                context.fillStyle = options.textColor||'#000000';
                context.fillText(options.text,context.canvas.width/2,context.canvas.height/2);
            }
        },
        setLogo(image){
            let logoSize = Math.ceil(context.canvas.width/4);
            let x = (context.canvas.width-logoSize)/2;
            let y = (context.canvas.height-logoSize)/2;
            context.drawImage(image,x,y,logoSize,logoSize);
        }
    };
};
