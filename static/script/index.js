
if(!navigator.userAgent.includes('Mobi')){
    $('.mod-panel h1').headroom({
        autoHide:false
    });

    // 标题字体调整
    (function(){
        let $h1 = document.querySelector('.mod-panel h1');
        let lastScrollTop = 0;
        let offsetTop = $h1.offsetTop;
        let resetTitle = function(){
            let scrollTop = document.documentElement.scrollTop;
            if(scrollTop!=lastScrollTop){
                let fontSize = 36 - 15*Math.min(scrollTop/offsetTop,1);
                $h1.style.fontSize = fontSize+'px';
                lastScrollTop = scrollTop;
            }
            requestAnimationFrame(resetTitle);
        };
        requestAnimationFrame(resetTitle);
    })();
}


// 头部滚动
(function(){
    let $header = document.querySelector('.header');
    document.addEventListener('scroll',function(){
        let scrollTop = document.documentElement.scrollTop;
        let ratio = Math.min(scrollTop/800,1);
        $header.style.background = 'rgba(255,255,255,'+(ratio*0.8)+')';
        $header.style.boxShadow = '1px 1px 6px rgba(0,0,0,'+(ratio*0.1)+')';
    });
})();

// 底部滚动
(function(){
    let timer = null;
    let $gotop = document.querySelector('.mod-fixedbar .gotop');
    $gotop.addEventListener('click',function(){
        cancelAnimationFrame(timer);
        let scrollTop = document.documentElement.scrollTop;
        let move = scrollTop/18;
        timer = requestAnimationFrame(function fn(){
            var oTop = document.documentElement.scrollTop;
            if(oTop > 0){
                document.documentElement.scrollTop = oTop - move;
                timer = requestAnimationFrame(fn);
            }else{
                cancelAnimationFrame(timer);
            }
        });
    });
})();
