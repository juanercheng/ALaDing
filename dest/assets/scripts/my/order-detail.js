/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js'),
        Tools = require('tools'),
        template = require('template');

    require('star');


    var id = Tools.getQueryValue('id'),
        state = Tools.getQueryValue('s');
    if (!id || !state)return;
    var orderDetail;

    /**
     * 数据获取
     */
    config.pageRequest = function () {
        Ajax.pageRequest({
            url: config.IOrderDetail,
            key:'goodPrice',
            data: {
                orderState: state,
                goodId: id
            }
        }, function (data) {
            /**
             * 订单详情数据
             */
            if(orderDetail) return;

            orderDetail=data.data.orderDetail;

            $('#order-detail').html(template.render('order-detail-tmpl',data.data.orderDetail || {}));
            $('#count').text('已报价'+data.totalcount+'人');
            $('#operate').attr('data-id', data.data.orderDetail.goodId).attr('data-cb', data.data.orderDetail.createBy);

            state = data.data.orderDetail.orderState || state;

            btnShowOrHide(data.data.orderDetail.orderState || state,data.data.orderDetail.isHaveDrv || 'false');

            btnsOperate();

            if (state === 'beginquoted') {
                /**
                 * 确认报价
                 */
                $('.order_price').on('click', function () {

                    if ($(this).hasClass('active')) {
                        return;
                    }
                    $('.panelcp,.panel-bgcp').show();
                    $('#confrim-ordercp input[name="goodId"]').text($(this).attr('data-gid'));
                    $('#confrim-ordercp input[name="carrierId"]').text($(this).attr('data-cid'));
                    $('#confrim-ordercp input[name="gpriceid"]').text($(this).attr('data-pid'));
                    if (data.data.orderDetail.goodType == "loadgood") {
                        $('#confrim-ordercp label[name="goodmsg"]').text("本次货物有" + data.data.orderDetail.weight + "吨，请与承运方协商一致后确认报价");
                    } else {
                        $('#confrim-ordercp label[name="goodmsg"]').text("本次货物有" + data.data.orderDetail.cubage + "立方米，请与承运方协商一致后确认报价");
                    }
                });

            } else {
                $('.order_price').addClass('active');
            }

        });
    };

    config.pageRequest();


    //确认报价
    $('.btn-okcp,.btn-cancelcp').click(function(e){
        e.preventDefault();
        if($(this).is('.btn-cancelcp')){
            $('.panelcp,.panel-bgcp').hide();
        }else{
            if(/^[1-9][0-9]*$|^[0-9]+\.[0-9]{1}$/.test($('input[name="loadMax"]').val())) {
                Ajax.submit({
                    url: config.IConfrimPrice,
                    data: {
                        goodId: $('input[name="goodId"]').text(),
                        carrierId: $('input[name="carrierId"]').text(),
                        goodPriceId: $('input[name="gpriceid"]').text(),
                        loadMax: $('input[name="loadMax"]').val()
                    }
                }, function (res) {
                    alert(res.resultmsg || 'error');
                    location.href = "/my/order/my-order.html";
                });
            }else{
                alert("请正确输入承运量");
            }
        }
    });
    /**
     * 按钮操作
     */
    function btnsOperate(){
        //付款
        $('.o-pay').on('click',function(){
            if ($(this).hasClass('active')) {
                return;
            }
            location.href = config.POrderPay + '?id=' + id;
        });

        //消息
        $('.o-msg').on('click',function(){
            if ($(this).hasClass('active')) {
                return;
            }
            location.href = config.POrderMsg + '?id=' + id;
        });

        //评价
        $('.o-com').on('click',function(){
            if ($(this).hasClass('active')) {
                return;
            }
            location.href = config.POrderComment + '?id=' + id;
        });

        //悔单
        $('.o-back').on('click', function (e) {
            e.preventDefault();
            if ($(this).hasClass('active')) {
                return;
            }
            if (!confirm('确认悔单？')) return;
            $(this).attr('disable', true);
            var _this = $(this);
            Ajax.submit({
                url: config.IOrderBack,
                data: {
                    goodId: _this.parent().attr('data-id'),
                    sendGoodMemberId: _this.parent().attr('data-cb')
                }
            }, function (res) {
                _this.attr('disable', false);
                if (res.status === '0000') {
                    alert(res.resultmsg);
                    location.href="/my/order/my-order.html";
                }else{
                    alert(res.resultmsg || 'error');
                }
            }, function () {
                _this.attr('disable', false);
            });
        });

        //承运人
        $('.o-express-p').on('click', function (e) {
            e.preventDefault();
            if ($(this).hasClass('active')) {
                return;
            }
            var data={
                    id:id,
                    s:orderDetail.orderState,
                    orderState:orderDetail.orderState
                };

            location.href = '/my/carrierInfos/order-carrierInfos.html?data='+JSON.stringify(data);
        });

        //物流追踪
        $('.o-express').on('click',function(e){
            e.preventDefault();
            if ($(this).hasClass('active')) {
                return;
            }

            /**
             * 获取次数
             * @type {string}
             */
            Ajax.detail({
                url:config.IExpressCount,
                data:{
                    goodId:id
                }
            },function(res){
                if (res.status == '0000') {
                    var useable = parseInt(res.data.useCount) || 0,
                        count = parseInt(res.data.leftCount) || 5,
                        msg = '提示：您有5次免费查看对方位置的机会，已使用'+useable+'次，剩余' + (count-useable) + '次机会，超过5次后请电话联系，确认查看？';
                    if (useable <= 5 && confirm(msg)) {
                        location.href = config.POrderExpress + '?id=' + id;
                    }else{
                        alert('您已超过5次免费查询，请电话联系承运人');
                    }
                } else {
                    alert(res.resultmsg || 'error!');
                }
            });
        });

        //确认收货
        $('.o-confirm').on('click',function(){
            if ($(this).hasClass('active')) {
                return;
            }
            $('.panel,.panel-bg').show();
            $('#confrim-order input[name="goodId"]').val($('#operate').attr('data-id'));
            $('#confrim-order input[name="carrierId"]').val($('#operate').attr('data-cb'));
        });

        if(config.orderType.beginquoted!=orderDetail.orderState){
            //保险
            $('.o-insurance').removeClass("active").on('click', function (e) {
                e.preventDefault();
                if ($(this).hasClass('active')) {
                    return;
                }
                var data={
                    id:id,
                    s:state,
                    drvCellPhone:orderDetail.drvCellPhone,
                    drvReallyName:encodeURI(orderDetail.drvReallyName),
                    orderState:orderDetail.orderState
                };
                location.href = '../orderinsurance/order-insurance.html?data='+JSON.stringify(data);
            });
        }

        //申请发票
        if((!orderDetail.invoiceId) && (config.orderType.beginquoted!=orderDetail.orderState)){
            $('.o-invoice').removeClass("active").on('click', function (e) {
                location.href = '../orderinvoice/order-invoice-add.html?id=' + id+"&s="+state;
            });
        }

        var allowInvoiceUpdateStatus = function(v){
            return v == config.types.invoiceStatus.submitted || v == config.types.invoiceStatus.failed;
        };

        //修改发票
        if(allowInvoiceUpdateStatus(orderDetail.invoiceStatus)){
            $(".o-update-invoice").removeClass("active").click(function(e){
                e.preventDefault();
                if ($(this).hasClass('active')) {
                    return;
                }

                var invoice={
                    goodId:orderDetail.goodId,
                    invoiceId:orderDetail.invoiceId,
                    drvCompany:orderDetail.drvCompany,
                    drvTaxNum:orderDetail.drvTaxNum,
                    drvBankNum:orderDetail.drvBankNum,
                    drvBank:orderDetail.drvBank,
                    drvAdd:orderDetail.drvAdd,
                    drvCellPhone:orderDetail.drvCellPhone,

                    goodCompany:orderDetail.goodCompany,
                    goodTaxNum:orderDetail.goodTaxNum,
                    goodBank:orderDetail.goodBank,
                    goodCellPhone:orderDetail.goodCellPhone,
                    goodAdd:orderDetail.goodAdd,
                    goodBankNum:orderDetail.goodBankNum,
                    
                    unitPrice:orderDetail.unitPrice,
                    quantity:orderDetail.quantity,
                    unit:orderDetail.unit,
                    tax:orderDetail.tax,


                    invoiceName:orderDetail.invoiceName,
                    specificationType:orderDetail.specificationType,
                    money:orderDetail.money
                };
                invoice=encodeURI(JSON.stringify(invoice));

                location.href = '../orderinvoice/order-invoice-update.html?id=' + id+"&s="+state+"&invoice="+invoice;
            });
        }
    }

    //确认收货
    $('.btn-ok,.btn-cancel').click(function(e){
        e.preventDefault();
        if($(this).is('.btn-cancel')){
            $('.panel,.panel-bg').hide();
        }else{
            Ajax.submit({
                url: config.IConfrimGood,
                data: Tools.formJson('#confrim-order')
            }, function (res) {
                if (res.status === '0000') {
                    alert(res.resultmsg);
                    location.href="/my/order/my-order.html";
                }else{
                    alert(res.resultmsg || 'error');
                }
            });
        }
    });

    /**
     * 按钮控制
     */

    function btnShowOrHide(status,haveDri){

        switch (status){
            case config.orderType.issure :
                $('.o-pay,.o-msg,.o-express,.o-back,.o-confirm').removeClass('active');
                if(haveDri=='false'){
                    $('.o-express-p').removeClass('active');
                }
                break;
            case config.orderType.beginquoted :
                $('.o-back').removeClass('active');
                break;
            case config.orderType.completed :
                $('.o-com,.o-msg').removeClass('active');
                break;
            case config.orderType.failure :
                $('.o-com').removeClass('active');
                break;
        }
    }
});