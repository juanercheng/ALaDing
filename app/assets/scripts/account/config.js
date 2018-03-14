/**
 * 配置说明
 * 静态页面跳转
 * 静态数据
 * 公用接口地址
 */
define(function (require) {
   var config = require('config');

    config.ISendMsg = config.createInterfaceUrl('getsmsapi');
    config.IRegister = config.createInterfaceUrl('registerapi');
    config.ILogin = config.createInterfaceUrl('loginapi');
    config.IForget = config.createInterfaceUrl('changepasswordapi');

    return config;

});
