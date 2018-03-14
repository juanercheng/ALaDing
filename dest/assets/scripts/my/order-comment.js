/**
 * Created by haner on 15/5/22.
 */
define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        Tools = require('tools'),
        config = require('./config'),
        us = require('UserService');

    require('star');

    /**
     * 获取订单详情
     */
    var id = Tools.getQueryValue('id');
    if (!id) return;
    var isMyOrder = (document.referrer.lastIndexOf('order-detail.html') > 0);

    Ajax.detail({
        url: config.IGoodsDetail,
        data: {
            goodId:id
        }
    },function(res){
        if(res.status === '0000'){
            $('input[name="byAppraiseId"]').val( isMyOrder ? (res.data.carrierId || '') : (res.data.createBy || ''));
        }
    });

    /**
     * 获取tag
     */
    Ajax.pageRequest({
        url:config.ICommentTags,
        data:{
            appraiseType: !isMyOrder ? 'sendgoods' :'driver'
        }
    });

    /**
     * 选择tag
     */

    $('#data-list').on('click','span',function(){
        !$(this).hasClass('active') ? $(this).addClass('active') : $(this).removeClass('active');
    });

    /**
     * 评论表单提交
     */

    $('#comment-form').submit(function(e){
        e.preventDefault();
        if(!$('textarea[name="appraiseContent"]').val().trim()){
            alert('请输入评论内容！');
            return;
        }

        var subBtn = $(this).find('input[type="submit"]');
            subBtn.attr('disabled', true);
        var data = Tools.formJson('#comment-form');
        data.goodId = id;

        var tagIds = [];

        $('#data-list span.active').each(function(){
            tagIds.push($(this).attr('data-id'));
        });

        data.appraiseTag = tagIds.join(',');
        data.isAnon = $('input[name="isNoName"]').prop('checked') || false;

        Ajax.submit({
            url:config.IComment,
            data:data
        },function(res){
            if(res.status === '1001'){
                alert(res.resultmsg || '不能重复评价！');
                history.go(-1);
                return;
            }
            if(res.status === '0000'){
                $('textarea[name="appraiseContent"]').val('');
                alert('评价成功！');
                history.go(-1);
            }
            subBtn.attr('disabled', false);
        },function(){
            subBtn.attr('disabled', false);
        });

    });


});