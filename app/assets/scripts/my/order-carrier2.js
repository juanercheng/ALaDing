/**
 * Created by haner on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config'),
        Tools = require('tools');

    require('fileupload');
    require('common');
    require('validform');

    var id = Tools.getQueryValue('id');
    if (!id) {
        location.href="/my/my-price.html";
        return;
    }

    $('#carrier_form').on('valid.form', function (e) {
        e.preventDefault();
        var data = Tools.formJson('#carrier_form');
        data.goodId = id;
        Ajax.submit({
            url: config.IConfirmGoodImg,
            data: data
        },function(res){
            if(!res){return;}
            alert(res.resultmsg ||'error!');
            location.href="/my/my-price.html";
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
                    var index = data.index,file = data.files[index];
                    if (file.error) {alert(file.error);}
                },
                fail: function (e) {}
            });
        }
    },300);
});