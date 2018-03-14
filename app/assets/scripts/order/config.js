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

    config.ICommentTags = config.createInterfaceUrl('appraisetagapi');

    config.IComment = config.createInterfaceUrl('saveappraiseapi');

    config.IOrderList = config.createInterfaceUrl('webgoodscenterapi');

    config.POrderDetail = config.createPageUrl('order','order-detail');

    return config;

});
