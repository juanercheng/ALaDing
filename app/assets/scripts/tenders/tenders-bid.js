/**
 * Created by haner on 15/5/22.
 */
define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js'),
        us = require('UserService'),
        Tools = require('tools'),
        template = require('template');

    require('fileupload');
    require('common');
    require('validform');
    require('star');

    var id = Tools.getQueryValue('id'),
        oldData={};

    $("#a_detail").attr("href","tenders-detail.html?id="+id);

    if (!id) return;

    Ajax.detail({
        url: config.IGetTenderDetail,
        data: {
            tenderId:id
        }
    },function(res){
        oldData=res.data;

        setTimeout(function(){
            initSubmit();
        },500);
            
        //获取我要竞标数据
        Ajax.submit({
            url:config.IWantBid,
            data:{
                tenderId:id
            }
        },function(res){
            if(res){
                if(res.status!='0000'){
                    alert(res.resultmsg ||"服务器错误,请稍后再试");
                }else{
                    renderList(res.data.tenderBasic);
                    addtenderLine(res.data.tenderLine);
                }
            }else{
                alert("服务器错误,请稍后再试");
            }
        });
    });

    function isLogin(){
        var flag=us.isLogin();
        if(!flag){
            alert("您当前未登陆,请登录后下载");
            return false;
        }
        if(us.getUserId()==oldData.createBy){
            alert("此招标信息为您自己所发布,不允许参与竞标");
            return false;
        }

        return true;
    }

    function renderList(data){
       var result = template.render("list-tmpl", {'list':data});
        $("#bidPhone").after(result);
    }

    function addtenderLine(data){
        var html=[];
        for(var i=0;i<data.length;i++){
            html.push("<tr>");
                html.push("<td>"+data[i].fromAdd+"</td>");
                html.push("<td>"+data[i].toAdd+"</td>");
                html.push("<td>"+data[i].goodName+"</td>");
                html.push("<td>"+data[i].nowPrice+"</td>");
                html.push("<td>"+data[i].load+"吨/"+data[i].unit+"</td>");
                html.push("<td>"+data[i].remark+"</td>");
                html.push("<td><input data-id='"+data[i].tenLineId+"' maxlength='7' type='text' /></td>");
            html.push("</tr>");
        }
        $("#tenderLine tbody").append(html.join(""));
    }
    
    /**
     * 竞标
     */
    var d = new Date();
    function initSubmit(){
        $('#publish-order').on('valid.form',function(e,f){
            if(isLogin()){
                var data = Tools.formJson('#publish-order'),
                    basicIds=[],
                    tenderLine=[];

                data.tenderId=id;

                $("#tenderLine tbody tr input").each(function(i){
                    if(/^[1-9][0-9]*$|^[0-9]+\.[0-9]{1}$/.test(this.value)){
                        tenderLine.push({tenLineId:$(this).attr("data-id"),price:this.value});
                    }else{
                        tenderLine=[];
                        alert("请输入正确的报价:第"+(i+1)+"条技术线路");
                        return false;
                    }
                });
                if(!tenderLine.length){
                    return;
                }

                $('#publish-order').find("select").each(function(){
                    basicIds.push(this.value);
                });

                data.basicIds=basicIds.join(",");
                
                data.guid = d.getTime();

                data.tenderLine=JSON.stringify(tenderLine);

                Ajax.submit({
                    url:config.IBidInfoSave,
                    data:data
                },function(res){
                    alert(res.resultmsg || '保存失败！');
                    if(res.status === '0000'){
                        window.location.href=$("#a_detail").attr("href");
                    }
                });
            }
            return false;
        });
    }


    /**
     * 文件上传
     */
    var flag=setInterval(function(){
        if($.fn.fileupload){
            clearInterval(flag);
            $('input.remitterBill[type="file"]').fileupload({
                url: config.imageServer,
                dataType: "JSON",
                acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
                maxFileSize: 5000000,
                done: function (e, data) {
                    if(data.result.status=="0000"){
                        $(this).prev().attr('src', data.result.data.picUrl);
                        $(this).next().val(data.result.data.picUrl);
                        alert("上传文件成功");
                    }else{
                        alert(data.result.resultmsg || "上传文件失败");
                    }
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
            $('input.bidDoc[type="file"]').fileupload({
                url: config.fileServer,
                dataType: "JSON",
                acceptFileTypes: /(\.|\/)(doc|docx)$/i,
                maxFileSize: 5000000,
                done: function (e, data) {
                    if(data.result.status=="0000"){
                        $(this).prev().attr('src', "../../assets/image/word.png");
                        $(this).next().val(data.result.data.fileUrl);
                        alert("上传文件成功");
                    }else{
                        alert(data.result.resultmsg || "上传文件失败");
                    }
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
                    alert(e.messages);
                }
            });
        }
    },300);
});