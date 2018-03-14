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
        
        Ajax.pageRequest({
            url : config.IOldCarList,
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
                adpositionType:config.types.adType.oldcardp,
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

    $('#data-list').on('click','a',function(e){
        e.preventDefault();
        location.href = 'usedcar-detail.html?id=' + $(this).parents("li").attr('data-id');
    });
});