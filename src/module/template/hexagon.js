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
        let innerColor = options.innerColor||colors?.[1]||foregroundImage;
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
        let sqrt3 = 1.5;//Math.sqrt(3);
        for(let i=0;i<len;i++){
            for(let j=0;j<len;j++){
                if(api.getValue(i,j)==1){
                    if(api.isPositionPoint(i,j)==1){
                        context.fillStyle = innerColor;
                        context.strokeStyle = innerColor;
                    }else if(api.isPositionPoint(i,j)==2){
                        context.fillStyle = outerColor;
                        context.strokeStyle = outerColor;
                    }else{
                        let fillColor = colors[(i+j)%colors.length];
                        if(!options.foregroundColor&&resources.foregroundImage){
                            fillColor = foregroundImage;
                        }
                        context.fillStyle = fillColor;
                        context.strokeStyle = fillColor;
                    }
                    if(api.isPositionPoint(i,j)){
                        context.beginPath();
                        context.moveTo(i*pxWidth-0.5*pxWidth,j*pxWidth+1*pxWidth);
                        context.lineTo(i*pxWidth+3*pxWidth,j*pxWidth-0.5*pxWidth);
                        context.lineTo(i*pxWidth+6.5*pxWidth,j*pxWidth+1*pxWidth);
                        context.lineTo(i*pxWidth+6.5*pxWidth,j*pxWidth+5*pxWidth);
                        context.lineTo(i*pxWidth+3*pxWidth,j*pxWidth+6.5*pxWidth);
                        context.lineTo(i*pxWidth-0.5*pxWidth,j*pxWidth+5*pxWidth);
                        context.closePath();
                        context.fill();
                        context.stroke();
                        context.fillStyle = backgroundColor;
                        context.strokeStyle = backgroundColor;
                        context.beginPath();
                        context.moveTo(i*pxWidth+0.5*pxWidth,j*pxWidth+1.5*pxWidth+1/14*pxWidth);
                        context.lineTo(i*pxWidth+3*pxWidth,j*pxWidth+0.5*pxWidth);
                        context.lineTo(i*pxWidth+5.5*pxWidth,j*pxWidth+1.5*pxWidth+1/14*pxWidth);
                        context.lineTo(i*pxWidth+5.5*pxWidth,j*pxWidth+4.5*pxWidth-1/14*pxWidth);
                        context.lineTo(i*pxWidth+3*pxWidth,j*pxWidth+5.5*pxWidth);
                        context.lineTo(i*pxWidth+0.5*pxWidth,j*pxWidth+4.5*pxWidth-1/14*pxWidth);
                        context.closePath();
                        context.fill();
                        context.stroke();
                        context.fillStyle = innerColor;
                        context.strokeStyle = innerColor;
                        context.beginPath();
                        context.moveTo(i*pxWidth+1.5*pxWidth,j*pxWidth+2.5*pxWidth-5/14*pxWidth);
                        context.lineTo(i*pxWidth+3*pxWidth,j*pxWidth+1.5*pxWidth);
                        context.lineTo(i*pxWidth+4.5*pxWidth,j*pxWidth+2.5*pxWidth-5/14*pxWidth);
                        context.lineTo(i*pxWidth+4.5*pxWidth,j*pxWidth+3.5*pxWidth+5/14*pxWidth);
                        context.lineTo(i*pxWidth+3*pxWidth,j*pxWidth+4.5*pxWidth);
                        context.lineTo(i*pxWidth+1.5*pxWidth,j*pxWidth+3.5*pxWidth+5/14*pxWidth);
                        context.closePath();
                        context.fill();
                        context.stroke();
                        api.setRangeDisabled(i,j,7,7);
                        context.fillRect(i*pxWidth-0.25*pxWidth,j*pxWidth-0.25*pxWidth,0.5*pxWidth,0.5*pxWidth);
                        context.fillRect(i*pxWidth+5.75*pxWidth,j*pxWidth-0.25*pxWidth,0.5*pxWidth,0.5*pxWidth);
                        context.fillRect(i*pxWidth-0.25*pxWidth,j*pxWidth+5.75*pxWidth,0.5*pxWidth,0.5*pxWidth);
                        context.fillRect(i*pxWidth+5.75*pxWidth,j*pxWidth+5.75*pxWidth,0.5*pxWidth,0.5*pxWidth);
                    }else{
                        context.beginPath();
                        if(i%2){
                            context.moveTo(i*pxWidth-pxWidth/sqrt3,j*pxWidth-0.25*pxWidth);
                            context.lineTo(i*pxWidth-pxWidth/sqrt3/2,j*pxWidth-0.75*pxWidth);
                            context.lineTo(i*pxWidth+pxWidth/sqrt3/2,j*pxWidth-0.75*pxWidth);
                            context.lineTo(i*pxWidth+pxWidth/sqrt3,j*pxWidth-0.25*pxWidth);
                            context.lineTo(i*pxWidth+pxWidth/sqrt3/2,j*pxWidth+0.25*pxWidth);
                            context.lineTo(i*pxWidth-pxWidth/sqrt3/2,j*pxWidth+0.25*pxWidth);
                        }else{
                            context.moveTo(i*pxWidth-pxWidth/sqrt3,j*pxWidth+0.25*pxWidth);
                            context.lineTo(i*pxWidth-pxWidth/sqrt3/2,j*pxWidth-0.25*pxWidth);
                            context.lineTo(i*pxWidth+pxWidth/sqrt3/2,j*pxWidth-0.25*pxWidth);
                            context.lineTo(i*pxWidth+pxWidth/sqrt3,j*pxWidth+0.25*pxWidth);
                            context.lineTo(i*pxWidth+pxWidth/sqrt3/2,j*pxWidth+0.75*pxWidth);
                            context.lineTo(i*pxWidth-pxWidth/sqrt3/2,j*pxWidth+0.75*pxWidth);
                        }
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
