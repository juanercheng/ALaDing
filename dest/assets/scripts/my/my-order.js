/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js');

    require('star');

    Ajax.custom({
        url: config.IDictionary,
        data: {
            dictionaryCode: config.types.dicType.orderstateenum
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
            url: config.IMyOrder,
            data: {
                orderState: $('#state').val()
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
    $('#data-list').on('click', 'p[data-id]', function () {
        location.href = config.POrderDetail + '?id=' + $(this).attr('data-id') + '&s=' + $(this).attr('data-state');
    });

});