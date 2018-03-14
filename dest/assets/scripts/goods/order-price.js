/**
 * Created by haner on 15/5/22.
 */
define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js'),
        Tools = require('tools');

    require('common');
    require('validform');

    var id = Tools.getQueryValue('id');
    var gt = Tools.getQueryValue('gt')=="泡货"?"承运货物(立方米)：":"承运货物(吨)：";

    $('#form').on('valid.form',function(e){
        var data = Tools.formJson('#form');
        data.goodId = id;
        Ajax.submit({
            url:config.IConfrimPrice,
            data:data
        },function(res){
            if(!res||!res.status) return;
            if(res.status != '0000'){
                alert(res.resultmsg); return;
            }

            location.href = config.PMyPrice;
        });
    });
    var start = {
        elem: '#datepicker',
        format: 'YYYY-MM-DD hh:mm:ss',
        min: laydate.now(), //设定最小日期为当前日期
        istime: true,
        choose: function(datas){
            $('#datepicker').trigger("validate");
        }
    };

    $('#datepicker').click(function(){
        laydate(start);
    });
    $('#gt').text(gt);
});