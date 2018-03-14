/**
 * Created by haner on 15/6/10.
 */
define(function (require) {
    var $ = require('jquery'),
        config = require('config');

    require('common');

    var hrefArr = [config.PCompanyInfo, config.PContact, config.PHelp,config.PNoticeList],
        headerArr = ['/company','/contact','/help','/notice'];
    $('.my_nav .nav li').each(function (i, o) {
        if (location.href.indexOf(headerArr[i]) != -1) {
            $('.my_nav .nav li:eq('+i+') a').addClass('active');
        }
        $(this).bind('click', function () {
            location.href = hrefArr[i];
        })
    });


});
