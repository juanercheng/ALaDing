define(function (require) {
    var config = require('./config'),
        $ = require('jquery');

    var preventDefault, panel, panelBg, delay, count = 0,
        toastPanel;

    return {
        /**
         * 将form中的值转换为键值对
         *
         * @param form-表单对象
         */
        formJson: function (form) {
            var o = {};
            var a = $(form).serializeArray();
            $.each(a, function () {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        },
        log: function (msg) {
            if (typeof console != 'undefined') {
                console.log(msg);
            }
        },
        /**
         * 格式化货币
         * @param content
         * @param defaultValue
         * @param unit
         * @returns {*}
         */
        formatCurrency1: function (content, defaultValue, unit) {
            if (!content) {
                return defaultValue || '--';
            }

            content = content + '';//转字符串

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
        },
        /**
         * 格式化时间
         * @param str
         * @returns {Date}
         */
        strToDate: function (str) { //字符串转日期，yyyy-MM-dd hh:mm:ss
            var tempStrs = str.split(" ");
            var dateStrs = tempStrs[0].split("-");
            var year = parseInt(dateStrs[0], 10);
            var month = parseInt(dateStrs[1], 10) - 1;
            var day = parseInt(dateStrs[2], 10);

            var timeStrs = tempStrs[1].split(":");
            var hour = parseInt(timeStrs[0], 10);
            var minute = parseInt(timeStrs[1], 10) - 1;
            var second = parseInt(timeStrs[2], 10);
            var date = new Date(year, month, day, hour, minute, second);
            return date;
        },
        /**
         * 根据URL参数key获取value
         * @param key
         * @returns {string}
         */
        getQueryValue: function (key) {
            var q = location.search,
                keyValuePairs = new Array();

            if (q.length > 1) {
                var idx = q.indexOf('?');
                q = q.substring(idx + 1, q.length);
            } else {
                q = null;
            }

            if (q) {
                for (var i = 0; i < q.split("&").length; i++) {
                    keyValuePairs[i] = q.split("&")[i];
                }
            }

            for (var j = 0; j < keyValuePairs.length; j++) {
                if (keyValuePairs[j].split("=")[0] == key) {
                    // 这里需要解码，url传递中文时location.href获取的是编码后的值
                    // 但FireFox下的url编码有问题
                    return decodeURI(keyValuePairs[j].split("=")[1]);

                }
            }
            return '';
        },
        /**
         * 格式化时间
         * @param content
         * @param type
         * @returns {*}
         */
        formatDate: function (content, type) {
            var pattern = "yyyy-MM-dd hh:mm";
            switch (type) {
                case 1:
                    pattern = "yyyy年M月d日";
                    break;
                case 2:
                    pattern = "hh:mm";
                    break;
                case 3:
                    pattern = "yyyy.M.d";
                    break;
                case 4:
                    pattern = "yyyy-MM-dd hh:mm:ss";
                    break;
                case 5:
                    pattern = "yyyy年MM月";
                    break;
                case 6:
                    pattern = "yyyy-MM-dd";
                    break;
                case 7:
                    pattern = "yyyy年M月d日 hh时";
                    break;
                default:
                    pattern = !!type ? type : pattern;
                    break;
            }
            if (isNaN(content) || content == null) {
                return content;
            } else if (typeof(content) == 'object') {
                var  dd = content;
                var y = dd.getFullYear(),
                    m = dd.getMonth() + 1,
                    d = dd.getDate();
                if (m < 10) {
                    m = '0' + m;
                }
                var yearMonthDay = y + "-" + m + "-" + d;
                var parts = yearMonthDay.match(/(\d+)/g);
                var date = new Date(parts[0], parts[1] - 1, parts[2]);
                return format(date, pattern);
            } else {
                var date = new Date(parseInt(content));
                return format(date, pattern);
            }
        },
        /**
         * 获取窗口尺寸，包括滚动条
         */
        getWindow: function () {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        /**
         * 获取文档尺寸，不包括滚动条但是高度是文档的高度
         * @returns {{width: number, height: number}}
         */
        getDocument: function () {
            var doc =  document.body || document.documentElement;
            return {
                width: doc.clientWidth,
                height: doc.clientHeight
            };
        },
        /**
         * 获取屏幕尺寸
         * @returns {{width: Number, height: Number}}
         */
        getScreen: function () {
            return {
                width: screen.width,
                height: screen.height
            };
        },
        /**
         * 显示、禁用滚动条
         * @param isShow
         */
        showOrHideScrollBar: function (isShow) {
            preventDefault = preventDefault || function (e) {
                e.preventDefault();
            };
            (document.documentElement || document.body).style.overflow = isShow ? 'auto' : 'hidden';
            // 手机浏览器中滚动条禁用取消默认touchmove事件
            if (isShow) {
                // 注意这里remove的事件必须和add的是同一个
                document.removeEventListener('touchmove', preventDefault, false);
            } else {
                document.addEventListener('touchmove', preventDefault, false);
            }
        },
        // 获取页面高度
        getPageHeight:function () {
            return this._getDocument().scrollHeight;
        },
        // 获取页面卷去的高度
        getScrollTop:function () {
            return this._getDocument().scrollTop;
        },
        // 获取页面可视区域宽度
        getClientHeigth:function () {
            return this._getDocument().clientHeight;
        },
        _getDocument:function(){
            return document.documentElement || document.body;
        }
    };

    function format(date, pattern) {
        var that = date;
        var o = {
            "M+": that.getMonth() + 1,
            "d+": that.getDate(),
            "h+": that.getHours(),
            "m+": that.getMinutes(),
            "s+": that.getSeconds(),
            "q+": Math.floor((that.getMonth() + 3) / 3),
            "S": that.getMilliseconds()
        };
        if (/(y+)/.test(pattern)) {
            pattern = pattern.replace(RegExp.$1, (that.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(pattern)) {
                pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return pattern;
    }


});
