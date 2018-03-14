/**
 * 配置说明
 * 静态页面跳转
 * 静态数据
 * 公用接口地址
 */
define(function (require) {
    var config = require('config');

    require('common');
    require('./com');

    /**
     * 首页最新货源列表接口
     */
    config.PNoticeList = config.createPageUrl('ours','notice-list');
    config.INoticeList = config.createInterfaceUrl('noticeinfoapi');

    config.PNoticeDetail = config.createPageUrl('ours','notice-detail') + '?id=';
    config.INoticeDetail = config.createInterfaceUrl('noticedetailapi');

    return config;


});
