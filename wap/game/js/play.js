/**
 * Created by wujincun on 2016/5/26.
 */
$(function () {
    countTime({
        duration:10,
        step:0.01,
        ele:$('.countTime'),
        handler4ToTime:function(){
            $('.ga').off();
            getResult();
            timeoutHint()
        }
    });
    controlVoice();
    bind();
});
//倒计时
function countTime(cfg){
    var timer;
    timer = setInterval(cutTime,cfg.step*1000);
    function cutTime(){
        if(cfg.duration <= 0){
            cfg.ele.text(0);
            clearInterval(timer);
            cfg.handler4ToTime();
        }else{
            cfg.duration = cfg.duration - cfg.step;
            cfg.ele.text((cfg.duration).toFixed(2))
        }
    }
}
//控制声音大小
function controlVoice(){
    $('.backgroundMusic')[0].volume = 0.5;
    $('.eatVoice')[0].volume = 1
}
//点击事件
function bind(){
    var n = 0;
    $('.ga').on('tap',function(){
        n=n+1;
        $('.num span').text(n);
        changeNextImg();
        $('.eatVoice').attr('src','eat.wav')
    });
    $('.close').on('tap',function(){
        var $ele = $(this).parent();
        hideMaskPage($ele);
    })
}
//eat动画
function changeNextImg(){
    var $eatImg = $('.eat');
    var $eatShowImg = $('.eat:visible');
    if($eatShowImg.next().length == 0){
        $eatImg.eq(0).show().siblings().hide();
    }else{
        $eatShowImg.next().show().siblings().hide()
    }
}
//弹层2s后消失
function timeoutHint(){
    showMaskPage($('.time-out'));
    setTimeout(function(){
        hideMaskPage($('.time-out'));
        $.when(getInfoDeferred).then(function(data){
            var code = data.code;
            if (code == 200) {
                var result = data.result;
                showMaskPage($('.success'));
                $('.info-wrap .amount .quota').text(result.coupon)
            }else if(code == 403){
                showMaskPage($('.notEnough'));
            }else if(code == 404){
                showMaskPage($('.onlyOne'));
            }else if(code == 405){
                showMaskPage($('.couponOut'));
            }
        })
    },2000)
}
//获得接口数据结果
var getInfoDeferred = $.Deferred();
function getResult(){
    var score = $('.num span').text();
    $.ajax({
        url:'./mock/coupon.json',
        type:'GET',
        data:{
            score:score
        }
    }).done(function(data){
        getInfoDeferred.resolve(data);
    })
}
//显示遮罩
function showMaskPage($ele){
    var $mask = $('.mask');
    $ele.css('display', 'block');
    $mask.css('display', 'block')
}
//隐藏遮罩
function hideMaskPage($ele){
    var $mask = $('.mask');
    $ele.css('display', 'none');
    $mask.css('display', 'none')
}