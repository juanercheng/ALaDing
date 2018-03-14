/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js');

    require('star');

    var myPriceList=[];
    var d = new Date();

    /**
     * 获取我的报价
     */
    config.pageRequest = function () {
        Ajax.pageRequest({
            url: config.IMyPrice,
            data: {
                orderState: $('#state').val()
            }
        },function(data){
            if(data){
                myPriceList=data.data;
                $('#count').text('共'+ (data.totalcount || 0 )+'条');
            }
        });
    };
    config.pageRequest();

    /**
     * 状态类型
     */
    Ajax.custom({
        url: config.IDictionary,
        data: {
            dictionaryCode: config.types.dicType.orderstateenum
        },
        renderType: Ajax.renderType.list,
        renderEle: '#state',
        renderFor: 'state-tmpl'
    });


    /**
     * 筛选
     */
    $('#state').on('change', function () {
        config.begin = 1;
        config.pageRequest();
    });


    /**
     * 查看详情
     */
    $('#data-list').on('click', 'p[data-id]', function () {
        location.href = config.PGoodOrderDetail + '?id=' + $(this).attr('data-id') + '&cb=' + $(this).attr('data-cb');
    });

    /**
     * 去评价
     */
    $('#data-list').on('click','button.comment',function(e){
        e.preventDefault();
        location.href = config.POrderPriceComment  +'?id=' + $(this).attr('data-id');
    });
    /**
     * 消息
     */
    $('#data-list').on('click','button.msg',function(e){
        e.preventDefault();
        location.href = config.POrderMsg  +'?id=' + $(this).attr('data-id');
    });

    /**
     * 取消报价
     */
    $('#data-list').on('click','button.cancel',function(e){
        e.preventDefault();
        if(!confirm('确认取消报价？')) return;
        $(this).attr('disable',true);
        var _this = $(this);
        Ajax.submit({
            url:config.ICancelPrice,
            data:{
                goodId:_this.attr('data-id')
            }
        },function(){
            _this.attr('disable',false);
            config.pageRequest();
            if(res.status === '0000'){
                alert(res.resultmsg);
            }
        },function(){
            _this.attr('disable',false);
        });
    });

    /**
     * 悔单
     */
    $('#data-list').on('click','button.back',function(e){
        e.preventDefault();
        if(!confirm('确认悔单？')) return;
        $(this).attr('disable',true);
        var _this = $(this);
        Ajax.submit({
            url:config.IOrderPriceBack,
            data:{
                goodId:_this.attr('data-id'),
                sendGoodMemberId:_this.attr('data-sb')
            }
        },function(res){
            _this.attr('disable',false);
            config.pageRequest();
            if(res.status === '0000'){
                alert(res.resultmsg);
            }
        },function(){
            _this.attr('disable',false);
        });
    });

    /**
     * 上传照片
     */
    $('#data-list').on('click','button.uploadimg',function(e){
        e.preventDefault();
        location.href = config.PConfirmGoodImg  +'?id=' + $(this).attr('data-id');
    });

    /**
     * 确认发票
     */
    $('#data-list').on('click','.confirm-invoice',function(e){
        e.preventDefault();

        var index=~~$(this).attr("data-index");
        var data=encodeURI(JSON.stringify(myPriceList[index]));

        location.href ='confirminvoice/my-price-confirminvoice.html?data=' + data;
    });

    /**
     * 付款
     */
     var _paymentData={};
    $('#data-list').on('click','.confirm-payment',function(e){
        e.preventDefault();

        var index=~~$(this).attr("data-index");
        _paymentData=myPriceList[index];

        $(".dialogbg").show();
        $(".dialog").show();
    });

    $(".cannel").on('click',function(){
        $(".dialogbg").hide();
        $(".dialog").hide();
    });

    $(".money_btn").on('click',function(){
        var money=$(".money").val(),
            password=$(".dialog .password input").val();

        if(/^[1-9][0-9]*$|^[0-9]+\.[0-9]{1}$/.test(money)){
            if(confirm("本次付款金额为:"+money+"元,确认付款？")){
                var submitdata = {
                    money:money,
                    password:password,
                    goodId:_paymentData.goodId
                };
                submitdata.guid = d.getTime();

                Ajax.submit({
                    url:config.IOrderPay,
                    data:submitdata
                },function(res){
                    alert(res.resultmsg || '保存失败！');
                    if(res.status === '0000'){
                        d = new Date();
                        
                        $(".dialogbg").hide();
                        $(".dialog").hide();
                    }
                });
            }
        }else{
            alert("请输入正确的付款金额");
        }
        
    });


    /**
     * 回单回寄
     */
    $('#data-list').on('click','.drvreceipt',function(e){
        e.preventDefault();

        var index=~~$(this).attr("data-index");
        var data=myPriceList[index];

        location.href ='drvreceipt/my-price-drvreceipt.html?goodId=' + data.goodId;
    });


});