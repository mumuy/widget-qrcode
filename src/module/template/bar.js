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
        context.translate(x+0.5*pxWidth,y+0.5*pxWidth);
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
                        context.beginPath();
                        context.arc((i+3)*pxWidth,(j+3)*pxWidth,3.5*pxWidth,0,2*Math.PI);
                        context.closePath();
                        context.fill();
                        context.fillStyle = backgroundColor;
                        context.beginPath();
                        context.arc((i+3)*pxWidth,(j+3)*pxWidth,2.5*pxWidth,0,2*Math.PI);
                        context.closePath();
                        context.fill();
                        context.fillStyle = innerColor;
                        context.beginPath();
                        context.arc((i+3)*pxWidth,(j+3)*pxWidth,1.5*pxWidth,0,2*Math.PI);
                        context.closePath();
                        context.fill();
                        api.setRangeDisabled(i,j,7,7);
                    }else if(api.getRangeTrue(i,j,3,1)){
                        context.beginPath();
                        context.arc(i*pxWidth,j*pxWidth,0.4*pxWidth,0.5*Math.PI,1.5*Math.PI);
                        context.arc((i+2)*pxWidth,j*pxWidth,0.4*pxWidth,-0.5*Math.PI,0.5*Math.PI);
                        context.closePath();
                        context.fill();
                        api.setRangeDisabled(i,j,3,1);
                    }else if(api.getRangeTrue(i,j,2,1)){
                        context.beginPath();
                        context.arc(i*pxWidth,j*pxWidth,0.4*pxWidth,0.5*Math.PI,1.5*Math.PI);
                        context.arc((i+1)*pxWidth,j*pxWidth,0.4*pxWidth,-0.5*Math.PI,0.5*Math.PI);
                        context.closePath();
                        context.fill();
                        api.setRangeDisabled(i,j,2,1);
                    }else if(api.getRangeTrue(i,j,1,3)){
                        context.beginPath();
                        context.arc(i*pxWidth,j*pxWidth,0.4*pxWidth,Math.PI,2*Math.PI);
                        context.arc(i*pxWidth,(j+2)*pxWidth,0.4*pxWidth,0,Math.PI);
                        context.closePath();
                        context.fill();
                        api.setRangeDisabled(i,j,1,3);
                    }else if(api.getRangeTrue(i,j,1,2)){
                        context.beginPath();
                        context.arc(i*pxWidth,j*pxWidth,0.4*pxWidth,Math.PI,2*Math.PI);
                        context.arc(i*pxWidth,(j+1)*pxWidth,0.4*pxWidth,0,Math.PI);
                        context.closePath();
                        context.fill();
                        api.setRangeDisabled(i,j,1,2);
                    }else{
                        context.beginPath();
                        context.arc(i*pxWidth,j*pxWidth,0.4*pxWidth,0,2*Math.PI);
                        context.closePath();
                        context.fill();
                    }
                }
            }
        }
        context.restore();
    });
}
