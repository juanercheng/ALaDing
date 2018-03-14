/**
 * 配置说明
 * 静态页面跳转
 * 静态数据
 * 公用接口地址
 */
define(function () {
    var config = {
        //projectName: '/iread',
        projectName: '',
        begin: 1, //当前第几页，从1开始
        pageSize: 10, //默认分页大小,
        totalPage: 0, //总页数,
        pageRequest: undefined,
        currentPage:1,
        // baseUrl: 'http://121.43.151.69:9898',
        baseUrl: 'http://www.dingding56.com/',
        interfaceSuffix: '.aspx',
        pageSuffix: '.html'
    };

    config.server = config.baseUrl ? (config.baseUrl + config.projectName) : (location.protocol + '//' + location.host + config.projectName + '/'); //页面服务器地址
    config.pageServer = location.protocol + '//' + location.host + config.projectName;//页面存放地址
    config.imageServer = config.server + '/api/pictureapi' + config.interfaceSuffix;//图片存放地址
    config.fileServer = config.server +'/api/uploadfileapi'+config.interfaceSuffix;//文件存放地址
    config.interfaceServer = config.server + '/api/'; //接口地址
    config.defaultImg = config.fileServer + '/assets/image/user.png'; //默认用户图片
    config.defaultCarImg = config.fileServer + '/assets/image/car.png'; //默认车源图片
    config.defaultGoodImg = config.fileServer + '/assets/image/good.png'; //默认货源图片
    config.loadMoreImg = '/assets/image/ajax-loader.gif';//加载中图片配置

    //登陆
    config.PLogin = createPageUrl('login');
    config.PReg= createPageUrl('register-step1');

    //首页（公告，车源，货源 ，物流 ，联系我们）
    config.PIndex = createPageUrl('index');  //首页
    config.PGoodsIndex= createPageUrl('goods','goods-index'); //货源首页
    config.PCarsIndex= createPageUrl('cars','cars-index');//车源首页
    config.PExpressIndex= createPageUrl('express','express-index');//物流首页
    config.POrderIndex= createPageUrl('order','order-index');//订单首页
    config.POursIndex= createPageUrl('ours','company-info');//联系我们首页
    config.PCompanyInfo = createPageUrl('ours','company-info');//公司介绍首页
    config.PHelp = createPageUrl('ours','help');//使用帮助首页
    config.PContact = createPageUrl('ours','contact');//联系我们tab首页
    config.PNoticeList = createPageUrl('ours','notice-list');//公告首页
    config.PMyIndex = createPageUrl('my','my-index');//个人首页
    config.PMyRecharge = createPageUrl('my','my-recharge');//兑换记录
    config.PMyRecord = createPageUrl('my','my-record');//个人首页
    config.PMySug = createPageUrl('my','my-suggest');//个人首页
    config.PMyRoute = createPageUrl('my','my-route');//线路
    config.PMyPrice = createPageUrl('my','my-price');//我的报价
    config.POrderComment = createPageUrl('my','order','order-comment');//订单评价
    config.POrderMsg = createPageUrl('my','order','order-msg');//订单消息

    config.PUsedCarIndex = createPageUrl('usedcar','usedcar-index');//二手车
    config.PRecruitIndex = createPageUrl('recruit','recruit-index');//人员招聘
    config.PTendersIndex = createPageUrl('tenders','tenders-index');//招投标




    //详情页（公告，车源，货源 ，物流）
    config.PNoticeDetail = createPageUrl('ours','notice-detail') + '?id=';
    config.PGoodsDetail = createPageUrl('goods','goods-detail') + '?id=';
    config.PCarsDetail = createPageUrl('cars','cars-detail') + '?id=';
    config.PExpressDetail = createPageUrl('express','express-detail') + '?id=';





    //公告接口
    config.INoticeList = createInterfaceUrl('noticeinfoapi');
    config.INoticeDetail = createInterfaceUrl('');

    //广告位置接口
    config.IAd = createInterfaceUrl('adpositionapi');

    //评论
    config.ICommentList = createInterfaceUrl('getappraiselist');

    //订单，货物
    config.IGoodsList = createInterfaceUrl('getnearbygoods');

    config.IGoodsDetail = createInterfaceUrl('getgoodsdetail');


    //省市区
    config.IProvince = createInterfaceUrl('getprovinceapi');
    config.ICity = createInterfaceUrl('getcitybyprovinceidapi');
    config.IArea = createInterfaceUrl('getareabycityidapi');


    //字典表
    config.IDictionary = createInterfaceUrl('dictenumapi');





    /**
     * 暴露方法
     * @type {createInterfaceUrl}
     */
    config.createInterfaceUrl = createInterfaceUrl;
    config.createPageUrl = createPageUrl;

    /**
     * 后台枚举
     */
    config.types = {};
    config.types.adType = {
        banner: 'banneradp',
        adIn: 'webadp', //首页
        adOr: 'orderadp',//订单
        adEp: 'cmpadp',//物流
        adCar: 'drvadp', //车源
        adGoods: 'goodadp',//货源
        recruitdp: 'recruitdp',//人员招聘
        oldcardp: 'oldcardp',//二手车广告位
        tenderdp: 'tenderdp'//招标广告位
    };

    /**
     * 会员类型
     * @type {{driver: string, goodOwner: string, expressCom: string}}
     */
    config.types.userType = {
        driver:'driver',//司机
        goodOwner:'tradeenterprises',//货主
        expressCom:'logistics' //物流
    };

    /**
     * 获取字典 参数
     * @type {{orderstateenum: string, logistictypeenum: string, goodkindenum: string, drvnatureenum: string, businesstypeenum: string}}
     */
    config.types.dicType = {
        orderstateenum: 'orderstateenum',//订单状态
        logistictypeenum: 'logistictypeenum',//物流追踪类型
        goodkindenum: 'goodkindenum',//货物性质
        drvnatureenum: 'drvnatureenum',//车辆性质
        businesstypeenum: 'businesstypeenum',//业务类型
        goodtypeenum:'goodtypeenum',//货物类型
        vehicletypeenum:'vehicletypeenum', //车型
        insurancetypeenum:"insurancetypeenum", //保险类型
        tenderbidenum:"tenderbidenum" //招标状态
    };

    config.orderType = {
        beginquoted:'beginquoted', //正在报价
        issure:'issure',//已确认
        completed:'completed',//已完成
        sendcancel:'sendcancel',//发货方悔单
        drvcancel:'drvcancel',//承运方悔单
        failure:'failure'//失效
    };

    /**
     * 招聘字典类型
     * @type 
     */
    config.types.recruitmentType = {
        recruitpriceenum: 'recruitpriceenum',//工资类型
        positiontypeenum: 'positiontypeenum',//职位分类
        sexenum: 'sexenum',//招聘性别
        drvLinceseenum: 'drvLinceseenum' //招聘驾照
    };

    /**
     * 审核状态
     * @type 
     */
    config.types.approvee = {
        approveenum: 'approveenum' //审核状态
    };


    /**
     * 贷款
     * @type 
     */
    config.types.loan={
        loanmoneyenum:"loanmoneyenum", //贷款金额
        loanstatusenum:"loanstatusenum" //贷款审核状态
    }


    /**
     * 发票审核状态
     * @type 
     */
    config.types.invoiceStatus = {
        submitted: 'submitted', //待审核
        completed: 'completed', //审核成功
        failed: 'failed', //审核失败
        printing: 'printing', //打印中
        post: 'post' //邮寄完成
    };


    /**
     * 竞标名次 第一名 first,第二名 second 第三名 third 竞标失败 four 流标 five
     * @type 
     */
    config.types.bidrankenum = {
        four: 'four', //竞标失败
        first: 'first', //第一名
        second: 'second', //第二名
        third: 'third' //第三名
    };

    //招标状态
    config.types.tenderbidenum={
        beginbid:"beginbid",//竞标中 
        bidend:"bidend",//竞标结束
        bidover:"bidover" //流标
    };

    config.drvzoneprovincemap=[{"zoneId":"10000","zoneName":"华北","province":[{"provinceId":"110000","provinceName":"北京市","fatherId":"10000"},{"provinceId":"120000","provinceName":"天津市","fatherId":"10000"},{"provinceId":"130000","provinceName":"河北省","fatherId":"10000"},{"provinceId":"140000","provinceName":"山西省","fatherId":"10000"},{"provinceId":"150000","provinceName":"内蒙古","fatherId":"10000"}]},{"zoneId":"20000","zoneName":"东北","province":[{"provinceId":"210000","provinceName":"辽宁省","fatherId":"20000"},{"provinceId":"220000","provinceName":"吉林省","fatherId":"20000"},{"provinceId":"230000","provinceName":"黑龙江省","fatherId":"20000"}]},{"zoneId":"30000","zoneName":"华东","province":[{"provinceId":"310000","provinceName":"上海市","fatherId":"30000"},{"provinceId":"320000","provinceName":"江苏省","fatherId":"30000"},{"provinceId":"330000","provinceName":"浙江省","fatherId":"30000"},{"provinceId":"340000","provinceName":"安徽省","fatherId":"30000"},{"provinceId":"350000","provinceName":"福建省","fatherId":"30000"},{"provinceId":"360000","provinceName":"江西省","fatherId":"30000"},{"provinceId":"370000","provinceName":"山东省","fatherId":"30000"},{"provinceId":"710000","provinceName":"台湾省","fatherId":"30000"}]},{"zoneId":"40000","zoneName":"华中","province":[{"provinceId":"410000","provinceName":"河南省","fatherId":"40000"},{"provinceId":"420000","provinceName":"湖北省","fatherId":"40000"},{"provinceId":"430000","provinceName":"湖南省","fatherId":"40000"}]},{"zoneId":"50000","zoneName":"华南","province":[{"provinceId":"440000","provinceName":"广东省","fatherId":"50000"},{"provinceId":"450000","provinceName":"广西","fatherId":"50000"},{"provinceId":"460000","provinceName":"海南省","fatherId":"50000"},{"provinceId":"810000","provinceName":"香港","fatherId":"50000"},{"provinceId":"820000","provinceName":"澳门","fatherId":"50000"}]},{"zoneId":"60000","zoneName":"西南","province":[{"provinceId":"500000","provinceName":"重庆市","fatherId":"60000"},{"provinceId":"510000","provinceName":"四川省","fatherId":"60000"},{"provinceId":"520000","provinceName":"贵州省","fatherId":"60000"},{"provinceId":"530000","provinceName":"云南省","fatherId":"60000"},{"provinceId":"540000","provinceName":"西藏","fatherId":"60000"}]},{"zoneId":"70000","zoneName":"西北","province":[{"provinceId":"610000","provinceName":"陕西省","fatherId":"70000"},{"provinceId":"620000","provinceName":"甘肃省","fatherId":"70000"},{"provinceId":"630000","provinceName":"青海省","fatherId":"70000"},{"provinceId":"640000","provinceName":"宁夏","fatherId":"70000"},{"provinceId":"650000","provinceName":"新疆","fatherId":"70000"}]}];




    /**
     * args = 'a','b','c'
     * @returns 'a/b/c'
     */
    function createPageUrl() {
        if (!arguments.length) return;
        var n = '';
        for (var i=0;i<arguments.length;i++) {
            if (!arguments[i])return n;
            if (arguments[i].charAt(0) !== '/') arguments[i] = '/' + arguments[i];
            if (arguments[i].charAt(arguments[i].length) !== '/') arguments[i] += '/';
            n += arguments[i];
        }
        if (!n.length) return n;
        n = n.replace(/\/\//g, '/');
        return config.pageServer + n.substr(0, n.length - 1) + config.pageSuffix;
    }

    function createInterfaceUrl(url) {
        return config.interfaceServer + url + config.interfaceSuffix;
    }

    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?7c76b42d3ae9f500a29bb13ef7cc5538";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();

    return config;

});
