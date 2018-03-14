/**
 * 配置说明
 * 静态页面跳转
 * 静态数据
 * 公用接口地址
 */
define(function (require) {
    var config = require('config');

    /**
     * 
     */

    config.ITenderAds = config.createInterfaceUrl('adpositionapi');
    config.IGetTenderList = config.createInterfaceUrl('gettenderlistapi');//招标列表
    
    config.IGetTenderDetail = config.createInterfaceUrl('gettenderdetailapi');//招标详情

    config.IGetTenderIsBuy = config.createInterfaceUrl('gettenderisbuyapi');//购买标书
    config.IPayTender = config.createInterfaceUrl('paytenderapi');//标书付款
    config.IDownLoadTenderDoc = config.createInterfaceUrl('downloadtenderdocapi');//下载

    config.IWantBid = config.createInterfaceUrl('wantbidapi');//我要竞标
    config.IBidInfoSave = config.createInterfaceUrl('bidinfosaveapi');//提交竞标

    return config;

});
