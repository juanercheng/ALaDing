/**
 * Created by haner on 15/5/22.
 */
define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config.js'),
        Tools = require('tools');

    require('star');
    require('common');
    require('pca');


    /**
     * 获取货源列表
     */
    config.pageRequest = function(){
        var data = Tools.formJson('#list_search');

        if(!$('.d_order').attr('data-order')){
            data.praiseRatetype = $('.o_order').attr('data-order');
            data.doneNumType = $('.t_order').attr('data-order');
        }
        
        Ajax.pageRequest({
            url : config.IGetOwnDriver,
            data:data
        },function(data){
            if(data){
                $('#count1').text('共'+(data.totalcount || 0) + '条');
            }
        },function(){
            $('#count1').text('共0条');
        });
    };

    config.pageRequest();

    /**
     * 筛选
     */
    $('#list_search').on('change', function () {
        config.begin = 1;
        config.pageRequest();
    });

    $('#data-list').on('click','[data-id]',function(e){
        e.preventDefault();
        location.href = 'owncars-detail.html?id=' + $(this).attr('data-id');
        return false;
    });
});