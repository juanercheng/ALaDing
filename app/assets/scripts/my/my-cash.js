/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js'),
        Tools = require('tools'),
        templ = require('template');

    //require('validform');
    /**
     * 获取账户信息
     */
    Ajax.detail({
        url:config.IAccountInfo
    },function(res){
        if(!res || res.status!== '0000' || !res.data || !res.data.length){
            alert('首次使用需绑定账户信息，请先充值！');
            location.href = '/my/my-recharge.html';
            return;
        }

        for(var i in res.data) {
            if (res.data[i].accountType === 'unionpay') {
                $('input:radio').eq(0).attr('checked', 'ture');
                $('#bank').html(templ.render('bank-tmpl', res.data[i]));
                break;
            }
            else if (res.data[i].accountType === 'alipay') {
                $('input:radio').eq(0).attr('disabled', 'ture');
                $('input:radio').eq(1).attr('checked', 'ture');
                //判断是否有微信账号
                $('#bank').html(templ.render('alipay-bank-tmpl', res.data[i]));
                break;
            }
            else if (res.data[i].accountType === 'wechat') {
                $('input:radio').eq(2).attr('checked', 'ture');
                $('#bank').html(templ.render('wechat-bank-tmpl', res.data[i]));
                break;
            }
        }
        //判断不存在的平台账号灰化不能使用
        var pingtai="";
        for(var i = 0;i<res.data.length;i++) {
            pingtai+=res.data[i].accountType;
        }
        if(pingtai.indexOf("unionpay")<0)
        {
            $('input:radio').eq(0).disabled=true;
            $('input:radio').eq(0).readOnly=true;
            $('input:radio').eq(0).attr('disabled', 'disabled');
        }
        if(pingtai.indexOf("alipay")<0)
        {
            $('input:radio').eq(1).disabled=true;
            $('input:radio').eq(1).readOnly=true;
            $('input:radio').eq(1).attr('disabled', 'disabled');
        }
        if(pingtai.indexOf("wechat")<0)
        {
            $('input:radio').eq(2).disabled=true;
            $('input:radio').eq(2).readOnly=true;
            $('input:radio').eq(2).attr('disabled', 'disabled');
        }

        changeType(res.data);
    });

    /**
     * 支付类型切换
     */
    function changeType(data) {
        $('input[name="cashtype"]').on('click', function () {
            var _type = $(this).val();
            for (var i in data) {
                if (data[i].accountType === 'unionpay' && _type === 'unionpay') {
                    $('#bank').html(templ.render('bank-tmpl',data[i]));
                    break;
                }
                else if (data[i].accountType === 'alipay' && _type === 'alipay') {
                    $('#bank').html(templ.render('alipay-bank-tmpl', data[i]));
                    break;
                }
                else if (data[i].accountType === 'wechat' && _type === 'wechat') {
                    $('#bank').html(templ.render('wechat-bank-tmpl', data[i]));
                    break;
                }
            }
        });
    }

    /**
     * 提现申请
     */
    $('#recharge_form').submit(function(e){
        e.preventDefault();
        var v = $('input[name="money"]').val().trim();
        if(!/^[1-9]+[0-9]*$/.test(v)){
            alert('请输入有效的金额！');return;
        }
        Ajax.submit({
            url:config.ICashMoney,
            data:Tools.formJson('#recharge_form')
        },function(res){
            alert(res.resultmsg || '提现失败！');
        });
    });
});