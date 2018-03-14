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
   // require('pca');

    var id = Tools.getQueryValue('id'),
        s=Tools.getQueryValue('s'),
        invoice=Tools.getQueryValue('invoice');

    invoice=JSON.parse(invoice);

    $("[name='goodId']").val(id);
    $("[name='invoiceId']").val(invoice.invoiceId);

    $("#order-detail").attr("href",$("#order-detail").attr("href")+"?id="+id+"&s="+s);
    

    $('#publish-order').find("[name]").each(function(){
        $(this).val(invoice[$(this).attr("name")]);
    });


    var quantity=$("[name='quantity']"),
        unitPrice=$("[name='unitPrice']"),
        money=$("[name='money']"),
        tax=$("[name='tax']");

    $("[name='quantity'],[name='unitPrice']").keyup(function(){
        calcMoney();
    });

    function calcMoney(){
        if(unitPrice.val() && quantity.val() && !isNaN(unitPrice.val()) && !isNaN(quantity.val()) ){
            try{
                var _v=( quantity.val() * unitPrice.val() ).toFixed(2);
               money.val(_v);
               tax.val( (_v* 0.11).toFixed(2) );
            }catch(e){
               money.val("");
               tax.val("");
            }
        }else{
           money.val("");
           tax.val("");
        }
    }

    /**
     * 
     */
    var d = new Date();
    $('#publish-order').on('valid.form',function(e,f){
        //计算一次价格
        calcMoney();
        
        var data = Tools.formJson('#publish-order');
        data.guid = d.getTime();

        Ajax.submit({
            url:config.IInvoiceUpdate,
            data:data
        },function(res){
            alert(res.resultmsg || '保存失败！');
            if(res.status === '0000'){
                location.href=$("#order-detail").attr("href");
            }
        });
    });
});
