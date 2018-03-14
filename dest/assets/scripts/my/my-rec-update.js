/**
 * Created by haner on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config'),
        us = require('UserService'),
        Tools = require('tools'),

        id = Tools.getQueryValue('id');

    require('common');
    require('validform');
    var pca=require('pca');


    $(".detail").attr("href","rec-detail.html?id="+id);

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
        
        data.recruitId=id;

        Ajax.submit({
            url:config.IRecruitUpdateapi,
            data:data
        },function(res){
            alert(res.resultmsg || '保存失败！');
            if(res.status === '0000'){
                //location.replace(location);
            }
        });
        return false;
    });

    //back
    $("#btn-back").click(function(){
        window.location.href=$(".detail").attr("href");
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
        renderEle: '#price',
        callback:function(){
            $('#price').val(oldData.price);
            btnsOperate();
        }
    }, {
        url: config.IDictionary,
        data: {
            dictionaryCode: config.types.recruitmentType.positiontypeenum
        },
        renderFor: 'positionType-tmpl', 
        renderEle: '#positionType',
        callback:function(){
            $('#positionType').val(oldData.positionType);
            btnsOperate();
        }
    }, {
        url: config.IDictionary, // 请求地址
        data: {
            dictionaryCode: config.types.recruitmentType.sexenum
        },
        renderFor: 'sex-tmpl', // 渲染数据的模板
        renderEle: '#sex',
        callback:function(){
            $('#sex').val(oldData.sex);
            btnsOperate();
        }
    }, {
        url: config.IDictionary, // 请求地址
        data: {
            dictionaryCode: config.types.recruitmentType.drvLinceseenum
        },
        renderFor: 'drvLincese-tmpl', // 渲染数据的模板
        renderEle: '#drvLincese',
        callback:function(){
            $('#drvLincese').val(oldData.drvLincese);
            btnsOperate();
        }
    }];

    var oldData;
    function init(){

        Ajax.pageRequest({
            url: config.IRecruitDetail,
            data: {
                recruitId: id
            }
        }, function (data) {
            oldData=data.data;
            /**
             * 详情数据
             */
         
             
            $("[name='recruitTitle']").val(oldData.recruitTitle);
            $("[name='recruitPosition']").val(oldData.recruitPosition);
            $("[name='workPlace']").val(oldData.workPlace);
            $("[name='workRequire']").val(oldData.workRequire);

            pca.setData(oldData.workProvince,oldData.workCity,oldData.workArea,btnsOperate);

            for (var i in interface) {
                Ajax.pageRequest(interface[i],interface[i].callback);
            }
        });
    }
    init();

    var count=0;
    var btnsOperate=function(){
        if(++count>=5){
            $("#save_btn").removeClass("gray_btn");
        }
    }
});
