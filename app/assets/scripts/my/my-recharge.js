/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js'),
        templ = require('template'),
        us = require('UserService');

    require('validform');
    var ordernumwechat="";

    /**
     * 获取账户信息
     */
    var User = us.getUser() || {};
    Ajax.detail({
        url:config.IAccountInfo
    },function(res){
        if(!res.data){
            $('#bank').html(templ.render('unionpay-bank-tmpl', {}));
        }
        for(var i in res.data){
            if (res.data[i].accountType === 'unionpay') {
                $('#bank').html(templ.render('unionpay-bank-tmpl', res.data[i] || {}));
                break;
            }
        }
        $('input[name="memberId"]').val(User.memberId || '');
        $('input[name="accessToken"]').val(User.accessToken || '');
        if($('input[name="replatForm"]').val()==="unionpay")
        {
            $('#bank').html(templ.render('unionpay-bank-tmpl', {}));
            for(var i in res.data){
                if (res.data[i].accountType === "unionpay") {
                    $('#bank').html(templ.render('unionpay-bank-tmpl', res.data[i] || {}));
                    break;
                }
            }
        }

        changeType(res.data);
    });

    /**
     * 模板map
     * @type {{unionpay: string, alipay: string, wechat: string}}
     */
    var tmpls = {
            unionpay: 'unionpay-bank-tmpl',
            alipay: 'alipay-bank-tmpl',
            wechat: 'wechat-bank-tmpl'
        },
        urls = {
            unionpay: '/api/webunionpayapi.aspx',
            alipay: '/api/unipay/webalipayapi.aspx'
        };

    /**
     * 支付类型切换
     */
    function changeType(data) {
        $('input[name="replatForm"]').on('click', function () {
            var _type = $(this).val();
            if (_type === "unionpay") {
                $('#bank').html(templ.render(tmpls[_type], {}));
                $('#bank_form').attr('action', urls[_type]);
            }
            else if (_type === "wechat") {
                $('#bank').html(templ.render(tmpls[_type], {}));
                $('#bank_form').attr('action', urls[_type]);
            }
            else if (_type === "alipay") {
                $('#bank').html(templ.render(tmpls[_type], {}));
                $('#bank_form').attr('action', urls[_type]);
            }
            for (var i in data) {
                if (data[i].accountType === _type) {
                    console.log(data[i]);
                    $('#bank').html(templ.render(tmpls[_type], data[i] || {}));
                    $('#bank_form').attr('action', urls[_type]);
                    break;
                }
            }
        });
    }

    /**
     * 充值
     */
    var timer,domQr = $('#qr');
    $('#submit_btn').click(function(){
        var type = $('input[name="replatForm"]:checked').val();
        if(type != 'wechat'){$('#bank_form').submit();return;}

        var bandAccountId = $('input[name="bandAccountId"]').val(),
            memberId = $('input[name="memberId"]').val(),
            accessToken = $('input[name="accessToken"]').val(),
            money = $('input[name="money"]').val();
        var reallyName=$('input[name="reallyName"]').val();
        var bank=$('input[name="bank"]').val();
        var cardNo=$('input[name="cardNo"]').val();

        $('.panel,.panel-bg').show();
        // new Image()  onload 处理图片显示过程
        domQr.html('<img src="'+config.loadMoreImg+'"/>');
        var qr = new Image();
         ordernumwechat=new Date().getTime() + memberId;

        qr.src = config.IQR+'?money='+money+'&replatForm=wechat&bandAccountId='+bandAccountId+'&reallyName='+reallyName+'&cardNo='+cardNo+'&deviceType=web&memberId='+memberId+'&accessToken='+accessToken+'&orderNum='+ordernumwechat;
        qr.onload = function(){
            domQr.empty().append($(qr));
        };
        /**
         * 打开二维码之后定时获取支付结果
         */
        timer = setInterval(getPayResult,1500);
    });

    /**
     * 取消微信支付
     */
    $('.btn-cancel').click(function(){
        $('#qr').empty();
        $('.panel,.panel-bg').hide();
        //点击取消即清除定时器
        if(timer)clearInterval(timer);
    });

    /**
     * 获取支付结果
     */
    function getPayResult(){
        Ajax.detail({
            url: config.IGetPayResult,
            data: {
                orderId: ordernumwechat,
                replatForm: "wechat"
            }
        },function(res){
            if(res&&res.status==="0000") {
                $('#qr').empty();
                $('.panel,.panel-bg').hide();
                //点击取消即清除定时器
                if (timer)clearInterval(timer);
                alert("支付成功");
            }
        })
        //console.log('Ajax 获取支付结果 --> 是否成功 ? "成功处理" : "失败处理" ');
    }

});