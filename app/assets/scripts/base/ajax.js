define(function (require, exports, module) {
    var $ = require('jquery'),
        template = require('template'),
        config = require('./config'),
        msg = require('./messages'),
        Tools = require('./tools'),
        UserService = require('./user-service.js');


    var latitude= 31.22,
        longitude= 121.48;
    var _tem=UserService.getLL();
    if(_tem.latitude){
        //latitude=parseFloat(_tem.latitude);
        //longitude=parseFloat(_tem.longitude);
    }

    require('./template-config');

    var Ajax = {
        /**
         * 分页查询
         *
         * @param data-封装请求url，请求数据，请求类型，渲染容器，渲染模版
         * @param callback-请求成功后执行的回调方法
         * @param callbackError-请求失败后执行的回调方法
         */
        pageRequest: function (data, callback, callbackError) {
            var renderFor = data.renderFor || 'data-list-tmpl',
                renderEle = data.renderEle || '#data-list',
                pageFor = data.pageFor || 'page-tmpl',
                pageEle = data.pageEle || '#page',
                key = data.key || '';

            var _this = this,
                _data = {
                    pageSize: config.pageSize,
                    lastRecordId: config.begin,
                    deviceType: 'web',
                    latitude: latitude,
                    longitude: longitude,
                    memberId: UserService.getUserId(),
                    accessToken: UserService.getAccessToken()
                };//默认值

            _data = $.extend(_data, data.data);

            $.ajax({
                url: data.url,
                data: _data,
                type: data.type || 'POST',
                dataType: 'JSON',
                timeout: 30000,
                cache: false,
                beforeSend: function () {
                    _this.showLoad($(pageEle || data.dom));
                },
                complete: function () {
                    _this.hideLoad($(pageEle || data.dom));
                }
            }).then(function (response, textStatus, jqXHR) {
                console.log(response)
                _this.validToken(response);
                if (response.status != '0000') {
                    Tools.log('[paging] ' + (response.resultmsg || response) + ':' + data.url);
                }
                for (var i in response.data){
                    if(response.data[i].VideoDesc){
                        var test=response.data[i].VideoDesc.replace(/<\/?.+?>/g,"")
                        response.data[i].VideoDesc=test.replace(/ /g,"")
                    }
                }
                //数据渲染
                if ($('#' + renderFor).length) {
                    //三期后台返回数据格式和之前的不一样，所以将response.data这样处理：
                    if(response.data==null){
                        response.data=[]
                    }
                    var result = template.render(renderFor, {'list':response.data[key] || response.data || []});
                    $(renderEle).html(result);
                    _this.showLevel();

                }
                //页码渲染

                if ($('#' + pageFor).length && response.totalcount) {

                    var o = {cPage: 0, pageStart: 0, pageEnd: 0, totalPage: 0};
                    //计算页数
                    o.totalPage = config.totalPage = parseInt(((parseInt(response.totalcount) || 0) + config.pageSize - 1) / config.pageSize) || 0;
                    //设置当前页
                    o.cPage = parseInt(config.currentPage) || 1;

                    //计算省略页码


                    o.pageIndex = getPageIndex(5, o.cPage, o.totalPage);

                    var html = template.render(pageFor, {
                        totalPage: o.totalPage,
                        pageStart: o.pageIndex.firstIndex,
                        pageEnd: o.pageIndex.lastIndex,
                        cPage: o.cPage,
                        action: data.url,
                        lastRecordId: config.begin,
                        pageSize: config.pageSize
                    });
                    $(pageEle).html(html);

                }

                //结果回调
                if (typeof callback == 'function') {
                    callback(response);
                }
            }, function (jqXHR, textStatus, errorThrown) {
                Tools.log('[paging] ' + textStatus + ':' + data.url);
                if (typeof callbackError == 'function') {
                    callbackError(jqXHR, textStatus, errorThrown);
                }
            });

            /**
             *
             * @param viewedIndex 默认显示几个角码
             * @param currentPage 当前页
             * @param totalPage 总页数
             * @returns {{firstIndex: number, lastIndex: number}}
             */
            function getPageIndex(viewedIndex, currentPage, totalPage) {
                if (totalPage <= viewedIndex) {
                    return {firstIndex: 1, lastIndex: totalPage}
                }
                var firstIndex = Math.ceil((currentPage <= viewedIndex / 2 + 1 ? 1 : (currentPage - viewedIndex / 2)));
                var lastIndex = Math.ceil((firstIndex + viewedIndex - 1 >= totalPage ? totalPage : firstIndex + viewedIndex - 1));
                if (lastIndex >= totalPage)
                    firstIndex = lastIndex - viewedIndex + 1;
                return {firstIndex: firstIndex, lastIndex: lastIndex}
            }
        },
        /**
         * 详情查询
         *
         * @param data-封装请求url，请求数据，请求类型，渲染容器，渲染模版
         * @param callback-请求成功后执行的回调方法
         * @param callbackError-请求失败后执行的回调方法
         */
        detail: function (data, callback, callbackError, isShowLayer) {
            var renderFor = data.renderFor || 'data-detail-tmpl',
                renderEle = data.renderEle || '#data-detail';

            //loading 遮罩层
            if (!data.showLayer)data.showLayer = false;

            data.data = $.extend({
                latitude: latitude,
                longitude: longitude,
                deviceType: 'web',
                memberId: UserService.getUserId(),
                accessToken: UserService.getAccessToken()
            }, data.data);

            var _this = this;
            $.ajax({
                url: data.url,
                data: data.data,
                type: data.type || 'POST',
                dataType: 'JSON',
                timeout: 30000,
                beforeSend: function () {
                    _this.showLoad($(renderEle || data.dom));
                },
                complete: function () {
                    _this.hideLoad($(renderEle || data.dom));
                }
            }).then(function (response, textStatus, jqXHR) {

                _this.validToken(response);

                if (response.status != '0000') {
                    Tools.log('[detail] ' + (response.resultmsg || response) + ':' + data.url);
                }
                if ($('#' + renderFor).length && response.data) {
                    var result = template.render(renderFor, response.data);
                    $(renderEle).html(result);
                    _this.showLevel();
                }

                if (typeof callback == 'function') {
                    callback(response);
                }
            }, function (jqXHR, textStatus, errorThrown) {

                Tools.log('[detail] ' + textStatus + ':' + data.url);
                if (typeof callbackError == 'function') {
                    callbackError(jqXHR, textStatus, errorThrown);
                }
            });
        },
        /**
         * 表单提交
         *
         * @param data-传入的参数
         * @param callback-请求成功后执行的回调方法
         * @param callbackError-请求失败后执行的回调方法
         */
        submit: function (data, callback, callbackError) {
            var formData, _this = this;

            var isForm = !!data.data.length;
            if (isForm) {
                formData = data.data.serializeArray();
                data.data.find('input[type="submit"]').attr('disabled', true);
            } else {
                formData = $.extend({
                    deviceType: 'web',
                    memberId: UserService.getUserId(),
                    accessToken: UserService.getAccessToken()
                }, data.data);
            }

            $.ajax({
                url: data.url,
                data: formData,
                type: data.type || 'POST',
                dataType: 'JSON',
                timeout: 30000
            }).then(function (response, textStatus, jqXHR) {
                /**
                 * token
                 */
                _this.validToken(response);

                if (isForm) {
                    data.data.find('input[type="submit"]').removeAttr('disabled');
                }

                if (!response || response.status != '0000') {
                    Tools.log('[submit] ' + response.resultmsg + ':' + data.url);
                    //返回出错
                    //return;
                }

                //如果有回调，先执行回调
                if (typeof callback == 'function') {
                    callback(response);
                }

            }, function (jqXHR, textStatus, errorThrown) {
                Tools.log('[submit] ' + textStatus + ':' + data.url);
                if (isForm) {
                    data.data.find('input[type="submit"]').removeAttr('disabled');
                }
                if (typeof callbackError == 'function') {
                    callbackError(jqXHR, textStatus, errorThrown);
                }
            });
        },
        /**
         * 自定义查询
         *
         * @param data-封装请求url，请求数据，请求类型
         * @param callback-请求成功后执行的回调方法
         * @param callbackError-请求失败后执行的回调方法
         */
        custom: function (data, callback, callbackError) {

            var _this = this,
                renderType = data.renderType || undefined,
                renderFor = data.renderFor || undefined,
                renderEle = data.renderEle || undefined,
                isShowLoading = data.isShowLoading || true;

            $.ajax({
                url: data.url,
                data: data.data,
                type: data.type || 'POST',
                dataType: 'JSON',
                timeout: 30000,
                beforeSend: function () {
                    if (isShowLoading) {
                        _this.showLoad($(data.renderEle || data.dom));
                    }
                },
                complete: function () {
                    _this.hideLoad($(data.renderEle || data.dom));
                }
            }).then(function (response, textStatus, jqXHR) {

                if (response.status != '0000') {
                    Tools.log('[custom] ' + (response.resultmsg || response) + ':' + data.url);
                }
                // 数据渲染
                if (renderType && $('#' + renderFor).length && response.data) {
                    if (typeof response.data !== 'object') {

                    }
                    var o = response.data;
                    if (renderType === _this.renderType.list) {
                        o = {list: response.data}
                    }
                    result = template.render(renderFor, o);
                    $(renderEle).html(result);
                    o = undefined;
                }

                if (typeof callback == 'function') {
                    callback(response);
                }

            }, function (jqXHR, textStatus, errorThrown) {
                Tools.log('[custom] ' + textStatus + ':' + data.url);
                if (typeof callbackError == 'function') {
                    callbackError(jqXHR, textStatus, errorThrown);
                }
            });
        },
        /**
         * 显示load层
         * @param parentDom
         */
        showLoad: function (dom) {
            if (!dom || !dom.length) {
                return;
            }
            dom.html('');
            var img = document.createElement('img');
            img.src = config.loadMoreImg;
            img.className = "ajax-load-img";
            dom.append($(img));
        },
        /**
         * 隐藏load层
         */
        hideLoad: function (dom) {
            if (dom && dom.length) {
                var load = dom.find('.ajax-load-img');
                load ? load.remove() : '';
            }
        },
        getFrom: function () {
            return decodeURIComponent(Tools.getQueryValue('from'));
        },
        renderType: {
            list: 'list',
            detail: 'detail'
        },
        validToken: function (res) {
            if (!res)return;
            if (!res.status)return;
            if (res.status == '1002') {
                alert(res.resultmsg || '请重新登录！');
                location.href = config.PLogin + '?from=' + encodeURIComponent(location.href);
                return;
            }
        },
        showLevel:function(){
            //评分显示
            var star = $('.rating-level');
            if (star.length) {
                star.each(function () {
                    var level = $(this).attr("data-level") || 5;
                    $(this).children('li:nth-child(' + level + ')').find('a').addClass('active');
                });
            }
        }

    };


    module.exports = Ajax;
});
