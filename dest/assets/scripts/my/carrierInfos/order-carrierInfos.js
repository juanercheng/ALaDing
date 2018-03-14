/**
 * Created by haner on 15/5/22.
 */
define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config.js'),
        Tools = require('tools');

    require('star');
    require('common');
    require('validform');
   // require('pca');

    var data = Tools.getQueryValue('data');
    var _data=JSON.parse(data);

    $("#order-detail").attr("href",$("#order-detail").attr("href")+"?id="+_data.id+"&s="+_data.s);
    $("[name='goodId']").val(_data.id);

/*
    if(_data&&_data.drvCellPhone&&_data.drvReallyName){
        $(".o-save-carrier").hide();
        $("[name='drvReallyName']").val(_data.drvReallyName);
        $("[name='drvCellPhone']").val(_data.drvCellPhone);
    }else{
        $(".o-save-carrier").show();
    }
    */

    var dataList=[];


    /**
     * 获取列表
     */
    config.pageRequest = function(){
        
        Ajax.pageRequest({
            url : config.Isendgoodsdrvinfoapi,
            data:{
                goodId:_data.id
            }
        },function(data){
            if(data&&data.data){
                dataList=data.data;
                $('#count1').text('共'+(data.data.length || 0) + '条');
                
                if(_data.orderState==config.orderType.issure){
                    //修改保险
                    $('#data-list [data-id]').show();
                }
            }

        },function(){
            $('#count1').text('共0条');
        });
    };

    config.pageRequest();

    //已确认状态才可以新增
    if(_data.orderState==config.orderType.issure){
        //新增
        $(".o-invoice").show().on('click',function(e){

            location.href = 'order-carrierInfos-add.html?data='+JSON.stringify(_data);
            return false;
        });
    }

    //修改保险
    $('#data-list').on('click','.update[data-id]',function(e){
        e.preventDefault();
            var index=~~$(this).attr("data-index");
        

        var insurance=encodeURI(JSON.stringify(dataList[index]));

        if(insurance){
            location.href = 'order-carrierInfos-update.html?data='+JSON.stringify(_data)+"&insurance="+insurance;
        }

        return false;
    });

    //物流追踪
    $('#data-list').on('click','.wuliu[data-id]',function(e){
        e.preventDefault();
            var index=~~$(this).attr("data-index");
        

        //var insurance=encodeURI(JSON.stringify(dataList[index]));
        var drvCellPhone=dataList[index].drvCellPhone;
        /**
         * 获取次数
         * @type {string}
         */
        Ajax.detail({
            url:config.IExpressCount,
            data:{
                goodId:_data.id
            }
        },function(res){
            if (res.status == '0000') {
                var useable = parseInt(res.data.useCount) || 0,
                    count = parseInt(res.data.leftCount) || 5,
                    msg = '提示：已使用'+useable+'次，剩余' + (count) + '次机会，超过'+(useable+count)+'次后请电话联系，确认查看？';
                if (count > 0) {
                    if(confirm(msg)){
                        location.href = config.POrderExpress + '?data='+JSON.stringify(_data)+"&drvCellPhone="+drvCellPhone;
                    }
                }else{
                    alert('您已超过15次免费查询，请电话联系承运人');
                }
            } else {
                alert(res.resultmsg || 'error!');
            }
        });

        return false;
    });

});