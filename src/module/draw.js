//绘制角
let drawRightAngle = function(context, x, y, dir, pxWidth) {
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

//绘制填补角
let drawRoundBrick = function(context, x, y, dir, pxWidth) {
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

//填充圆
let fillRound = function(context, x, y, dir, pxWidth) {
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


//基础绘制
export default {
    'default':function(context,data,options){
        let len = data.length;
        let margin = context.canvas.width*0.05;
        let pxWidth = (context.canvas.width-2*margin)/len;
        let x = margin;
        let y = margin;
        let getValue = (x, y) => data?.[x]?.[y];
        context.save();
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
    },
    'water':function(context,data,options){
        let len = data.length;
        let margin = context.canvas.width*0.05;
        let pxWidth = (context.canvas.width-2*margin)/len;
        let x = margin;
        let y = margin;
        let getValue = (x, y) => data?.[x]?.[y];
        context.save();
        context.translate(x,y);
        context.fillStyle = '#000000';
        for(let i=0;i<len;i++){
            for(let j=0;j<len;j++){
                if (getValue(i,j)){
                    let cx = i * pxWidth;
                    let cy = j * pxWidth + pxWidth / 2;
                    context.beginPath();
                    context.moveTo(cx, cy);
                    if ((getValue(i-1, j) ||getValue(i , j-1)) || (getValue(i - 1, j - 1))) {
                        drawRightAngle(context, i, j, 0, pxWidth);
                    } else {
                        drawRoundBrick(context, i, j, 0, pxWidth);
                    }
                    if ((getValue(i, j - 1) || getValue(i+1, j)) || (getValue(i + 1, j - 1))) {
                        drawRightAngle(context, i, j, 1, pxWidth);
                    } else {
                        drawRoundBrick(context, i, j, 1, pxWidth);
                    }
                    if ((getValue(i , j + 1) || getValue(i + 1, j)) || (getValue(i + 1, j + 1))) {
                        drawRightAngle(context, i, j, 2, pxWidth);
                    } else {
                        drawRoundBrick(context, i, j, 2, pxWidth);
                    }
                    if ((getValue(i, j + 1) || getValue(i - 1, j)) || (getValue(i - 1, j + 1))) {
                        drawRightAngle(context, i, j, 3, pxWidth);
                    } else {
                        drawRoundBrick(context, i, j, 3, pxWidth);
                    }
                    context.closePath();
                    context.fill();
                    context.stroke();
                }else{//!isPositionPoint(i, j, len)
                    if (getValue(i, j - 1) &&getValue(i - 1, j)) {
                        fillRound(context, i, j, 0, pxWidth);
                    }
                    if (getValue(i, j + 1) && getValue(i - 1, j)) {
                        fillRound(context, i, j, 3, pxWidth);
                    }
                    if (getValue(i, j + 1) && getValue(i + 1, j)) {
                        fillRound(context, i, j, 2, pxWidth);
                    }
                    if (getValue(i, j - 1) && getValue(i + 1, j)) {
                        fillRound(context, i, j, 1, pxWidth);
                    }
                }
            }
        }
        context.restore();
    }
};
