/**
 * Created by haner on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config'),
        us = require('UserService'),
        Tools = require('tools');

    require('fileupload');
    require('common');
    require('validform');
    require('pca');



    /**
     * 文件上传
     */
    var flag=setInterval(function(){
        if($.fn.fileupload){
            clearInterval(flag);
            $('input[type="file"]').fileupload({
                url: config.imageServer,
                dataType: "JSON",
                acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
                maxFileSize: 5000000,
                done: function (e, data) {
                    $(this).prev().attr('src', data.result.data.picUrl);
                    $(this).next().val(data.result.data.picUrl);
                },
                process: function (e, data) {
                    for (var i = 0, l = data.processQueue.length; i < l; i++) {
                        if (data.processQueue[i].action == 'validate') {
                            data.messages.acceptFileTypes = '上传文件格式不支持.';
                        }
                    }
                    data.messages.maxFileSize = '上传文件太大，限制' + data.maxFileSize / 1000 + 'K以内.';
                },
                processalways: function (e, data) {
                    var index = data.index,
                        file = data.files[index];
                    if (file.error) {
                        alert(file.error);
                    }
                },
                fail: function (e) {
                }
            });
        }
    },300);



    /**
     * 发布订单
     */
    var d = new Date();
    $('#publish-order').on('valid.form',function(e,f){
        var data = Tools.formJson('#publish-order');
        data.loadDetailAdd = $('select[name="loadPlacePro"] option:checked').text() + $('select[name="loadPlaceCity"] option:checked').text() + $('select[name="loadPlaceArea"] option:checked').text() + $('input[name="loadPlace"]').val();
        data.unLoadDetailAdd = $('select[name="unloadPlacePro"] option:checked').text() + $('select[name="unloadPlaceCity"] option:checked').text() + $('select[name="unloadPlaceArea"] option:checked').text() + $('input[name="unloadPlace"]').val();
        data.guid = d.getTime();

        if(!$("#IsInsurance").prop("checked")){
            data.insuranceType=0;
        }

        Ajax.submit({
            url:config.IPublishOrder,
            data:data
        },function(res){
            alert(res.resultmsg || '保存失败！');
            if(res.status === '0000'){
                location.replace(location);
            }
        });
    });

    $("#IsInsurance").click(function(){
        if(this.checked){
            $("#insurancetypeenum").show();
        }else{
            $("#insurancetypeenum").hide();
        }
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
    }, {
        url: config.IDictionary, // 请求地址
        data: {
            dictionaryCode: config.types.dicType.goodtypeenum
        },
        renderFor: 'goodtype-tmpl', // 渲染数据的模板
        renderEle: '#goodtype' // 被渲染的dom
    }, {
        url: config.IDictionary, // 请求地址
        data: {
            dictionaryCode: config.types.dicType.vehicletypeenum
        },
        renderFor: 'goodtype-tmpl', // 渲染数据的模板
        renderEle: '#vehicletypeenum' // 被渲染的dom
    }, {
        url: config.IDictionary, // 请求地址
        data: {
            dictionaryCode: config.types.dicType.insurancetypeenum
        },
        renderFor: 'insurancetypeenum-tmpl', // 渲染数据的模板
        renderEle: '#insurancetypeenum' // 被渲染的dom
    }];


    /**
     * 发起请求
     */
    for (var i in interface) {
        Ajax.pageRequest(interface[i]);
    }

    var start = {
        elem: '#start',
        format: 'YYYY-MM-DD hh:mm:ss',
        min: laydate.now(), //设定最小日期为当前日期
        istime: true,
        choose: function(datas){
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas; //将结束日的初始值设定为开始日
            $('#start').trigger("validate");
        }
    };
    var end = {
        elem: '#end',
        format: 'YYYY-MM-DD hh:mm:ss',
        min: laydate.now(),
        istime: true,
        choose: function(datas){
            start.max = datas; //结束日选好后，重置开始日的最大日期
            $('#end').trigger("validate");
        }
    };
    $('#start').click(function(){
        laydate(start);
    });
    $('#end').click(function(){
        laydate(end);
    });
});
