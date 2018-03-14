define(function (require) {
    var $ = require('jquery'),
        config = require('./config'),
        UserService = require('UserService'),
        Tools = require('tools');

    //标题样式添加
    var hrefArr = [config.PIndex, config.PGoodsIndex, config.PCarsIndex, config.PExpressIndex,config.PRecruitIndex,config.PTendersIndex,config.PUsedCarIndex, config.POrderIndex, config.POursIndex],
        headerArr = ['/index', '/goods', '/cars', '/express','/recruit/','/tenders/','/usedcar/', '/order/', '/ours'];
    $('.header .nav li').each(function (i, o) {
        if (location.href.indexOf(headerArr[i]) != -1) {
            $(this).addClass('active');
        }
        $(this).bind('click', function () {
            location.href = hrefArr[i];
        })
    });


    //设置用户姓名
    var User = UserService.getUser();
    if (User&&User.accessToken) {
        $('#l_u').text(User.reallyName || '未命名').addClass('person');
        $('#r_l').text('退出').addClass('logout');
    }

    //退出
    $('#r_l').click(function (e) {
        e.preventDefault();
        $(this).hasClass('logout') ? UserService.logout() : location.href = config.PReg;
    });

    //登陆
    $('#l_u').click(function (e) {
        e.preventDefault();
        if($(this).hasClass('person')){
            location.href = config.PMyIndex;
        }else{
         if(Tools.getQueryValue('from')){
             location.replace(location);
         }else{
             location.href = config.PLogin + '?from=' + encodeURIComponent(location.href);
         }
        }
    });

    //分页点击
    $('body').on('click', '.page a[data-page-num]', function () {
        if (typeof config.pageRequest == 'function') {
            config.currentPage = config.begin = $(this).attr('data-page-num');
            config.pageRequest();
        }
    });

    //上一页,下一页
    $('body').on('click', '.page .pre,.page .next', function () {
        if (typeof config.pageRequest == 'function') {
            var cPage = parseInt($(this).siblings('div').find('.current').text()) || 1;
            $(this).is($('.page .pre')) ? cPage -= 1 : cPage += 1;
            config.currentPage = config.begin = cPage < 1 ? 1 : cPage;
            config.pageRequest();
        }
    });

    /**
     * 页面搜索
     */
    var searchPage = {
        good: config.PGoodsIndex,
        car: config.PCarsIndex,
        express: config.PExpressIndex
    };
    $('#search_all').submit(function (e) {
        e.preventDefault();
        var t = $('#search_type span.active').attr('data-type');
        location.href = searchPage[t] + '?key=' + $('input[name="key"]').val() + '&t=' + t;
    });

    /**
     * 搜素类型 选择
     */
    $('#search_type span').click(function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    });

    /**
     * 回填关键字
     */
    var key = Tools.getQueryValue('key'),
        t = Tools.getQueryValue('t');
    key ? $('input[name="key"],input[name="nodes"]').val(key):'';

    if(t){$('#search_type span').removeClass('active'); $('#search_type span[data-type="'+t+'"]').addClass('active')}

});

