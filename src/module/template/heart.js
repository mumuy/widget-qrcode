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
        let unit = pxWidth;
        for(let i=0;i<len;i++){
            for(let j=0;j<len;j++){
                if(api.getValue(i,j)==1){
                    context.save();
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
                    if(api.getRangeTrue(i,j,3,3)){
                        unit = 0.92*pxWidth;
                        context.translate(x+(i+1.45)*pxWidth,y+(j+0.95)*pxWidth);
                        context.beginPath();
                        context.arc(-unit,0,unit,Math.PI,0,false);
                        context.arc(unit,0,unit,Math.PI,0,false); //貝塞尔曲线画心
                        context.bezierCurveTo(1.9*unit, 1.2*unit, 0.6*unit, 1.6*unit, 0, 3.0*unit);
                        context.bezierCurveTo(-0.6*unit, 1.6*unit,-1.9*unit, 1.2*unit,-2*unit,0);
                        context.closePath();
                        context.fill();
                        api.setRangeDisabled(i,j,3,3);
                    }else if(api.getRangeTrue(i,j,2,2)){
                        unit = 0.5*pxWidth;
                        context.translate(x+(i+1)*pxWidth,y+(j+0.9)*pxWidth);
                        context.beginPath();
                        context.arc(-unit,0,unit,Math.PI,0,false);
                        context.arc(unit,0,unit,Math.PI,0,false); //貝塞尔曲线画心
                        context.bezierCurveTo(1.9*unit, 1.2*unit, 0.6*unit, 1.6*unit, 0, 3.0*unit);
                        context.bezierCurveTo(-0.6*unit, 1.6*unit,-1.9*unit, 1.2*unit,-2*unit,0);
                        context.closePath();
                        context.fill();
                        api.setRangeDisabled(i,j,2,2);
                    }else{
                        unit = 0.25*pxWidth;
                        context.translate(x+(i+0.5)*pxWidth,y+(j+0.5)*pxWidth);
                        context.beginPath();
                        context.arc(-unit,0,unit,Math.PI,0,false);
                        context.arc(unit,0,unit,Math.PI,0,false); //貝塞尔曲线画心
                        context.bezierCurveTo(1.9*unit, 1.2*unit, 0.6*unit, 1.6*unit, 0, 3.0*unit);
                        context.bezierCurveTo(-0.6*unit, 1.6*unit,-1.9*unit, 1.2*unit,-2*unit,0);
                        context.closePath();
                        context.fill();
                    }
                    context.restore();
                }
            }
        }
        context.save();
        api.setText();
        if(resources.logo){
            api.setLogo(resources.logo);
        }
        context.restore();
    });
}
