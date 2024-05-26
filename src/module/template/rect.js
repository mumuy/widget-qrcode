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
        let innerColor = options.innerColor||colors?.[1]||color;
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
                if(api.getValue(i,j)==1){
                    if(api.isPositionPoint(i,j)==1){
                        context.fillStyle = innerColor;
                    }else if(api.isPositionPoint(i,j)==2){
                        context.fillStyle = outerColor;
                    }else{
                        let color = colors[(i+j)%colors.length];
                        if(!options.foregroundColor&&resources.foregroundImage){
                            color = context.createPattern(resources.foregroundImage,'repeat');
                        }
                        context.fillStyle = color;
                    }
                    if(api.isPositionPoint(i,j)){
                        context.fillRect(i*pxWidth,j*pxWidth,7*pxWidth,7*pxWidth);
                        context.fillStyle = backgroundColor;
                        context.fillRect(i*pxWidth+pxWidth,j*pxWidth+pxWidth,5*pxWidth,5*pxWidth);
                        context.fillStyle = innerColor;
                        context.beginPath();
                        context.moveTo(i*pxWidth+3.5*pxWidth,j*pxWidth+pxWidth);
                        context.lineTo(i*pxWidth+6*pxWidth,j*pxWidth+3.5*pxWidth);
                        context.lineTo(i*pxWidth+3.5*pxWidth,j*pxWidth+6*pxWidth);
                        context.lineTo(i*pxWidth+pxWidth,j*pxWidth+3.5*pxWidth);
                        context.closePath();
                        context.fill();
                        api.setRangeDisabled(i,j,7,7);
                    }else{
                        if((i+j)%2){
                            context.beginPath();
                            context.moveTo(i*pxWidth+0.5*pxWidth,j*pxWidth);
                            context.lineTo(i*pxWidth+pxWidth,j*pxWidth+0.5*pxWidth);
                            context.lineTo(i*pxWidth+0.5*pxWidth,j*pxWidth+pxWidth);
                            context.lineTo(i*pxWidth,j*pxWidth+0.5*pxWidth);
                            context.closePath();
                            context.fill();
                        }else{
                            context.fillRect(i*pxWidth,j*pxWidth,pxWidth,pxWidth);
                        }
                    }
                }
            }
        }
        context.restore();
    });
};
