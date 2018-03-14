/**
 * Created by haner on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config'),
        us = require('UserService'),
        Tools = require('tools');

    require('fileupload');
    require('common');
    require('validform');
    //require('pca');

    var id=Tools.getQueryValue('id'),
        oldData={};



    /**
     * submit
     */
    var d = new Date();
    $('#publish-order').on('valid.form',function(e,f){
        var data = Tools.formJson('#publish-order');

        data.loanId=id;
        
        data.guid = d.getTime();

        Ajax.submit({
            url:config.ILoanUpdate,
            data:data
        },function(res){
            alert(res.resultmsg || '保存失败！');
            if(res.status === '0000'){
                location.replace(location);
            }
        });

        return false;
    });

    $("#delete_btn").click(function(){

        if(confirm("确认删除?")){
            var data = { loanId:id};
            
            data.guid = d.getTime();

            Ajax.submit({
                url:config.ILoanDelete,
                data:data
            },function(res){
                alert(res.resultmsg || '保存失败！');
                if(res.status === '0000'){
                    window.location.href="my-loan.html";
                }
            });
        }

        return false;
    });

    /**
     * 文件上传
     */
    var flag=setInterval(function(){
        if($.fn.fileupload){
            clearInterval(flag);
            $('input[type="file"]').fileupload({
                url: config.imageServer,
                dataType: "JSON",
                acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
                maxFileSize: 5000000,
                done: function (e, data) {
                    $(this).prev().attr('src', data.result.data.picUrl);
                    $(this).next().val(data.result.data.picUrl);
                },
                process: function (e, data) {
                    for (var i = 0, l = data.processQueue.length; i < l; i++) {
                        if (data.processQueue[i].action == 'validate') {
                            data.messages.acceptFileTypes = '上传文件格式不支持.';
                        }
                    }
                    data.messages.maxFileSize = '上传文件太大，限制' + data.maxFileSize / 1000 + 'K以内.';
                },
                processalways: function (e, data) {
                    var index = data.index,
                        file = data.files[index];
                    if (file.error) {
                        alert(file.error);
                    }
                },
                fail: function (e) {
                }
            });
        }
    },300);

    var _interface = [{
        url: config.IDictionary, 
        data: {
            dictionaryCode: config.types.loan.loanmoneyenum
        },
        renderFor: 'loanmoneyenum-tmpl',
        renderEle: '#loanMoney',
        callback:function(){
            $('#loanMoney').val(oldData.loanMoney);
            btnsOperate();
        }
    }];


    /**
     * 发起请求
     */

    function init(){

        Ajax.pageRequest({
            url: config.ILoanDetail,
            data: {
                loanId: id
            }
        }, function (data) {
            oldData=data.data;
            /**
             * 详情数据
             */
             
            $('#publish-order').find("[name]").each(function(){
                $(this).val(oldData[$(this).attr("name")]);
            });

            $('#publish-order').find("[type='file']").each(function(){
                var n=$(this).next().attr("name");
                $(this).prev().attr("src",oldData[n]);
            });

            for (var i in _interface) {
                Ajax.pageRequest(_interface[i],_interface[i].callback);
            }
            btnsOperate();

        });
    }
    init();

    var count=0;
    var btnsOperate=function(){
        if(++count>=2){
            if(oldData){
                //贷款的审核中和审核失败的可以删除和修改
                if(oldData.loanStatus == 'submitted' || oldData.loanStatus == "failed"){
                    $(".save_btn").removeClass("gray_btn");
                    $(".statusControl").show();
                }
            }
        }
    }


    function utext(){/*   如需更详细内容，请咨询客服，电话：400668-7227
            */}
    $("#userprotocol").html(utext.toString().replace(/.*?\/\*/,"").replace(/\*\/\}/,""));
});
