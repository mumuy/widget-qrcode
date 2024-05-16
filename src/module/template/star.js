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
    context.fillStyle = 'rgb(17,36,67)';
    for(var i=0;i<len;i++){
        for(var j=0;j<len;j++){
            if(api.getValue(i,j)==1){
                if(api.isPositionPoint(i,j)){
                    context.fillStyle = 'rgb(17,36,67)';
                    context.beginPath();
                    context.arc((i+3.5)*pxWidth,(j+3.5)*pxWidth,3.75*pxWidth,0,2*Math.PI);
                    context.closePath();
                    context.fill();
                    context.fillStyle = '#ffffff';
                    context.beginPath();
                    context.arc((i+3.5)*pxWidth,(j+3.5)*pxWidth,2.8*pxWidth,0,2*Math.PI);
                    context.closePath();
                    context.fill();
                    context.fillStyle = 'rgb(17,36,67)';
                    context.beginPath();
                    context.arc((i+1)*pxWidth,(j+1)*pxWidth,2.5*pxWidth,0,0.5*Math.PI);
                    context.arc((i+6)*pxWidth,(j+1)*pxWidth,2.5*pxWidth,0.5*Math.PI,Math.PI);
                    context.arc((i+6)*pxWidth,(j+5)*pxWidth+pxWidth,2.5*pxWidth,Math.PI,1.5*Math.PI);
                    context.arc((i+1)*pxWidth,(j+5)*pxWidth+pxWidth,2.5*pxWidth,1.5*Math.PI,2*Math.PI);
                    context.closePath();
                    context.fill();
                    api.setRangeDisabled(i,j,7,7);
                }else{
                    if((i+j)%2){
                        context.beginPath();
                        context.arc(i*pxWidth,j*pxWidth,0.5*pxWidth,0,0.5*Math.PI);
                        context.arc(i*pxWidth+pxWidth,j*pxWidth,0.5*pxWidth,0.5*Math.PI,Math.PI);
                        context.arc(i*pxWidth+pxWidth,j*pxWidth+pxWidth,0.5*pxWidth,Math.PI,1.5*Math.PI);
                        context.arc(i*pxWidth,j*pxWidth+pxWidth,0.5*pxWidth,1.5*Math.PI,2*Math.PI);
                        context.closePath();
                        context.fill();
                    }else{
                        context.beginPath();
                        context.arc((i+0.5)*pxWidth,(j+0.5)*pxWidth,0.5*pxWidth,0,2*Math.PI);
                        context.closePath();
                        context.fill();
                    }
                }
            }
        }
    }
};
