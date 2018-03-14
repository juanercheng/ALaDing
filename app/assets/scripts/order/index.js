/**
 * Created by haner on 15/5/22.
 */
define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js');
    require('star');
    require('common');
    require('pca');

    /**
     * 发起请求
     */
    Ajax.custom({
        url : config.IOrderAds, // 请求地址
        data:{
            adpositionType:config.types.adType.adOr
        },
        renderFor : 'ads-tmpl', // 渲染数据的模板
        renderEle : '#ads', // 被渲染的dom
        renderType : Ajax.renderType.list
    });

    /**
     * 获取货源列表
     */
    config.pageRequest = function(){
        var data = {};
        if(!$('.d_order').attr('data-order')){
            data.praiseRatetype = $('.o_order').attr('data-order');
            data.doneNumType = $('.t_order').attr('data-order');
        }
        Ajax.pageRequest({
            url : config.IOrderList,
            data:data
        },function(data){
            console.log(data);
            if(data){
                $('#count').text('共'+(data.totalcount || 0) + '条');
            }
        },function(){
            $('#count').text('共0条');
        });
    };

    config.pageRequest();

    $('#data-list').on('click','*[data-id]',function(e){
        e.preventDefault();
        location.href = config.POrderDetail  +'?id=' + $(this).attr('data-id') + '&cb=' + $(this).attr('data-cb');
    });

});