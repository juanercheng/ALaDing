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
            url : config.IRecruitList,
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
                adpositionType:config.types.adType.recruitdp,
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

    $('#data-list').on('click','[data-id]',function(e){
        e.preventDefault();
        location.href = 'recruit-detail.html?id=' + $(this).attr('data-id');
    });

    // recruitpriceenum: 'recruitpriceenum',//工资类型
        // positiontypeenum: 'positiontypeenum',//职位分类
        // sexenum: 'sexenum',//招聘性别
        // drvLinceseenum: 'drvLinceseenum' //招聘驾照

    var interface = [{
        url: config.IDictionary, 
        data: {
            dictionaryCode: config.types.recruitmentType.recruitpriceenum
        },
        renderFor: 'seqrch-tmpl',
        renderEle: '#price' 
    }, {
        url: config.IDictionary,
        data: {
            dictionaryCode: config.types.recruitmentType.positiontypeenum
        },
        renderFor: 'seqrch-tmpl', 
        renderEle: '#positionType'
    }, {
        url: config.IDictionary, // 请求地址
        data: {
            dictionaryCode: config.types.recruitmentType.sexenum
        },
        renderFor: 'seqrch-tmpl', // 渲染数据的模板
        renderEle: '#sex' // 被渲染的dom
    }];


    /**
     * 发起请求
     */
    for (var i in interface) {
        Ajax.pageRequest(interface[i]);
    }
});