/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js');

    /**
     * 消费记录
     */
    config.pageRequest = function () {
        Ajax.pageRequest({
            url: config.IMyRecordList
        });
    };
    config.pageRequest();
    /**
     * 账户信息
     */
    Ajax.detail({
        url: config.IWantPrice,
        data: {
        }
    },function(res){
        if(res&&res.data){
            with(res){
                $('.local_nav span:eq(2)').text('【您目前的可用余额: '+(data.balance || 0)+'元  ， ');
                $('.local_nav span:eq(3)').text('赠送金额: '+(data.attribute1 || 0)+'元  ， ');
                $('.local_nav span:eq(4)').text('冻结金额: '+(data.freeze || 0)+'元】 ');
            }
        }
    });



});