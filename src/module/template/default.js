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
        context.translate(x,y);
        for(let i=0;i<len;i++){
            for(let j=0;j<len;j++){
                if(api.getValue(i,j)){
                    if(api.isPositionPoint(i,j)==1){
                        context.fillStyle = innerColor;
                    }else if(api.isPositionPoint(i,j)==2){
                        context.fillStyle = outerColor;
                    }else{
                        context.fillStyle = foregroundImage;
                    }
                    context.fillRect(Math.ceil(i*pxWidth)-0.5,Math.ceil(j*pxWidth)-0.5,Math.ceil(pxWidth)+1,Math.ceil(pxWidth)+1);
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
