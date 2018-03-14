/**
 * Created by haner on 15/5/22.
 */
define(function(require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js');

    require('scrollable');
    require('common');


    /**
     * 网站首页最新货源
     * 货源,车源，物流列表
     */
    //数据请求数组
    var requestList = [{
        url: config.IHomePageGoods,
        renderFor: 'goods-tmpl', //模板
        renderEle: '#goods',
        callback: function() {
            $('#goods *[data-id]').on('click', function() {
                location.href = config.PGoodsDetail + $(this).attr('data-id') + '&cb=' + $(this).attr('data-cb');
            })
        }
    }, {
        url: config.IHomePageCars,
        renderFor: 'cars-tmpl', //模板
        renderEle: '#cars',
        callback: function() {
            $('#cars *[data-id]').on('click', function() {
                location.href = config.PCarsDetail + $(this).attr('data-id') + '&cb=' + $(this).attr('data-cb');
            })
        }
    }, {
        url: config.IHomePageExpress,
        renderFor: 'express-tmpl', //模板
        renderEle: '#express',
        callback: function() {
            $('#express *[data-id]').on('click', function() {
                location.href = config.PExpressDetail + $(this).attr('data-id');
            })
        }
    },  { // 人员招聘
        url: config.IRecruitList,
        renderFor: 'recruit-tmpl',
        renderEle: '#recruit',
        callback: function() {
            $('#recruit *[data-id]').on('click', function() {
                location.href = "recruit/recruit-detail.html?id="+ $(this).attr('data-id');
            })
        }
    },  { // 招投标
        url: config.IGetTenderList,
        renderFor: 'tenders-tmpl',
        renderEle: '#tenders',
        callback: function() {
            $('#tenders *[data-id]').on('click', function() {
                location.href = "tenders/tenders-detail.html?id="+ $(this).attr('data-id');
            })
        }
    },   { // 二手车
        url: config.IOldCarList,
        renderFor: 'usedcar-tmpl',
        renderEle: '#usedcar',
        callback: function() {
            $('#usedcar *[data-id]').on('click', function() {
                location.href = "usedcar/usedcar-detail.html?id="+ $(this).attr('data-id');
            })
        }
    }, {
        url: config.IHomeBanner,
        renderFor: 'banner-tmpl', //模板
        renderEle: '#banner', //渲染的dom
        data: {
            adpositionType: config.types.adType.banner
        },
        callback: function(res) {

            $('.banner').scrollable({
                circular: true
            }).autoscroll().navigator();
        }
    }, {
        url: config.IHomeAds,
        data: {
            adpositionType: config.types.adType.adIn,
            needCount: 8
        },
        renderFor: 'ads-tmpl', //模板
        renderEle: '#ads'
    }, {
        url: config.INoticeList,
        renderFor: 'news-tmpl', //模板
        renderEle: '#news',
        data:{
            pageSize:12
        },
        callback: function() {
            $('#news *[data-id]').on('click', function() {
                location.href = config.PNoticeDetail + $(this).attr('data-id');
            });
        }
    }];

    /**
     * 发起请求
     */
    for (var i in requestList) {
        var data = requestList[i];
        data.renderType = Ajax.renderType.list;
        Ajax.pageRequest(data, requestList[i].callback || undefined);
    }
    setInterval(function(){
        for (var i in requestList) {
            var data = requestList[i];
            data.renderType = Ajax.renderType.list;
            Ajax.pageRequest(data, requestList[i].callback || undefined);
        }
    },6000)

    var scrtime;
    $(".article.fl.cars").hover(function(){
        clearInterval(scrtime);
    },function(){
        scrtime = setInterval(function(){
            var ul = $(".article.fl.cars ul");
            var liHeight = ul.find("li:last").height();
            ul.animate({marginTop : liHeight+40 +"px"},1000,function(){
                ul.find("li:last").prependTo(ul)
                ul.find("li:first").hide();
                ul.css({marginTop:0});
                ul.find("li:first").fadeIn(1000);
            });
        },3000);
    }).trigger("mouseleave");
    var scrtime2;
    $(".article.fl.goods").hover(function(){
        clearInterval(scrtime2);
    },function(){
        scrtime2 = setInterval(function(){
            var ul = $(".article.fl.goods ul");
            var liHeight = ul.find("li:last").height();
            ul.animate({marginTop : liHeight+40 +"px"},1000,function(){
                ul.find("li:last").prependTo(ul)
                ul.find("li:first").hide();
                ul.css({marginTop:0});
                ul.find("li:first").fadeIn(1000);
            });
        },3000);
    }).trigger("mouseleave");

    var scrtime1;
    $(".article.fl.company").hover(function(){
        clearInterval(scrtime1);
    },function(){
        scrtime1 = setInterval(function(){
            var ul = $(".article.fl.company ul");
            var liHeight = ul.find("li:last").height();
            ul.animate({marginTop : liHeight+40 +"px"},1000,function(){
                ul.find("li:last").prependTo(ul)
                ul.find("li:first").hide();
                ul.css({marginTop:0});
                ul.find("li:first").fadeIn(1000);
            });
        },3000);
    }).trigger("mouseleave");

    var scrtime3,scrtime4,scrtime5;
    $(".article.fl.recruit").hover(function(){
        clearInterval(scrtime3);
    },function(){
        scrtime3 = setInterval(function(){
            var ul = $(".article.fl.recruit ul");
            var liHeight = ul.find("li:last").height();
            ul.animate({marginTop : liHeight+40 +"px"},1000,function(){
                ul.find("li:last").prependTo(ul)
                ul.find("li:first").hide();
                ul.css({marginTop:0});
                ul.find("li:first").fadeIn(1000);
            });
        },3000);
    }).trigger("mouseleave");

    $(".article.fl.tenders").hover(function(){
        clearInterval(scrtime4);
    },function(){
        scrtime4 = setInterval(function(){
            var ul = $(".article.fl.tenders ul");
            var liHeight = ul.find("li:last").height();
            ul.animate({marginTop : liHeight+40 +"px"},1000,function(){
                ul.find("li:last").prependTo(ul)
                ul.find("li:first").hide();
                ul.css({marginTop:0});
                ul.find("li:first").fadeIn(1000);
            });
        },3000);
    }).trigger("mouseleave");

    $(".article.fl.usedcar").hover(function(){
        clearInterval(scrtime5);
    },function(){
        scrtime5 = setInterval(function(){
            var ul = $(".article.fl.usedcar ul");
            var liHeight = ul.find("li:last").height();
            ul.animate({marginTop : liHeight+40 +"px"},1000,function(){
                ul.find("li:last").prependTo(ul)
                ul.find("li:first").hide();
                ul.css({marginTop:0});
                ul.find("li:first").fadeIn(1000);
            });
        },3000);
    }).trigger("mouseleave");


});