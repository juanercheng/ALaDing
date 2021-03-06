/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config.js'),
        Tools = require('tools'),
        template = require('template');

    require('star');


    var id = Tools.getQueryValue('id'),
        state = Tools.getQueryValue('s');
    if (!id)return;
   

    /**
     * 数据获取
     */
    config.pageRequest = function () {
        Ajax.pageRequest({
            url: config.IOldCarDetail,
            data: {
                oldcarId: id
            }
        }, function (data) {
            /**
             * 详情数据
             */
            data.data.drvLicenseImg=function(){
                if(/\/$/.test(data.data.drvLicenseImg)){
                    return "";
                }
                return data.data.drvLicenseImg;
            }();

            data.data.buyTime=data.data.buyTime.substring(0,10);

             $('#order-detail').html(template.render('order-detail-tmpl',{list:data.data || {}}));
            
             btnsOperate();

        });
    };

    config.pageRequest();
    /**
     * 按钮操作
     */
    function btnsOperate(){
        //修改
        $('.o-pay').on('click',function(){
            location.href ='my-car-update.html?id=' + id;
        }).show();

        //删除
        $('.o-msg').on('click',function(){
            if(confirm("确定要删除此卖车信息吗？")){
                Ajax.pageRequest({
                    url: config.IOldCarDelete,
                    data: {
                        oldcarId: id
                    }
                }, function (data) {
                    if(data.status=="0000"){
                        alert(data.resultmsg || "删除成功");
                        window.location.href="my-car.html";
                    }else{
                        alert(data.resultmsg || "删除失败");
                    }
                });
            }
        }).show();
    }
});