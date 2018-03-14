/**
 * Created by haner on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config'),
        UserService = require('UserService'),
        Tools =  require('tools');

    require('common');
    require('validform');

    var isRem = UserService.isRememberPwd();
    $('input[name="rememberMe"]').prop('checked', false);
    if (isRem) {
        var account = UserService.getUser() || {};
        $('input[name="rememberMe"]').prop('checked', true);
        $('input[name="cellPhone"]').val(account.cellPhone || '');
        $('input[name="password"]').val(account.password || '');
    }

    /**
     * 表单提交
     */
    $('#login_form').on('valid.form', function (e, f) {
        Ajax.submit({
            url:config.ILogin,
            data:$(f)
        },function(res){
            if(res.status!='0000'){alert(res.resultmsg || '账号异常！');return;}

            if(res&&res.data){
                res.data.password = $('input[name="password"]').val();
            }

            UserService.setLL(res.data.latitude,res.data.longitude);

            //记住密码
            UserService.remPwd();
            if($('input[name="rememberMe"]').prop('checked')){
                UserService.rememberPwd();
            }
            UserService.saveOrUpdateUser(res.data || undefined);

            if(Tools.getQueryValue('from').indexOf('test')!=-1||Tools.getQueryValue('from').indexOf('payTest')!=-1||Tools.getQueryValue('from').indexOf('testResult')!=-1
               || Tools.getQueryValue('from').indexOf('testsend')!=-1|| Tools.getQueryValue('from').indexOf('payResult')!=-1){
                location.href = 'my/training/training.html';
                return
            }
            if(Tools.getQueryValue('from')){
                location.href = decodeURIComponent(Tools.getQueryValue('from'));
                return;
            }
            location.href = config.PIndex;
        });
    });

});