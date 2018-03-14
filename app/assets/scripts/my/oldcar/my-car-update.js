/**
 * Created by haner on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config'),
        us = require('UserService'),
        Tools = require('tools'),

        id = Tools.getQueryValue('id');

    require('fileupload');
    require('common');
    require('validform');
    var pca=require('pca');


    $(".detail").attr("href","my-car-detail.html?id="+id);

    /**
     * 我要招聘
     */
    var d = new Date();
    $('#publish-order').on('valid.form',function(e,f){
        var data = Tools.formJson('#publish-order');
        
        data.lookPlaceDetail=$("[name='lookProvince'] option:selected").text()+$("[name='lookCity'] option:selected").text()+$("[name='lookArea'] option:selected").text();
        data.lookPlaceDetail+=$('[name="lookPlace"]').val();
       
        data.guid = d.getTime();
        data.oldcarId=id;

        Ajax.submit({
            url:config.IOldCarUpdate,
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

    var oldData;
    function init(){

        Ajax.pageRequest({
            url: config.IOldCarDetail,
            data: {
                oldcarId: id
            }
        }, function (data) {
            oldData=data.data;
            /**
             * 详情数据
             */
             
            $("[name='oldcarTitle']").val(oldData.oldcarTitle);
            $("[name='carBrand']").val(oldData.carBrand);
            $("[name='displacement']").val(oldData.displacement);
            $("[name='price']").val(oldData.price);
            $("[name='buyTime']").val(oldData.buyTime.substring(0,10));
            $("[name='travelMileage']").val(oldData.travelMileage);
            $("[name='lookPlace']").val(oldData.lookPlace);
            $("[name='configuration']").val(oldData.configuration);
            $("[name='remark']").val(oldData.remark);

            $("[name='drvLicenseImg']").val(oldData.drvLicenseImg);
            if(!/\/$/.test(oldData.drvLicenseImg)){
                $("[name='drvLicenseImg']").prev().prev().attr("src",oldData.drvLicenseImg);    
            }

            $("[name='carImg']").val(oldData.carImg).prev().prev().attr("src",oldData.carImg);

            pca.setData(oldData.lookProvince,oldData.lookCity,oldData.lookArea,btnsOperate);
        });
    }
    init();

    var count=0;
    var btnsOperate=function(){
        if(++count>=1){
            $("#save_btn").removeClass("gray_btn");
        }
    }

    var end = {
        elem: '#end',
        format: 'YYYY-MM-DD',
        istime: true,
        max:laydate.now(),
        choose: function(datas){
            $('#end').trigger("validate");
        }
    };
    $('#end').click(function(){
        laydate(end);
    });
});
