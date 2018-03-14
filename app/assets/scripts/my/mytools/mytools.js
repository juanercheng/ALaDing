/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config.js');

    require('star');

    var toolshref=[
        'http://www.edaijia.cn',
        'http://www.weizhang8.cn',
        'http://www.kuaidi100.com',
        'http://www.shipxy.com',
        'http://www.qixin.com'
    ];

    $(".tools-list").on("click","li",function(){
        $("#openTools").attr("action",toolshref[$(this).index()]).submit();
    });

});