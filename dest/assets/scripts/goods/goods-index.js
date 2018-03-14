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
    require('pca');


    /**
     * 获取货源列表
     */
    config.pageRequest = function () {
        var data = Tools.formJson('#list_search');
        if(!$('.d_order').attr('data-order')){
            data.praiseRatetype = $('.o_order').attr('data-order');
            data.doneNumType = $('.t_order').attr('data-order');
        }
        Ajax.pageRequest({
            url: config.IGoodsList,
            data: data
        }, function (data) {
            console.log(data)
            if (data) {
                $('#count').text('共' + (data.totalcount || 0) + '条');
            }
        });

        /**
         * 广告位
         */
        Ajax.pageRequest({
            url: config.IGoodsAds, // 请求地址
            data: {
                adpositionType: config.types.adType.adGoods,
                fromProvinceId:data.provinceFrom || '',
                fromCityId:data.cityFrom || '',
                toProvinceId:data.provinceTo || '',
                toCityId:data.cityTo || '',
                needCount:10
            },
            renderFor: 'ads-tmpl', // 渲染数据的模板
            renderEle: '#ads' // 被渲染的dom
        });
    };

    config.pageRequest();

    $('#data-list').on('click', '*[data-id]', function (e) {
        e.preventDefault();
        location.href = config.PGoodsDetail + '?id=' + $(this).attr('data-id') + '&cb=' + $(this).attr('data-cb');
    });


    var interface = [{
        url: config.IDictionary, // 请求地址
        data: {
            dictionaryCode: config.types.dicType.businesstypeenum
        },
        renderFor: 'businesstype-tmpl', // 渲染数据的模板
        renderEle: '#businesstype' // 被渲染的dom
    }, {
        url: config.IDictionary, // 请求地址
        data: {
            dictionaryCode: config.types.dicType.goodkindenum
        },
        renderFor: 'goodkind-tmpl', // 渲染数据的模板
        renderEle: '#goodkind' // 被渲染的dom
    }];


    /**
     * 发起请求
     */
    for (var i in interface) {
        Ajax.pageRequest(interface[i]);
    }


});