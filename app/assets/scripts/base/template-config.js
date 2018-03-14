define(function(require) {
    var template = require('template'),
        config = require('./config'),
        Tools = require('./tools'),
        UserService = require('UserService');

    template.openTag = "<!--[";
    template.closeTag = "]-->";
    /**
     * 模板帮助方法，绝对化图片地址
     * type {user,good}
     */
    template.helper('$absImg', function(content, type) {
        if (content) {
            return content;
        }

        switch (type) {
            case 'user':
                content = config.defaultImg;
                break;
            case 'car':
                content = config.defaultCarImg;
                break;
            case 'good':
                content = config.defaultGoodImg;
                break;
        }

        return content;
    });

    // 模板帮助方法，转换时间戳成字符串
    template.helper('$formatDate', function(content, type, defaultValue) {
        if (content) {
            if (content.length == 10)
                content = content + '000';
            return Tools.formatDate(content, type);
        } else {
            return defaultValue || '--';
        }
    });

    // 模板帮助方法，格式化时间
    template.helper('$DateFormat', function(value,fmt) {
        try{
            value=new Date(value);
        }
        catch(e){  }
        var o ={
            "M+" : value.getMonth() + 1, //月份
            "d+" : value.getDate(), //日
            "h+" : value.getHours(), //小时
            "m+" : value.getMinutes(), //分
            "s+" : value.getSeconds(), //秒
            "q+" : Math.floor((value.getMonth() + 3) / 3), //季度
            "S" : value.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (value.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    });

    //模板帮助方法，编码url参数
    template.helper('$encodeUrl', function(content) {
        return encodeURIComponent(content);
    });

    //模板帮助方法，格式化货币
    template.helper('$formatCurrency1', function(content, defaultValue, unit) {
        if (!content) {
            return defaultValue || '--';
        }
        content = content + ''; //转字符串

        var prefix, subfix, idx = content.indexOf('.');
        if (idx > 0) {
            prefix = content.substring(0, idx);
            subfix = content.substring(idx, content.length);
        } else {
            prefix = content;
            subfix = '';
        }

        var mod = prefix.toString().length % 3;
        var sup = '';
        if (mod == 1) {
            sup = '00';
        } else if (mod == 2) {
            sup = '0';
        }

        prefix = sup + prefix;
        prefix = prefix.replace(/(\d{3})/g, '$1,');
        prefix = prefix.substring(0, prefix.length - 1);
        if (sup.length > 0) {
            prefix = prefix.replace(sup, '');
        }
        if (subfix) {
            if (subfix.length == 2) {
                subfix += '0';
            } else if (subfix.length == 1) {
                subfix += '00';
            }
            subfix = subfix.substring(0, 3);
        }

        return prefix + subfix;
    });

    //模板帮助方法，截取内容长度添加省略号
    template.helper('$ellipsis', function(content, length) {
        var v = content.replace(/[^\x00-\xff]/g, '__').length;
        if (v / 2 > length) {
            return content.substring(0, length) + '...';
        }
        return content;
    });

    //模板帮助方法，格式化货币
    template.helper('$formatCurrency', function(content, i) {
        if (!content) {
            return '--';
        }
        content = content + ''; //转字符串

        //1200.55->1200<span class="c-red f-s">.55</span>
        var p, f, idx = content.indexOf('.');
        if (idx > 0) {
            p = content.substring(0, idx);
            f = content.substr(idx, 3);
        } else {
            p = content;
            f = '.00';
        }
        return p + '<span class="f-s">' + f + '</span>';
    });

    //模板帮助方法，格式化货币
    template.helper('$replaceStr', function(content, key, val) {
        if (!content) return '';
        return content.replace(key, val);
    });

    /**
     * 评分等级计算
     */
    template.helper('$printStar', function(praiseRate) {
        var active = 1;
        if (!(praiseRate = parseFloat(praiseRate))) praiseRate = 1;

        if (20 <= praiseRate) {
            active = 2;
        }
        if (40 <= praiseRate) {
            active = 3;
        }
        if (60 <= praiseRate) {
            active = 4;
        }
        if (80 <= praiseRate) {
            active = 5;
        }
        return active;
    });

    /**
     * 是否为用户自己
     */
    template.helper('$isOwner', function(id) {
        if (!id) return false;
        var user = UserService.getUser();
        if (!user) return false;
        var memberType = user.memberType || undefined;
        return UserService.getUserId() + '' === id || memberType == config.types.userType.goodOwner;
    });

    /**
     * 是否为匿名
     */

    template.helper('$isNoName', function(o, str) {
        if (o == '1') return str.replace(/(1\d{2})\d*/, '$1****');
        return str;
    });

    /**
     * 是否已登录
     */
    template.helper('$isLogin', function(str) {
        if (!UserService.isLogin()) return str.replace(/(\d{4})\d*/, '$1****');
        return str;
    });

    template.helper('$ifLogin', function() {
        return UserService.isLogin();
    });

    template.helper('$replaceRN', function(str) {
        return str.replace(/\r\n/g,"<br/>").replace(/\n/g,"<br/>");
    });

    template.helper('$isImg', function(str) {
         return (str && /\.(jpg|png|bmp|jpeg|gif)$/i.test(str));
    });

});