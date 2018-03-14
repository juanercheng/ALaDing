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
            dictionaryCode: config.types.loan.loanstatusenum
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
            url: config.ILoanList,
            data: {
                loanStatus: $('#state').val()
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
    $('#data-list').on('click', '[data-id]', function () {
        location.href = 'my-loan-detail.html?id=' + $(this).attr('data-id');
        return false;
    });

});