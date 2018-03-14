/**
 * Created by haner on 15/6/2.
 */
define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config');

    config.pageRequest = function () {
        Ajax.pageRequest({
            url:config.INoticeList
        });
    };

    config.pageRequest();

    $('#data-list').on('click','li a',function(e){
        e.preventDefault();
        location.href=config.PNoticeDetail + $(this).attr('data-id');
    });

});