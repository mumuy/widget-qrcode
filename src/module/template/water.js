import {drawRightAngle,drawRoundBrick,fillRound,getAPI} from '../method/DrawUtil.js';

export default function(context,data,options){
    let len = data.length;
    let margin = context.canvas.width*0.05;
    let pxWidth = (context.canvas.width-2*margin)/len;
    let x = margin;
    let y = margin;
    let api = getAPI(data);
    context.save();
    context.fillStyle = '#ffffff';
    context.fillRect(0,0,context.canvas.width,context.canvas.height);
    context.restore();
    context.save();
    context.translate(x,y);
    context.fillStyle = '#000000';
    for(let i=0;i<len;i++){
        for(let j=0;j<len;j++){
            if (api.getValue(i,j)){
                let cx = i * pxWidth;
                let cy = j * pxWidth + pxWidth / 2;
                context.beginPath();
                context.moveTo(cx, cy);
                if ((api.getValue(i-1, j) ||api.getValue(i , j-1)) || (api.getValue(i - 1, j - 1))) {
                    drawRightAngle(context, i, j, 0, pxWidth);
                } else {
                    drawRoundBrick(context, i, j, 0, pxWidth);
                }
                if ((api.getValue(i, j - 1) || api.getValue(i+1, j)) || (api.getValue(i + 1, j - 1))) {
                    drawRightAngle(context, i, j, 1, pxWidth);
                } else {
                    drawRoundBrick(context, i, j, 1, pxWidth);
                }
                if ((api.getValue(i , j + 1) || api.getValue(i + 1, j)) || (api.getValue(i + 1, j + 1))) {
                    drawRightAngle(context, i, j, 2, pxWidth);
                } else {
                    drawRoundBrick(context, i, j, 2, pxWidth);
                }
                if ((api.getValue(i, j + 1) || api.getValue(i - 1, j)) || (api.getValue(i - 1, j + 1))) {
                    drawRightAngle(context, i, j, 3, pxWidth);
                } else {
                    drawRoundBrick(context, i, j, 3, pxWidth);
                }
                context.closePath();
                context.fill();
                context.stroke();
            }else{//!isPositionPoint(i, j, len)
                if (api.getValue(i, j - 1) &&api.getValue(i - 1, j)) {
                    fillRound(context, i, j, 0, pxWidth);
                }
                if (api.getValue(i, j + 1) && api.getValue(i - 1, j)) {
                    fillRound(context, i, j, 3, pxWidth);
                }
                if (api.getValue(i, j + 1) && api.getValue(i + 1, j)) {
                    fillRound(context, i, j, 2, pxWidth);
                }
                if (api.getValue(i, j - 1) && api.getValue(i + 1, j)) {
                    fillRound(context, i, j, 1, pxWidth);
                }
            }
        }
    }
    context.restore();
};
