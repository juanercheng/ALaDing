/**
 * Created by chengjuan on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config'),
        configs = require('config'),
        Tools = require('tools'),
        platformqualificationsId='',
        UserService = require('/assets/scripts/base/user-service.js'),
        handIdCardImg='',
        signatureImg='';

    require('common');
    require('pca');
    require('fileupload');
    require('layui');
    layui.config({
        dir: '../../assets/scripts/module/layui/'
    });

    platformqualificationsId = Tools.getQueryValue('platformqualificationsId');

    Ajax.detail({
        url: config.TrainingFinishedConfirm, // 请求地址
        data: {
            platformqualificationsId:platformqualificationsId,
        }
    },function(res) {
        if(res.status==='0000'){
            $('.failed').hide();
            $('.success').show();
        }else if(res.status==='1002'){
            $('.failed').show();
            $('.success').hide();
        }
        var resultmsg=res.resultmsg
        $('.result p').html(resultmsg)
    });

    var flag=setInterval(function(){
        if($.fn.fileupload){
            clearInterval(flag);
            imgUploade($('#handIDImg'),7);
            imgUploade($('#singeImg'),8)
        }
    },300);
    function imgUploade(imgId,Type) {
        imgId.fileupload({
            url: config.TrainingUploadImg,
            dataType: "JSON",
            formData:{
                memberId: UserService.getUserId(),
                accessToken: UserService.getAccessToken(),
                // imgFile:'ceshi',
                imgFileType:Type,
            },
            done: function (e, data) {
                $(this).prev().attr('src',configs.baseUrl+'/'+data.result.data);
                console.log(data.result)
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

    //确认提交
    $('.orange_btn').on('click',function(e){
        e.preventDefault();
        handIdCardImg=$('.handIDImg img').attr('src')
        signatureImg=$('.singeImg img').attr('src')
        handIdCardImg=handIdCardImg.substr(handIdCardImg.indexOf('aladingImg'));
        signatureImg=signatureImg.substr(signatureImg.indexOf('aladingImg') );
        layui.use(['layer'], function () {
            var layer = layui.layer;
            if(!handIdCardImg){
                layer.alert('请上传手持身份证照片！');
                return
            }
            if(!signatureImg){
                layer.alert('请上传签名照片！');
                return
            }
            Ajax.submit({
                url:config.TrainingConfirm,
                data:{
                    handIdCardImg:handIdCardImg,
                    signatureImg:signatureImg,
                    platformqualificationsId:platformqualificationsId
                }
            },function(res){
                if(res.status==='0000'){
                    location.href = 'testsend.html';
                }
            });
        });
    });
});
