/**
 * 配置说明
 * 静态页面跳转
 * 静态数据
 * 公用接口地址
 */
define(function (require) {
   var config = require('config');

    /**
     * 首页最新货源列表接口
     */
    config.IHomePageGoods = config.createInterfaceUrl('webnewgoodsinfoapi');
    config.IHomePageCars = config.createInterfaceUrl('webnewdrvinfoapi');
    config.IHomePageExpress = config.createInterfaceUrl('webnewLogisticinfoapi');

    //人员招聘
    config.IRecruitList = config.createInterfaceUrl('recruitlistapi');
    config.IGetTenderList = config.createInterfaceUrl('gettenderlistapi');//招标列表
    config.IOldCarList = config.createInterfaceUrl('oldcarlistapi');


    // 首页baner 广告位
    config.IHomeBanner = config.createInterfaceUrl('adpositionapi');
    config.IHomeAds = config.createInterfaceUrl('adpositionapi');



    return config;

});
