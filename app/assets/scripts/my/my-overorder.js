/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js');

    require('star');

    /**
     * 消费记录
     */
    config.pageRequest = function () {
        Ajax.pageRequest({
            url: config.IMyOverOrder
        },function(data){
            if(data&& data.status=='0000'){
                $('#count').text('共'+ data.totalcount +'条');
            }
            else if(data&&data.status=='1006'){
                $('#count').text('共0条');
            }
        });
    };
    config.pageRequest();

    /**
     * 刷新日期
     */
    $('#data-list').on('click','button[data-id]',function(e){
        e.preventDefault();
        Ajax.submit({
            url:config.IRefreshDate,
            data:{
                goodId:$(this).attr('data-id')
            }
        },config.pageRequest);
    });

});