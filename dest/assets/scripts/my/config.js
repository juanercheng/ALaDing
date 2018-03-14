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
    config.IMyRecordList = config.createInterfaceUrl('traderecordapi');
    config.IMySug = config.createInterfaceUrl('feedbackapi');
    config.IMyRoute = config.createInterfaceUrl('setlineapi');
    config.IMyOverOrder = config.createInterfaceUrl('sendgoodsmyoutdatedapi');
    config.IRefreshDate = config.createInterfaceUrl('updateunloaddate');
    config.IMyOrder = config.createInterfaceUrl('sendgoodsmyordersapi');
    config.IOrderDetail = config.createInterfaceUrl('sendgoodsorderdetailsapi');
    config.IMyPrice = config.createInterfaceUrl('mypriceapi');
    config.ICancelPrice = config.createInterfaceUrl('cancelgoodspriceapi');
    config.IOrderBack = config.createInterfaceUrl('sendgoodsorderdeletesapi');
    config.IOrderPriceBack = config.createInterfaceUrl('driverdeleteorderapi');
    config.IOrderExpress = config.createInterfaceUrl('yunlibaoapi');
    config.IOrderPay = config.createInterfaceUrl('sendgoodspayordersapi');
    config.IPublishOrder = config.createInterfaceUrl('sendgoodsapi');
    config.ISaveRoute = config.createInterfaceUrl('savelineapi');
    config.IAccountInfo = config.createInterfaceUrl('bandcashoutaccountapi');
    config.ICashMoney = config.createInterfaceUrl('withdrawapplyapi');
    config.IUpdateInfo = config.createInterfaceUrl('editmemberinfoapi');
    config.IUserInfo = config.createInterfaceUrl('membercenterapi');
    config.ICrrrierUserInfo = config.createInterfaceUrl('sendgoodsdrvinfoapi');
    config.IOrderMSg = config.createInterfaceUrl('messageapi');
    config.IAddOrderMSg = config.createInterfaceUrl('newmessageapi');
    config.IConfrimPrice = config.createInterfaceUrl('sendgoodsordercpapi');
    config.IExpressCount = config.createInterfaceUrl('logistictrackcount');
    config.IConfrimGood = config.createInterfaceUrl('sendgoodsconfirmloadapi');//确认收货
    config.ICommentTags = config.createInterfaceUrl('appraisetagapi');
    config.IComment = config.createInterfaceUrl('saveappraiseapi');
    config.IConfirmGoodImg = config.createInterfaceUrl('uploaddrvloadimg');
    config.IQR = config.createInterfaceUrl('unipay/webwechatapi');//微信支付二维码
    config.IGetPayResult = config.createInterfaceUrl('unipay/AcpQueryDeal');//定时获取支付结果API
    config.IWantPrice=config.createInterfaceUrl('wantpriceapi');//账户余额

    /**
     * 招聘管理
     */
    config.IRecruitSave=config.createInterfaceUrl('recruitsaveapi');//我要招人
    config.IMyrecruit=config.createInterfaceUrl('myrecruitapi');//我的招聘列表
    config.IRecruitDetail=config.createInterfaceUrl('recruitdetailapi');//招聘详情
    config.IRecruitUpdateapi=config.createInterfaceUrl('recruitupdateapi');//修改招聘信息
    config.IRecruitDeleteapi=config.createInterfaceUrl('recruitdeleteapi');//删除招聘信息

    /**
     * 车辆管理
     */
    config.IOldCarSave=config.createInterfaceUrl('oldcarsaveapi');//我要卖车
    config.IMyOldCar=config.createInterfaceUrl('myoldcarapi');//我的卖车列表
    config.IOldCarDetail=config.createInterfaceUrl('oldcardetailapi');//卖车详情
    config.IOldCarUpdate=config.createInterfaceUrl('oldcarupdateapi');//修改卖车信息
    config.IOldCarDelete=config.createInterfaceUrl('oldcardeleteapi');//删除卖车信息


    /**
     * 推荐物流公司
     */
    config.IGetOwnLogistics=config.createInterfaceUrl('getownlogisticsapi');//推荐物流公司列表
    config.IOwnLogisticsDetail = config.createInterfaceUrl('getlogisticsdetail');//获取物流公司详情

    /**
     * 推荐货源
     */
    config.IGetOwngoods=config.createInterfaceUrl('getowngoodsapi');//推荐货源
    config.IOwngoodsDetail = config.createInterfaceUrl('getgoodsdetail');//获取推荐货源详情
    
    /**
     * 推荐车源
     */
    config.IGetOwnDriver=config.createInterfaceUrl('getowndriverapi');//推荐车源
    config.IOwnDriverDetail = config.createInterfaceUrl('getdriverdetail');//获取推荐车源详情
    
    /**
     * 保险
     */
    config.IDrvInsurance=config.createInterfaceUrl('drvinsuranceapi');//保险信息查询
    config.IDrvInsuranceUpdate = config.createInterfaceUrl('drvinsuranceupdateapi');//修改保险信息
    config.IDrvInsuranceSave = config.createInterfaceUrl('drvinsurancesaveapi');//新增保险信息
    
    /**
     * 发票
     */
    config.IInvoiceUpdate = config.createInterfaceUrl('invoiceupdateapi');//修改发票信息
    config.IInvoiceSave = config.createInterfaceUrl('invoicesaveapi');//新增发票信息
    config.IInvoiceDrvconFirm = config.createInterfaceUrl('invoicedrvconfirmapi');//承运人确认发票
    
    /**
     * 回单回寄
     */
    config.IDrvreceipt = config.createInterfaceUrl('drvreceiptapi');//回单回寄

    /**
     * 招投标
     */
    config.ITenderSave = config.createInterfaceUrl('tendersaveapi');//发布标书
    config.IMyTenderList = config.createInterfaceUrl('mytenderlistapi');//我的招标列表
    config.IMyTenderDetail = config.createInterfaceUrl('mytenderdetailapi');//我的招标详情
    config.IMyBidInfoList = config.createInterfaceUrl('mybidinfolistapi');//我的竞标列表
    config.IBidInfoDetail = config.createInterfaceUrl('bidinfodetailapi');//我的竞标详情
    config.IGetTenderResul = config.createInterfaceUrl('gettenderresultapi');//计算竞标结果
    config.ISumitTenderResult = config.createInterfaceUrl('sumittenderresultapi');//提交招标结果
    config.ITendOver = config.createInterfaceUrl('tendoverapi');//流标
    config.Itendbiddeleteapi = config.createInterfaceUrl('tendbiddeleteapi');//废标
    


    /**
     * 贷款
     */
    config.ILoanSave = config.createInterfaceUrl('loansaveapi');//申请贷款
    config.ILoanList = config.createInterfaceUrl('loanlistapi');//贷款列表
    config.ILoanUpdate = config.createInterfaceUrl('loanupdateapi');//修改贷款
    config.ILoanDetail = config.createInterfaceUrl('loandetailapi');//贷款详情
    config.ILoanDelete = config.createInterfaceUrl('loandeleteapi');//删除贷款

    /**
     * 承运人
     */
    config.Isendgoodsdrvinfoapi = config.createInterfaceUrl('sendgoodsdrvinfoapi');//列表
    config.Isendgoodsdrvinfoupdateapi = config.createInterfaceUrl('sendgoodsdrvinfoupdateapi');//修改
    config.Isendgoodsdrvinfosaveapi = config.createInterfaceUrl('sendgoodsdrvinfosaveapi');//新增
    
    //附近 物流公司列表
    config.Igetnearbylogistics= config.createInterfaceUrl('getnearbylogistics');    


    /**
     * page
     */
    config.POrderDetail = config.createPageUrl('my','order','order-detail');
    config.PGoodOrderDetail = config.createPageUrl('my','order','good-detail');
    config.POrderExpress = config.createPageUrl('my','order','order-express');
    config.POrderPay = config.createPageUrl('my','order','order-pay');
    config.POrderCarrier = config.createPageUrl('my','order','order-carrier');
    config.PConfirmGoodImg = config.createPageUrl('my','order','order-confirmimg');
    config.POrderPriceComment = config.createPageUrl('my','order','order-price-comment');


    //培训平台
    config.TrainingGetPlatformList= config.createInterfaceUrl('TrainingGetPlatformListApi');
    //获取相关证件
    config.TrainingGetDocuments= config.createInterfaceUrl('TrainingGetDocumentsApi');
    //图片上传
    config.TrainingUploadImg= config.createInterfaceUrl('TrainingUploadImgApi');

    //培訓資料
    config.TrainingGetVideo= config.createInterfaceUrl('TrainingGetVideoApi');
    config.dictenum= config.createInterfaceUrl('dictenumapi');

    //考试
    config.TrainingGetExamQuestions= config.createInterfaceUrl('TrainingGetExamQuestionsApi');  //试卷生成接口
    config.TrainingTitleSubmitted= config.createInterfaceUrl('TrainingTitleSubmittedApi');  //试卷题目提交
    config.TrainingConfirm= config.createInterfaceUrl('TrainingConfirm');  //提交认证确认接口
    config.TrainingExamCheck= config.createInterfaceUrl('TrainingExamCheckApi');  //考试检查
    config.TrainingFinishedConfirm= config.createInterfaceUrl('TrainingFinishedConfirmApi');  //考试完成确认接口
    config.TrainingPayment= config.createInterfaceUrl('TrainingPaymentApi');  //支付
    config.TrainingGetQualification= config.createInterfaceUrl('TrainingGetQualificationApi');//获取认证信息列表



    return config;


});
