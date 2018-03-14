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
            url : config.IGetTenderList,
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
            url : config.ITenderAds, // 请求地址
            data:{
                adpositionType:config.types.adType.tenderdp,
                fromProvinceId:data.provinceFrom || '',
                fromCityId:data.cityFrom || '',
                toProvinceId:data.provinceTo || '',
                toCityId:data.cityTo || '',
                needCount:5
            },
            renderFor : 'ads-tmpl', // 渲染数据的模板
            renderEle : '#ads', // 被渲染的dom
            renderType : Ajax.renderType.list
        });
    };

    config.pageRequest();

    $('#data-list').on('click','[data-id]',function(e){
        e.preventDefault();
        location.href = 'tenders-detail.html?id=' + $(this).attr('data-id');
    });

    var interface = [{
        url: config.IDictionary, 
        data: {
            dictionaryCode: config.types.dicType.tenderbidenum
        },
        renderFor: 'seqrch-tmpl',
        renderEle: '#tenderStatus' 
    }];


    /**
     * 发起请求
     */
    for (var i in interface) {
        Ajax.pageRequest(interface[i]);
    }

    var begin = {
        elem: '#begin',
        format: 'YYYY-MM-DD hh:mm:ss',
        min: laydate.now(),
        istime: true,
        choose: function(datas){
        }
    };
    $('#begin').click(function(){
        laydate(begin);
    });
    var end = {
        elem: '#end',
        format: 'YYYY-MM-DD hh:mm:ss',
        min: laydate.now(),
        istime: true,
        choose: function(datas){
        }
    };
    $('#end').click(function(){
        laydate(end);
    });
});