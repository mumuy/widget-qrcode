import getAPI from '../method/DrawUtil.js';

export default function(context,data,options){
    let len = data.length;
    let margin = context.canvas.width*0.05;
    let pxWidth = (context.canvas.width-2*margin)/len;
    let x = margin;
    let y = margin;
    let api = getAPI(context,data,options);
    let resourcesMap = {};
    if(options.foregroundImage){
        resourcesMap['foregroundImage'] = options.foregroundImage;
    }
    if(options.backgroundImage){
        resourcesMap['backgroundImage'] = options.backgroundImage;
    }
    api.imageReady(resourcesMap).then(function(resources){
        let backgroundColor = options.backgroundColor||'#ffffff';
        let foregroundColor = options.foregroundColor||'#000000';
        let colors = foregroundColor.split(',');
        let color = colors[0];
        if(!options.foregroundColor&&resources.foregroundImage){
            color = api.getForegroundImageBrush(resources.foregroundImage);
        }
        if(colors.length>1){
            let gradient = context.createLinearGradient(0,0,context.canvas.width,context.canvas.height);
            let length = colors.length-1;
            colors.forEach(function(value,index){
                gradient.addColorStop(index/length,value);
            });
            color = gradient;
        }
        let innerColor = options.innerColor||color;
        let outerColor = options.outerColor||color;
        context.save();
        if(!options.backgroundColor&&resources.backgroundImage){
            context.drawImage(resources.backgroundImage,0,0,context.canvas.width,context.canvas.height);
        }else{
            context.fillStyle = backgroundColor;
            context.fillRect(0,0,context.canvas.width,context.canvas.height);
        }
        context.restore();
        context.save();
        context.translate(x,y);
        for(let i=0;i<len;i++){
            for(let j=0;j<len;j++){
                if(api.isPositionPoint(i,j)==1){
                    context.fillStyle = innerColor;
                    context.strokeStyle = innerColor;
                }else if(api.isPositionPoint(i,j)==2){
                    context.fillStyle = outerColor;
                    context.strokeStyle = outerColor;
                }else{
                    context.fillStyle = color;
                    context.strokeStyle = color;
                }
                if (api.getValue(i,j)){
                    let cx = i * pxWidth;
                    let cy = j * pxWidth + pxWidth / 2;
                    context.beginPath();
                    context.moveTo(cx, cy);
                    if ((api.getValue(i-1, j) ||api.getValue(i , j-1)) || (api.getValue(i - 1, j - 1))) {
                        api.drawRightAngle(i, j, 0, pxWidth);
                    } else {
                        api.drawRoundBrick(i, j, 0, pxWidth);
                    }
                    if ((api.getValue(i, j - 1) || api.getValue(i+1, j)) || (api.getValue(i + 1, j - 1))) {
                        api.drawRightAngle(i, j, 1, pxWidth);
                    } else {
                        api.drawRoundBrick(i, j, 1, pxWidth);
                    }
                    if ((api.getValue(i , j + 1) || api.getValue(i + 1, j)) || (api.getValue(i + 1, j + 1))) {
                        api.drawRightAngle(i, j, 2, pxWidth);
                    } else {
                        api.drawRoundBrick(i, j, 2, pxWidth);
                    }
                    if ((api.getValue(i, j + 1) || api.getValue(i - 1, j)) || (api.getValue(i - 1, j + 1))) {
                        api.drawRightAngle(i, j, 3, pxWidth);
                    } else {
                        api.drawRoundBrick(i, j, 3, pxWidth);
                    }
                    context.closePath();
                    context.fill();
                    context.stroke();
                }else if(!api.isPositionPoint(i, j, len)){
                    if (api.getValue(i, j - 1) &&api.getValue(i - 1, j)) {
                        api.fillRound(i, j, 0, pxWidth);
                    }
                    if (api.getValue(i, j + 1) && api.getValue(i - 1, j)) {
                        api.fillRound(i, j, 3, pxWidth);
                    }
                    if (api.getValue(i, j + 1) && api.getValue(i + 1, j)) {
                        api.fillRound(i, j, 2, pxWidth);
                    }
                    if (api.getValue(i, j - 1) && api.getValue(i + 1, j)) {
                        api.fillRound(i, j, 1, pxWidth);
                    }
                }
            }
        }
        context.restore();
    });
};
