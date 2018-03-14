/**
 * 配置说明
 * 静态页面跳转
 * 静态数据
 * 公用接口地址
 */
define(function (require) {
    var config = require('config');
    /**
     * 货源的广告
     */
    config.IGoodsAds = config.createInterfaceUrl('adpositionapi');

    config.IConfrimPrice = config.createInterfaceUrl('confirmypriceapi');

    config.PGoodsDetail = config.createPageUrl('goods','goods-detail');

    config.PConfrimPrice = config.createPageUrl('goods','order-price');


    return config;
});
