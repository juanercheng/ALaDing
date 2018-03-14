/**
 * Created by haner on 15/5/22.
 */
define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js'),
        Tools = require('tools');

    require('star');
    require('common');
    require('pca');


    /**
     * 获取货源列表
     */
    config.pageRequest = function(){
        var data = Tools.formJson('#list_search');
        if(!$('.d_order').attr('data-order')){
            data.praiseRatetype = $('.o_order').attr('data-order');
            data.doneNumType = $('.t_order').attr('data-order');
        }
        Ajax.pageRequest({
            url : config.ICarsList,
            data:data
        },function(data){
            if(data){
                $('#count').text('共'+(data.totalcount || 0) + '条');
            }
        },function(){
            $('#count').text('共0条');
        });
        /**
         * 广告位
         */
        Ajax.custom({
            url : config.ICarsAds, // 请求地址
            data:{
                adpositionType:config.types.adType.adCar,
                fromProvinceId:data.provinceFrom || '',
                fromCityId:data.cityFrom || '',
                toProvinceId:data.provinceTo || '',
                toCityId:data.cityTo || '',
                needCount:10
            },
            renderFor : 'ads-tmpl', // 渲染数据的模板
            renderEle : '#ads', // 被渲染的dom
            renderType : Ajax.renderType.list
        });
    };

    config.pageRequest();

    $('#data-list').on('click','*[data-id]',function(e){
        e.preventDefault();
        location.href = config.PCarsDetail  +'?id=' + $(this).attr('data-id') + '&cb=' + $(this).attr('data-cb');
    });
});