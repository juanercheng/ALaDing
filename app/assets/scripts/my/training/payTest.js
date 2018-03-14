/**
 * Created by chengjuan on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config'),
        Tools = require('tools'),
        account=0,
        platformId=1;

    require('common');
    require('pca');
    require('layui')
    layui.config({
        dir: '../../assets/scripts/module/layui/'
    });

    account = Tools.getQueryValue('account');
    platformId=Tools.getQueryValue('platformId');

    $('.money').html(account);

    /**
     * 账户信息
     */
    Ajax.detail({
        url: config.IWantPrice,
        data: {
        }
    },function(res){
        if(res&&res.data){
            with(res){
                $('.balance').text('您目前的可用余额: '+(data.balance || 0)+'元');
                if(data.balance<=0){
                    $('.inputMsg').show()
                    $('.pink_btn').hide()
                    $('.orange_btn').show()
                }else {
                    $('.inputMsg').hide()
                    $('.pink_btn').show()
                    $('.orange_btn').hide()
                }
            }
        }
    });

    $('.pink_btn').on('click',function(e){
        e.preventDefault();

        layui.use(['layer'], function () {
            var layer = layui.layer;
            var amount=account
            //跳转到支付结果页面
            Ajax.detail({
                url: config.TrainingPayment, // 请求地址
                data: {
                    amount:amount,
                    platformId:platformId
                }
            },function(res) {
                debugger
                if(res.status==='0000'){
                    location.href = 'payResult.html?amount='+amount;
                }else{
                    layer.alert(res.resultmsg)
                }
            });
        });
    });

    $('.orange_btn').on('click',function(e) {
        e.preventDefault();
        location.href = '../my-recharge.html';
    })


});
