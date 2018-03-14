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
            dictionaryCode: config.types.approvee.approveenum
        },
        renderType: Ajax.renderType.list,
        renderEle: '#state',
        renderFor: 'state-tmpl'
    });

    Ajax.custom({
        url: config.IDictionary,
        data: {
            dictionaryCode: config.types.recruitmentType.positiontypeenum
        },
        renderType: Ajax.renderType.list,
        renderEle: '#positionType',
        renderFor: 'positionType-tmpl'
    });

    /**
     * 数据获取
     */
    config.pageRequest = function () {
        Ajax.pageRequest({
            url: config.IMyrecruit,
            data: {
                recruitStatus: $('#state').val(),
                positionType: $('#positionType').val()
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
     * 筛选
     */
    $('#positionType').on('change', function () {
        config.begin = 1;
        config.pageRequest();
    });


    /**
     * 查看详情
     */
    $('#data-list').on('click', 'a[recruitId]', function () {
        location.href = 'rec-detail.html?id=' + $(this).attr('recruitId');
        return false;
    });

});