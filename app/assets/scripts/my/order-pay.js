/**
 * Created by haner on 15/5/22.
 */
define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        Tools = require('tools'),
        config = require('./config');

    require('common');
    require('star');
    require('validform');

    /**
     * 获取订单详情
     */
    var id = Tools.getQueryValue('id');
    if (!id) return;

    Ajax.detail({
        url: config.IGoodsDetail,
        data: {
            goodId:id
        }
    },function(res){
        if(res || res.status==='0000'){
            $('input[name="carrierId"]').val(res.data.createBy);
        }
    });


    /**
     *  付款
     */
    $('#pay-form').on('valid.form',function(e,f){
        var data = Tools.formJson('#pay-form');
        data.guid = new Date().getTime();
        data.goodId = id;

        Ajax.submit({
            url:config.IOrderPay,
            data:data
        },function(res){
            if(res.status=='0000' || res.status == '1001'){
                alert(res.resultmsg);
                if(res.status=='0000'){
                    location.href="/my/order/my-order.html"
                }
            }
        });
    });


});