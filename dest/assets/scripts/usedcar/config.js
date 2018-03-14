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
    
    config.IOldCarDetail = config.createInterfaceUrl('oldcardetailapi');

    config.IOldCarList = config.createInterfaceUrl('oldcarlistapi');

    return config;

});
