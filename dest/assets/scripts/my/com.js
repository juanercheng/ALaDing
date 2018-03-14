/**
 * Created by haner on 15/6/10.
 */
define(function (require) {
    var $ = require('jquery'),
        config = require('config'),
        us = require('UserService');

    require('common');

        var headerArr = [
            'my-index',  //个人资料
            'information',//认证信息
            'training',  //培训
            'recharge',  //充值
            'cash',   //提现
            'record'   //交易记录
            ,/(my\-order|orderinsurance)/,
            'my-overdue-order',
            '/order-publish',
            'route'
            ,/(recruitment\/my\-rec|recruitment\/rec\-detail)/,
            'rec-publish'
            ,/(oldcar\/my\-car\.|oldcar\/my\-car\-[d|u])/,
            "my-car-publish",//我要卖车
            '/ownlogistics/',//推荐物流公司
            '/owngoods/',//推荐货源
            '/owncars/',//推荐车源
            'tenders-publish',//发布标书
            'my-tenders',//我的招标
            'my-bid-tenders',//我的竞标
            'loan-publish',//申请贷款
            'my-loan',//贷款信息
            '/mytools/',//我的工具
            'suggest',
            'my-price'];
            
    $('.my_nav .nav li').each(function (i, o) {
        if(typeof headerArr[i] == 'object'){
            if(headerArr[i].test(location.href)){
                $('.my_nav .nav li:eq(' + i + ') a').addClass('active');
            }
        }
        else if (location.href.indexOf(headerArr[i]) != -1) {
            $('.my_nav .nav li:eq(' + i + ') a').addClass('active');
        }
    });

    /**
     * 菜单控制
     */
    var user = us.getUser();
    if(user&&!user.accessToken){
        location.href = config.PLogin + '?from=' + encodeURIComponent(location.href);
        return;
    }

    if(user.memberType === config.types.userType.driver){//司机
        $('#my_nav .dri').fadeIn();
    }else if(user.memberType === config.types.userType.goodOwner){//货主
        $('#my_nav .good').fadeIn();
    }else if(user.memberType === config.types.userType.expressCom){//物流
        $('#my_nav .logis').fadeIn();
    }

    //$('#my_nav li').fadeIn();
});
