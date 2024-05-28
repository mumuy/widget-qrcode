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
        context.translate(x,y);
        for(let i=0;i<len;i++){
            for(let j=0;j<len;j++){
                if(api.getValue(i,j)==1){
                    if(api.isPositionPoint(i,j)==1){
                        context.fillStyle = innerColor;
                    }else if(api.isPositionPoint(i,j)==2){
                        context.fillStyle = outerColor;
                    }else{
                        let fillColor = colors[(i+j)%colors.length];
                        if(!options.foregroundColor&&resources.foregroundImage){
                            fillColor = foregroundImage;
                        }
                        context.fillStyle = fillColor;
                    }
                    if(api.isPositionPoint(i,j)){
                        context.fillRect(i*pxWidth,j*pxWidth,7*pxWidth,7*pxWidth);
                        context.fillStyle = backgroundColor;
                        context.fillRect(i*pxWidth+pxWidth,j*pxWidth+pxWidth,5*pxWidth,5*pxWidth);
                        context.fillStyle = innerColor;
                        context.beginPath();
                        context.moveTo((i+3.5)*pxWidth,(j+1)*pxWidth);
                        context.lineTo((i+6)*pxWidth,(j+3.5)*pxWidth);
                        context.lineTo((i+3.5)*pxWidth,(j+6)*pxWidth);
                        context.lineTo((i+1)*pxWidth,(j+3.5)*pxWidth);
                        context.closePath();
                        context.fill();
                        api.setRangeDisabled(i,j,7,7);
                    }else if(api.getRangeTrue(i,j,1,1)&&api.getRangeTrue(i-1,j+1,3,1)&&api.getRangeTrue(i,j+2,1,1)){
                        context.beginPath();
                        context.moveTo((i+0.5)*pxWidth,j*pxWidth);
                        context.lineTo((i+2)*pxWidth,(j+1.5)*pxWidth);
                        context.lineTo((i+0.5)*pxWidth,(j+3)*pxWidth);
                        context.lineTo((i-1)*pxWidth,(j+1.5)*pxWidth);
                        context.closePath();
                        context.fill();
                        api.setRangeDisabled(i,j,1,1);
                        api.setRangeDisabled(i-1,j+1,3,1);
                        api.setRangeDisabled(i,j+2,1,1);
                    }else if(api.getRangeTrue(i,j,3,2)){
                        context.fillRect(i*pxWidth,j*pxWidth,3*pxWidth,2*pxWidth);
                        api.setRangeDisabled(i,j,3,2);
                    }else if(api.getRangeTrue(i,j,2,3)){
                        context.fillRect(i*pxWidth,j*pxWidth,2*pxWidth,3*pxWidth);
                        api.setRangeDisabled(i,j,2,3);
                    }else if(api.getRangeTrue(i,j,2,2)){
                        context.fillRect(i*pxWidth,j*pxWidth,2*pxWidth,2*pxWidth);
                        api.setRangeDisabled(i,j,2,2);
                    }
                }
            }
        }
        for(let i=0;i<len;i++){
            for(let j=0;j<len;j++){
                if(api.getValue(i,j)==1){
                    if(api.isPositionPoint(i,j)==1){
                        context.fillStyle = innerColor;
                    }else if(api.isPositionPoint(i,j)==2){
                        context.fillStyle = outerColor;
                    }else{
                        let fillColor = colors[(i+j)%colors.length];
                        if(!options.foregroundColor&&resources.foregroundImage){
                            fillColor = foregroundImage;
                        }
                        context.fillStyle = fillColor;
                    }
                    if(api.getValue(i-1,j)!=2&&api.getValue(i,j-1)!=2&&api.getValue(i+1,j)!=2&&api.getValue(i,j+1)!=2){
                        if((i+j)%2){
                            context.beginPath();
                            context.moveTo((i+0.5)*pxWidth,j*pxWidth);
                            context.lineTo((i+1)*pxWidth,(j+0.5)*pxWidth);
                            context.lineTo((i+0.5)*pxWidth,(j+1)*pxWidth);
                            context.lineTo(i*pxWidth,(j+0.5)*pxWidth);
                            context.closePath();
                            context.fill();
                        }else{
                            context.fillRect(i*pxWidth,j*pxWidth,pxWidth,pxWidth);
                            api.setRangeDisabled(i,j,1,1);
                        }
                    }else{
                        context.beginPath();
                        context.moveTo((i+0.5)*pxWidth,j*pxWidth);
                        context.lineTo((i+1)*pxWidth,(j+0.5)*pxWidth);
                        context.lineTo((i+0.5)*pxWidth,(j+1)*pxWidth);
                        context.lineTo(i*pxWidth,(j+0.5)*pxWidth);
                        context.closePath();
                        context.fill();
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
};
