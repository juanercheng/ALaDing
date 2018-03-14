/**
 * Created by haner on 15/5/22.
 */
define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js'),
        Tools = require('tools');

    require('common');
    require('star');

    var id = Tools.getQueryValue('id');

    if (!id) return;

    Ajax.detail({
        url: config.IExpressDetail,
        data: {
            cmpMemberId:id
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
                byAppraiseId:id,
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




});