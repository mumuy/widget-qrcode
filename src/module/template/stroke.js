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
            backgroundImage = api.getImageBrush(resources.backgroundImage);
        }
        context.save();
        context.fillStyle = backgroundImage;
        context.fillRect(0,0,context.canvas.width,context.canvas.height);
        context.restore();
        context.save();
        context.translate(x,y);
        context.fillStyle = colors[0];
        for(let i=0;i<len;i++){
            for(let j=0;j<len;j++){
                if(api.getValue(i,j)==1){
                    if((i+j)%2&&!api.getValue(i-1,j)&&!api.getValue(i+1,j)&&!api.getValue(i,j-1)&&!api.getValue(i,j+1)){
                        context.beginPath();
                        context.arc((i+0.5)*pxWidth,(j+0.5)*pxWidth,0.25*pxWidth,0,2*Math.PI);
                        context.closePath();
                        context.fill();
                    }else{
                        for(let m=9;m;m--){
                            for(let n=9;n;n--){
                                if(api.getRangeTrue(i,j,m,n)){
                                    context.fillRect((i+0.05)*pxWidth,(j+0.05)*pxWidth,(m-0.1)*pxWidth,(n-0.1)*pxWidth);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        let map = JSON.parse(JSON.stringify(data));
        let render = function(i,j){
            if(api.getValue(i,j)&&map[i][j]==1){
                if((i+j)%2&&!api.getValue(i-1,j)&&!api.getValue(i+1,j)&&!api.getValue(i,j-1)&&!api.getValue(i,j+1)){
                }else{
                    for(let m=9;m;m--){
                        for(let n=9;n;n--){
                            if(api.getRangeTrue(i,j,m,n)){
                                context.fillRect((i+0.15)*pxWidth,(j+0.15)*pxWidth,(m-0.3)*pxWidth,(n-0.3)*pxWidth);
                                break;
                            }
                        }
                    }
                }
                //寻找附近
                map[i][j]=2;
                render(i-1,j);
                render(i+1,j);
                render(i,j-1);
                render(i,j+1);
            }
        };
        context.lineWidth = 1;
        for(let i=0;i<len;i++){
            for(let j=0;j<len;j++){
                if(api.getValue(i,j)==1){
                    if(api.isPositionPoint(i,j)==1){
                        context.fillStyle = innerColor;
                    }else if(api.isPositionPoint(i,j)==2){
                        let color = colors[1+(i*j)%(colors.length-1)];
                        let outerColor = options.outerColor||color;
                        context.fillStyle = outerColor;
                    }else{
                        let fillColor = colors[1+(i*j)%(colors.length-1)];
                        if(!options.foregroundColor&&resources.foregroundImage){
                            fillColor = foregroundImage;
                        }
                        context.fillStyle = fillColor;
                    }
                    render(i,j);
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
