/**
 * Created by haner on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config'),
        us = require('UserService'),
        Tools = require('tools');

    require('fileupload');
    require('common');
    require('validform');
   // require('pca');

    var data = Tools.getQueryValue('data');
    var data2 = Tools.getQueryValue('data');

    data=JSON.parse(data);
    data2=JSON.parse(data2);
    data2.drvReallyName=encodeURI(data2.drvReallyName);

    $("[name='goodId']").val(data.id);

    $("#order-detail").attr("href",$("#order-detail").attr("href")+"?id="+data.id+"&s="+data.s);
    $("#order-insurance").attr("href",$("#order-insurance").attr("href")+"?data="+JSON.stringify(data2));

    function utext(){/* 如需更详细内容，请咨询客服，电话：400668-7227
            */}
    $("#userprotocol").html(utext.toString().replace(/.*?\/\*/,"").replace(/\*\/\}/,""));

    /**
     * 
     */
    var d = new Date();
    $('#publish-order').on('valid.form',function(e,f){
        var data = Tools.formJson('#publish-order');
        data.guid = d.getTime();

        Ajax.submit({
            url:config.IDrvInsuranceSave,
            data:data
        },function(res){
            alert(res.resultmsg || '保存失败！');
            if(res.status === '0000'){
                location.replace(location);
            }
        });
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
});
