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
    config.ICarsAds = config.createInterfaceUrl('adpositionapi');
    config.ICarsList = config.createInterfaceUrl('getnearbydriver');
    config.ICarsDetail = config.createInterfaceUrl('getdriverdetail');

    config.PCarsDetail = config.createPageUrl('cars','cars-detail');

    return config;

});
