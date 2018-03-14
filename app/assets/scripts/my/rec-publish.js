/**
 * Created by haner on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config'),
        us = require('UserService'),
        Tools = require('tools');

    require('common');
    require('validform');
    require('pca');



    /**
     * 我要招聘
     */
    var d = new Date();
    $('#publish-order').on('valid.form',function(e,f){
        var data = Tools.formJson('#publish-order');
        //data.loadDetailAdd = $('select[name="loadPlacePro"] option:checked').text() + $('select[name="loadPlaceCity"] option:checked').text() + $('select[name="loadPlaceArea"] option:checked').text() + $('input[name="loadPlace"]').val();
        //data.unLoadDetailAdd = $('select[name="unloadPlacePro"] option:checked').text() + $('select[name="unloadPlaceCity"] option:checked').text() + $('select[name="unloadPlaceArea"] option:checked').text() + $('input[name="unloadPlace"]').val();
        data.guid = d.getTime();
        data.workPlaceDetail=$("[name='workProvince'] option:selected").text()+$("[name='workCity'] option:selected").text()+$("[name='workArea'] option:selected").text();
        data.workPlaceDetail+=$('[name="workPlace"]').val();

        Ajax.submit({
            url:config.IRecruitSave,
            data:data
        },function(res){
            alert(res.resultmsg || '保存失败！');
            if(res.status === '0000'){
                location.replace(location);
            }
        });
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
        renderFor: 'price-tmpl',
        renderEle: '#price' 
    }, {
        url: config.IDictionary,
        data: {
            dictionaryCode: config.types.recruitmentType.positiontypeenum
        },
        renderFor: 'positionType-tmpl', 
        renderEle: '#positionType'
    }, {
        url: config.IDictionary, // 请求地址
        data: {
            dictionaryCode: config.types.recruitmentType.sexenum
        },
        renderFor: 'sex-tmpl', // 渲染数据的模板
        renderEle: '#sex' // 被渲染的dom
    }, {
        url: config.IDictionary, // 请求地址
        data: {
            dictionaryCode: config.types.recruitmentType.drvLinceseenum
        },
        renderFor: 'drvLincese-tmpl', // 渲染数据的模板
        renderEle: '#drvLincese' // 被渲染的dom
    }];


    /**
     * 发起请求
     */
    for (var i in interface) {
        Ajax.pageRequest(interface[i]);
    }
});
