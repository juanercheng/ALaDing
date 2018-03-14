/**
 * Created by haner on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config'),
        us = require('UserService'),
        Tools = require('tools');

    //require('fileupload');
    require('common');
    require('validform');
    //require('pca');

    var data=Tools.getQueryValue('data');

    data=JSON.parse(data);

    $("[name='invoiceId']").val(data.invoiceId);
    

    $('#publish-order').find("[name]").each(function(){
        $(this).val(data[$(this).attr("name")]).attr("readonly","readonly");
    });

    /**
     * 
     */
    var d = new Date();
    $('.save_btn').on('click',function(e,f){
        if(confirm("是否确认发票信息?")){
            var submitdata = {
                invoiceId:data.invoiceId,
                goodId:data.goodId,
                invoiceStatus:config.types.invoiceStatus.completed,
                remark:""
            };
            submitdata.guid = d.getTime();

            Ajax.submit({
                url:config.IInvoiceDrvconFirm,
                data:submitdata
            },function(res){
                alert(res.resultmsg || '保存失败！');
                if(res.status === '0000'){
                    location.href="/my/my-price.html";
                }
            });
        }
    });

    $(".cannel").on('click',function(){
        $(".dialogbg").hide();
        $(".dialog").hide();
    });

    $(".fail_btn").on('click',function(){
        $(".dialogbg").show();
        $(".dialog").show();
    });

    $(".dfail_btn").on('click',function(){
        var remark=$("#remark").val();

        if(!remark.replace(/\s/g,"")){
            alert("请填写拒绝原因");
            return;
        }

        var submitdata = {
            invoiceId:data.invoiceId,
            goodId:data.goodId,
            invoiceStatus:config.types.invoiceStatus.failed,
            remark:remark
        };
        submitdata.guid = d.getTime();

        Ajax.submit({
            url:config.IInvoiceDrvconFirm,
            data:submitdata
        },function(res){
            alert(res.resultmsg || '保存失败！');
            if(res.status === '0000'){
                location.href="/my/my-price.html";
            }
        });
    });


});
