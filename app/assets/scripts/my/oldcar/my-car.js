/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config.js');

    require('star');

    Ajax.custom({
        url: config.IDictionary,
        data: {
            dictionaryCode: config.types.approvee.approveenum
        },
        renderType: Ajax.renderType.list,
        renderEle: '#state',
        renderFor: 'state-tmpl'
    });

    /**
     * 数据获取
     */
    config.pageRequest = function () {
        Ajax.pageRequest({
            url: config.IMyOldCar,
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
     * 筛选
     */
    $('#state').on('change', function () {
        config.begin = 1;
        config.pageRequest();
    });


    /**
     * 查看详情
     */
    $('#data-list').on('click', 'a[oldcarId]', function () {
        location.href = 'my-car-detail.html?id=' + $(this).attr('oldcarId');
        return false;
    });

});