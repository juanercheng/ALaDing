/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js');

    $('#sug-form').submit(function(e){
        e.preventDefault();
        var f = $(this);
        if(!$.trim($('textarea[name="fbContent"]').val()).length){
         alert('内容不能为空');return;
        }
        Ajax.submit({
            url:config.IMySug,
            data:{fbContent:$('textarea[name="fbContent"]').val()}
        }, function (data) {
            if(data.status == '0000'){
                $('textarea[name="fbContent"]').val('');
                alert('提交成功！');
            }
        });
    });
});