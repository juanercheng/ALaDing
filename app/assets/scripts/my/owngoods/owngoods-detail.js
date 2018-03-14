/**
 * Created by haner on 15/5/22.
 */
define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config.js'),
        Tools = require('tools'),
        UserService = require('UserService');

    require('common');
    require('star');

    var id = Tools.getQueryValue('id'),cb = Tools.getQueryValue('cb');

    if (!id) return;

    Ajax.detail({
        url: config.IOwngoodsDetail,
        data: {
            goodId:id
        }
    },function(res){
        if(res&&res.data){
            with(res){
                $('.tab span:eq(0)').text('('+((parseInt(data.memberBadCount)||0) + (parseInt(data.memberGoodCount) || 0) || 0)+')');
                $('.tab span:eq(1)').text('('+(data.memberGoodCount || 0)+')');
                $('.tab span:eq(2)').text('('+(data.memberBadCount || 0)+')');
            }
        }
    });


    /**
     * 获取评论列表
     */
    config.pageRequest = function(){
        Ajax.pageRequest({
            url : config.ICommentList,
            data:{
                byAppraiseId:cb,
                appraiseType:$('.tab li.active').attr('data-type')
            }
        });
    };

    config.pageRequest();

    /**
     * 类型筛选
     */
    $('.tab li').on('click',function(e){
        e.preventDefault();
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        config.pageRequest();
    });

    /**
     * 我要报价
     */
    $('#data-detail').on('click', '.go-price', function(e) {
        e.preventDefault();
        if (!UserService.isLogin()) {
            location.href = config.PLogin + '?from=' + encodeURIComponent(location.href);
            return;
        }
        location.href = '../../goods/order-price.html?id=' + $(this).attr('data-id')+'&gt='+$(this).attr('data-gt');
    });


});