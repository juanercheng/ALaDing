/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        Tools = require('tools'),
        config = require('./config.js');

    require('common');
    require('star');
    require('fileupload');

    /**
     * 获取订单详情
     */
    var id = Tools.getQueryValue('id');if (!id) return;

    Ajax.detail({
        url: config.IGoodsDetail,
        data: {
            goodId:id
        }
    });

    /**
     * 获取消息列表
     */
    config.pageRequest = function(){
        Ajax.pageRequest({
            url : config.IOrderMSg,
            data:{
                goodId:id
            }
        },previewImg);
    };

    config.pageRequest();


    /**
     * 图片预览
     */
    function previewImg(){
        var xOffset = 15,yOffset = 30;
        $('a[data-preview]').find("img").hover(function(e) {
            $("<img id='imgshow' src='" + this.src + "' width='400px' height='400px' />").appendTo("body");
            $("#imgshow")
                .css('position','absolute')
                .css("top", (e.pageY - xOffset) + "px")
                .css("left", (e.pageX + yOffset) + "px")
                .fadeIn("fast");
        }, function() {
            $("#imgshow").remove();
        });

        $('a[data-preview]').find("img").mousemove(function(e) {
            $("#imgshow")
                .css("top", (e.pageY - xOffset) + "px")
                .css("left", (e.pageX + yOffset) + "px")
        });
    }


    /**
     * 文件上传
     */
    var flag=setInterval(function(){
        if($.fn.fileupload){
            clearInterval(flag);

            /**
             * 文件上传
             */
            $('input[type="file"]').fileupload({
                url: config.imageServer,
                dataType: "JSON",
                acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
                maxFileSize: 5000000,
                done: function (e, data) {
                    $(this).prev().attr('src',data.result.data.picUrl);
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
     * 消息表单
     */

    $('#msg-form').submit(function(e){
        e.preventDefault();
        if(!$('textarea[name="messageContent"]').val().trim()){
            alert('请输入内容！');
            return;
        }

        var subBtn = $(this).find('input[type="submit"]');
        subBtn.attr('disabled', true);
        var data = Tools.formJson('#msg-form');
        data.goodId = id;

        Ajax.submit({
            url:config.IAddOrderMSg,
            data:data
        },function(res){
            if(res.status === '0000'){
                $('textarea[name="messageContent"]').val('');
                $('.file_upload').find('img').removeAttr('src');
                $('.file_upload').find('input').val('');

                alert('新增消息成功！');
                config.pageRequest();
            }
            subBtn.attr('disabled', false);
        },function(){
            subBtn.attr('disabled', false);
        });

    });


});