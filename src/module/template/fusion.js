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
        let foregroundImage = colors[0];
        if(!options.foregroundColor&&resources.foregroundImage){
            foregroundImage = api.getImageBrush(resources.foregroundImage);
        }
        if(colors.length>1){
            let gradient = context.createLinearGradient(0,0,context.canvas.width,context.canvas.height);
            let length = colors.length-1;
            colors.forEach(function(value,index){
                gradient.addColorStop(index/length,value);
            });
            foregroundImage = gradient;
        }
        let innerColor = options.innerColor||foregroundColor;
        let outerColor = options.outerColor||foregroundColor;
        if(resources.backgroundImage){
            foregroundColor = foregroundColor.replace(/#([0-9a-fA-F]{6}).*/,'#$188');
            backgroundColor = backgroundColor.replace(/#([0-9a-fA-F]{6}).*/,'#$188');
            innerColor = innerColor.replace(/#([0-9a-fA-F]{6}).*/,'#$188');
            outerColor = outerColor.replace(/#([0-9a-fA-F]{6}).*/,'#$188');
        }
        let innerImage = innerColor||foregroundImage;
        let outerImage = outerColor||foregroundImage;
        let backgroundImage = resources.backgroundImage?api.getImageBrush(resources.backgroundImage):backgroundColor;
        context.save();
        context.fillStyle = backgroundImage;
        context.fillRect(0,0,context.canvas.width,context.canvas.height);
        context.restore();
        context.save();
        context.translate(x,y);
        for(let i=0;i<len;i++){
            for(let j=0;j<len;j++){
                if(api.isPositionPoint(i,j)){
                    if(api.getValue(i,j)==1){
                        context.fillStyle = outerImage;
                        context.fillRect(i*pxWidth,j*pxWidth,7*pxWidth,7*pxWidth);
                        context.fillStyle = backgroundImage;
                        context.fillRect((i+1)*pxWidth,(j+1)*pxWidth,5*pxWidth,5*pxWidth);
                        context.fillStyle = backgroundColor;
                        context.fillRect((i+1)*pxWidth,(j+1)*pxWidth,5*pxWidth,5*pxWidth);
                        context.fillStyle = backgroundImage;
                        context.fillRect((i+2)*pxWidth,(j+2)*pxWidth,3*pxWidth,3*pxWidth);
                        context.fillStyle = innerImage;
                        context.fillRect((i+2)*pxWidth,(j+2)*pxWidth,3*pxWidth,3*pxWidth);
                        api.setRangeDisabled(i,j,7,7);
                    }
                }else{
                    let fillColor = api.getValue(i,j)==1?foregroundColor:backgroundColor;
                    context.fillStyle = fillColor;
                    context.beginPath();
                    context.arc(i*pxWidth,j*pxWidth,0.5*pxWidth,0,0.5*Math.PI);
                    context.arc(i*pxWidth+pxWidth,j*pxWidth,0.5*pxWidth,0.5*Math.PI,Math.PI);
                    context.arc(i*pxWidth+pxWidth,j*pxWidth+pxWidth,0.5*pxWidth,Math.PI,1.5*Math.PI);
                    context.arc(i*pxWidth,j*pxWidth+pxWidth,0.5*pxWidth,1.5*Math.PI,2*Math.PI);
                    context.closePath();
                    context.fill();
                }
            }
        }
        context.restore();
    });
};
