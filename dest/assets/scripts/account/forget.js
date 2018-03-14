/**
 * Created by haner on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config');

    require('common');
    require('validform');


    /**
     * 表单提交
     */
    $('#reg_form').on('valid.form', function (e, f) {

        if($('input[name="yzm"]').val() !== $('#sendMsg').attr('data-code')){
            alert('验证码错误');return;
        }


        Ajax.submit({
            url:config.IForget,
            data:$(f)
        },function(res){
            if(!res||!res.resultmsg||!res.status){
                return;
            }
            if(res.status!='0000'){
                alert(res.resultmsg);
                return;
            }
            location.href = config.PLogin;
        });
    });
    var phone = $('input[name="cellPhone"]');

    //短信发送
    $('#sendMsg').click(function (e) {
        e.preventDefault();

        var _this = $(this);
        if (_this.hasClass('disable')) {
            return;
        }
        phone.isValid(function (v) {
            if (!v) {
                return;
            }

            _this.addClass('disable');
            Ajax.custom({
                url: config.ISendMsg,
                data: {cellPhone: phone.val(),isRegister:false,smsType:'verificationcode'},
                type: 'POST'
            }, function (data) {
                if (data.status != '0000') {
                    _this.removeClass('disable');
                    alert(data.resultmsg);
                    return;
                }
                _this.attr('data-code',data.data.verificationCode || '');
                changeBtnState(_this);
            }, function (jqxhr, textStatus, errorThrown) {
                _this.removeClass('disable');
            });
        });

    });

    //短信计时
    function changeBtnState(obj) {
        var second = 60;
        var text = obj.text();
        obj.prop('disabled', true);
        var timer = setInterval(function () {
            obj.text(text + '(' + (second--) + ')');
            if (second < 0) {
                obj.prop('disabled', false);
                obj.text(text);
                obj.removeClass('disable');
                clearInterval(timer);
            }
        }, 1000);
    }


});