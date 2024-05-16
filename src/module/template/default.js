import {getAPI} from '../method/DrawUtil.js';

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
            if(api.getValue(i,j)){
                context.fillRect(Math.ceil(i*pxWidth),Math.ceil(j*pxWidth),Math.ceil(pxWidth),Math.ceil(pxWidth));
            }
        }
    }
    context.restore();
};
