/**
 * 配置说明
 * 静态页面跳转
 * 静态数据
 * 公用接口地址
 */
define(function (require) {
    var config = require('config');

    /**
     * 订单的广告
     */
    config.IOrderAds = config.createInterfaceUrl('adpositionapi');
    config.IExpressList = config.createInterfaceUrl('getnearbylogistics');
    config.IExpressDetail = config.createInterfaceUrl('getlogisticsdetail');


    config.PExpressDetail = config.createPageUrl('express','express-detail');

    return config;
});
