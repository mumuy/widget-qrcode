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
        if(resources.backgroundImage){
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
                    let fillColor = api.getValue(i,j)==1?(options.innerColor||options.foregroundColor||'#000000'):(options.backgroundColor||'#ffffff');
                    if(resources.backgroundImage){
                        fillColor = fillColor.replace(/#([0-9a-fA-F]{6}).*/,'#$188');
                    }
                    context.fillStyle = fillColor;
                    context.fillRect(i*pxWidth,j*pxWidth,pxWidth,pxWidth);
                }else if(api.isPositionPoint(i,j)==2){
                    let fillColor = api.getValue(i,j)==1?(options.outerColor||options.foregroundColor||'#000000'):(options.backgroundColor||'#ffffff');
                    if(resources.backgroundImage){
                        fillColor = fillColor.replace(/#([0-9a-fA-F]{6}).*/,'#$188');
                    }
                    context.fillStyle = fillColor;
                    context.fillRect(i*pxWidth,j*pxWidth,pxWidth,pxWidth);
                }else{
                    let fillColor = api.getValue(i,j)==1?(options.foregroundColor||'#000000'):(options.backgroundColor||'#ffffff');
                    if(resources.backgroundImage){
                        fillColor = fillColor.replace(/#([0-9a-fA-F]{6}).*/,'#$188');
                    }
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
