/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js'),
        Tools = require('tools');

    require('validform');

    /**
     * 卡号绑定
     */

    $('#band_car').on('valid.form',function(e){
        Ajax.submit({
            url:config.ICashMoney,
            data:Tools.formJson('#recharge_form')
        },function(res){
            alert(res.resultmsg || '提现失败！');
        });
    });

});