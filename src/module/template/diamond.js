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
    if(options.logo){
        resourcesMap['logo'] = options.logo;
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
        let innerColor = options.innerColor||foregroundImage;
        let outerColor = options.outerColor||foregroundImage;
        let backgroundImage = backgroundColor;
        if(!options.backgroundColor&&resources.backgroundImage){
            backgroundImage = context.drawImage(resources.backgroundImage,0,0,context.canvas.width,context.canvas.height);
        }
        context.save();
        context.fillStyle = backgroundImage;
        context.fillRect(0,0,context.canvas.width,context.canvas.height);
        context.restore();
        context.save();
        context.translate(x+pxWidth/2,y+pxWidth/2);
        for(let i=0;i<len;i++){
            for(let j=0;j<len;j++){
                if(api.isPositionPoint(i,j)==1){
                    context.fillStyle = innerColor;
                    context.strokeStyle = innerColor;
                }else if(api.isPositionPoint(i,j)==2){
                    context.fillStyle = outerColor;
                    context.strokeStyle = outerColor;
                }else{
                    context.fillStyle = foregroundImage;
                    context.strokeStyle = foregroundImage;
                }
                if(api.getValue(i,j)){
                    context.beginPath();
                    context.moveTo(i*pxWidth-0.5*pxWidth,j*pxWidth);
                    if(api.getValue(i-1,j)||api.getValue(i,j-1)){
                        context.lineTo(i*pxWidth-0.5*pxWidth,j*pxWidth-0.5*pxWidth);
                    }
                    context.lineTo(i*pxWidth,j*pxWidth-0.5*pxWidth);
                    if(api.getValue(i+1,j)||api.getValue(i,j-1)){
                        context.lineTo(i*pxWidth+0.5*pxWidth,j*pxWidth-0.5*pxWidth);
                    }
                    context.lineTo(i*pxWidth+0.5*pxWidth,j*pxWidth);
                    if(api.getValue(i+1,j)||api.getValue(i,j+1)){
                        context.lineTo(i*pxWidth+0.5*pxWidth,j*pxWidth+0.5*pxWidth);
                    }
                    context.lineTo(i*pxWidth,j*pxWidth+0.5*pxWidth);
                    if(api.getValue(i-1,j)||api.getValue(i,j+1)){
                        context.lineTo(i*pxWidth-0.5*pxWidth,j*pxWidth+0.5*pxWidth);
                    }
                    context.closePath();
                    context.fill();
                    context.stroke();
                }else{
                    if(api.getValue(i-1,j)&&api.getValue(i,j-1)&&api.getValue(i-1,j-1)){
                        context.beginPath();
                        context.moveTo(i*pxWidth-0.5*pxWidth,j*pxWidth-0.5*pxWidth);
                        context.lineTo(i*pxWidth-0.5*pxWidth,j*pxWidth);
                        context.lineTo(i*pxWidth,j*pxWidth-0.5*pxWidth);
                        context.closePath();
                        context.fill();
                        context.stroke();
                    }
                    if(api.getValue(i+1,j)&&api.getValue(i,j-1)&&api.getValue(i+1,j-1)){
                        context.beginPath();
                        context.moveTo(i*pxWidth+0.5*pxWidth,j*pxWidth-0.5*pxWidth);
                        context.lineTo(i*pxWidth+0.5*pxWidth,j*pxWidth);
                        context.lineTo(i*pxWidth,j*pxWidth-0.5*pxWidth);
                        context.closePath();
                        context.fill();
                        context.stroke();
                    }
                    if(api.getValue(i-1,j)&&api.getValue(i,j+1)&&api.getValue(i-1,j+1)){
                        context.beginPath();
                        context.moveTo(i*pxWidth-0.5*pxWidth,j*pxWidth+0.5*pxWidth);
                        context.lineTo(i*pxWidth-0.5*pxWidth,j*pxWidth);
                        context.lineTo(i*pxWidth,j*pxWidth+0.5*pxWidth);
                        context.closePath();
                        context.fill();
                        context.stroke();
                    }
                    if(api.getValue(i+1,j)&&api.getValue(i,j+1)&&api.getValue(i+1,j+1)){
                        context.beginPath();
                        context.moveTo(i*pxWidth+0.5*pxWidth,j*pxWidth+0.5*pxWidth);
                        context.lineTo(i*pxWidth+0.5*pxWidth,j*pxWidth);
                        context.lineTo(i*pxWidth,j*pxWidth+0.5*pxWidth);
                        context.closePath();
                        context.fill();
                        context.stroke();
                    }
                }
            }
        }
        context.restore();
        context.save();
        api.setText();
        if(resources.logo){
            api.setLogo(resources.logo);
        }
        context.restore();
    });
}
