// 绘制角
export function drawRightAngle(context, x, y, dir, pxWidth) {
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
};

// 绘制填补角
export function drawRoundBrick(context, x, y, dir, pxWidth) {
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
};

// 填充圆
export function fillRound(context, x, y, dir, pxWidth) {
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
};

// 条件判断API
export function getAPI(data) {
    return {
        getValue:(x, y) => data?.[x]?.[y],
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
        }
    };
};
