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

    /**
     * 获取订单详情
     */

    var data = Tools.getQueryValue('data');
    var data2 = Tools.getQueryValue('data');
    var drvCellPhone = Tools.getQueryValue('drvCellPhone');

    data=JSON.parse(data);
    data2=JSON.parse(data2);


    $("#order-detail").attr("href",$("#order-detail").attr("href")+"?id="+data.id+"&s="+data.s);
    $("#order-insurance").attr("href",$("#order-insurance").attr("href")+"?data="+JSON.stringify(data2));
    
    if (!data) return;

    Ajax.detail({
        url: config.IGoodsDetail,
        data: {
            goodId:data.id
        }
    });

    /**
     * 物流信息
     */
    Ajax.submit({
        url: config.IOrderExpress,
        data: {
            goodId:data.id,
            drvCellPhone:drvCellPhone
        }
    },function(res){
        var msg="提示：";
        if(res && res.status == '0000'){
            msg += (res.data[0].address || '');
        }
        if(res.status === '1001'){
            msg += res.resultmsg;
        }
        $('#info').text(msg);
    });


});