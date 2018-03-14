/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config.js');

    require('star');

    /**
     * 数据获取
     */
    config.pageRequest = function () {
        Ajax.pageRequest({
            url: config.IMyTenderList,
            data: {
                oldcarStatus: $('#state').val()
            }
        }, function (data) {
            if (!data)return;
            $('#count').text('共' + (data.totalcount || 0) + '条');

        });
    };

    config.pageRequest();


    /**
     * 查看详情
     */
    $('#data-list').on('click', '[data-id]', function () {
        location.href = 'my-tenders-detail.html?id=' + $(this).attr('data-id');
        return false;
    });

});