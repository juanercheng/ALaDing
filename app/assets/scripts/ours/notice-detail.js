/**
 * Created by haner on 15/6/2.
 */
define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config'),
        Tools = require('tools');


    var id = Tools.getQueryValue('id');
    if(!id){return;}

    Ajax.detail({url:config.INoticeDetail,data:{id:id}});

});