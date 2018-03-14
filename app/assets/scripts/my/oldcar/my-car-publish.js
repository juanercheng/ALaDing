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
    require('pca');



    /**
     * 我要卖车
     */
    var d = new Date();
    $('#publish-order').on('valid.form',function(e,f){
        var data = Tools.formJson('#publish-order');
        //data.loadDetailAdd = $('select[name="loadPlacePro"] option:checked').text() + $('select[name="loadPlaceCity"] option:checked').text() + $('select[name="loadPlaceArea"] option:checked').text() + $('input[name="loadPlace"]').val();
        //data.unLoadDetailAdd = $('select[name="unloadPlacePro"] option:checked').text() + $('select[name="unloadPlaceCity"] option:checked').text() + $('select[name="unloadPlaceArea"] option:checked').text() + $('input[name="unloadPlace"]').val();
        data.guid = d.getTime();
        
        data.lookPlaceDetail=$("[name='lookProvince'] option:selected").text()+$("[name='lookCity'] option:selected").text()+$("[name='lookArea'] option:selected").text();
        data.lookPlaceDetail+=$('[name="lookPlace"]').val();

        Ajax.submit({
            url:config.IOldCarSave,
            data:data
        },function(res){
            alert(res.resultmsg || '保存失败！');
            if(res.status === '0000'){
                location.replace(location);
            }
        });

        return false;
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

    var end = {
        elem: '#end',
        format: 'YYYY-MM-DD',
        max:laydate.now(),
        istime: true,
        choose: function(datas){
            $('#end').trigger("validate");
        }
    };
    $('#end').click(function(){
        laydate(end);
    });
});
