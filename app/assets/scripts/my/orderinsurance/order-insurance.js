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

    if(_data&&_data.drvCellPhone&&_data.drvReallyName){
        $(".o-save-carrier").hide();
        $("[name='drvReallyName']").val(_data.drvReallyName);
        $("[name='drvCellPhone']").val(_data.drvCellPhone);
    }else{
        $(".o-save-carrier").show();
    }

    var dataList=[];


    /**
     * 获取货源列表
     */
    config.pageRequest = function(){
        
        Ajax.pageRequest({
            url : config.IDrvInsurance,
            data:{
                goodId:_data.id
            }
        },function(data){
            if(data&&data.data){
                dataList=data.data;
                $('#count1').text('共'+(data.data.length || 0) + '条');
                
                //if(_data.orderState==config.orderType.issure){
                    //修改保险
                    $('#data-list [data-id]').show();
                //}
            }

        },function(){
            $('#count1').text('共0条');
        });
    };

    config.pageRequest();



    //保存承运人
    $("#save-carrier").on('valid.form',function(e,f){

        var data = Tools.formJson('#save-carrier');
        Ajax.submit({
            url: config.ICrrrierUserInfo,
            data: data
        },function(res){
            if(!res){return;}
            if(res.status=="0000"){
                $(".o-save-carrier").off().hide();
            }
            alert(res.resultmsg ||'error!');
        });

        return false;
    });

    //已确认状态才可以新增和更改保险
    if(_data.orderState==config.orderType.issure){
        //新增保险
        $(".o-invoice").show().on('click',function(e){
            _data.drvReallyName=encodeURI($("[name='drvReallyName']").val());
            _data.drvCellPhone=$("[name='drvCellPhone']").val();

            location.href = 'order-insurance-add.html?data='+JSON.stringify(_data);
            return false;
        });
    }

    if(_data.orderState==config.orderType.issure){
        //修改保险
        $('#data-list').on('click','[data-id]',function(e){
            e.preventDefault();
                var index=~~$(this).attr("data-index");
            _data.drvReallyName=encodeURI($("[name='drvReallyName']").val());
            _data.drvCellPhone=$("[name='drvCellPhone']").val();

            var insurance=encodeURI(JSON.stringify(dataList[index]));

            if(insurance){
                location.href = 'order-insurance-update.html?data='+JSON.stringify(_data)+"&insurance="+insurance;
            }

            return false;
        });
    }
});