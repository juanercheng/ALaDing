/**
 * Created by haner on 15/5/22.
 */
define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js'),
        us = require('UserService'),
        Tools = require('tools');

    require('common');
    require('star');

    var id = Tools.getQueryValue('id'),
        oldData={};

    if (!id) return;

    Ajax.detail({
        url: config.IGetTenderDetail,
        data: {
            tenderId:id
        }
    },function(res){
        oldData=res.data;
        addtenderLine(oldData.tenderLine);
        $(".money").val(oldData.tenderAmount);
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
        if(oldData.tenderStatus!=config.types.tenderbidenum.beginbid){
            alert("此招标信息已结束");
            return false;
        }

        return true;
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
            html.push("</tr>");
        }
        $("#tenderLine tbody").append(html.join(""));
    }

    function downLoad(data,_id){
        Ajax.submit({
            url:config.IDownLoadTenderDoc,
            data:{
                tenderId:id,
                isNotic:_id=="notice",
                isDoc:_id=="bidDoc"
            }
        },function(res){
            if(res){
                if(res.status!='0000'){
                    alert(res.resultmsg ||"服务器错误,请稍后再试");
                }else{
                    $("#openDownLoad").attr("action",data).submit();
                }
            }else{
                alert("服务器错误,请稍后再试");
            }
        });
    }

    $("#data-detail").on("click","#downloadNotic,#downloadDoc",function(){
        var _id=this.id=="downloadNotic"?"notice":"bidDoc";

        if(isLogin()){
            Ajax.submit({
                url:config.IGetTenderIsBuy,
                data:{
                    tenderId:id
                }
            },function(res){
                if(res){
                    if(res.status!='0000'){
                        alert(res.resultmsg ||"服务器错误,请稍后再试");
                    }
                    if(res.data.money=="false"){
                        $(".dialogbg").show();
                        $(".dialog").show();
                        return;
                    }
                    if(res.data[_id]){
                        downLoad(res.data[_id],_id);
                    }else{
                        //已经下载过了，想再次下载
                        alert("您已经下载过该文件了,如文件丢失请联系客服");
                    }

                }else{
                    alert("服务器错误,请稍后再试");
                }
            });
        }
        return false;
    });



    /************付款*********/
    $(".cannel").on('click',function(){
        $(".dialogbg").hide();
        $(".dialog").hide();
    });

    var d=new Date();
    $(".money_btn").on('click',function(){
        var money=$(".money").val(),
            password=$(".dialog .password input").val();

        if(!password){
            alert("请输入付款密码");
            return;
        }

        if(/^[1-9][0-9]*$|^[0-9]+\.[0-9]{1}$|^0$/.test(money)){
            if(confirm("本次付款金额为:"+money+"元,确认付款？")){
                var submitdata = {
                    money:money,
                    password:password,
                    tenderId:id
                };
                submitdata.guid = d.getTime();

                Ajax.submit({
                    url:config.IPayTender,
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
    
    /********竞标*******/
    $("#data-detail").on("click",".btn_Bid",function(){
        if(isLogin()){
            Ajax.submit({
                url:config.IGetTenderIsBuy,
                data:{
                    tenderId:id
                }
            },function(res){
                if(res){
                    if(res.status!='0000'){
                        alert(res.resultmsg ||"服务器错误,请稍后再试");
                    }
                    if(res.data.money=="true"){
                        window.location.href="tenders-bid.html?id="+id;
                    }else if(res.data.money=="false"){
                        $(".dialogbg").show();
                        $(".dialog").show();
                        return;
                    }
                }else{
                    alert("服务器错误,请稍后再试");
                }
            });
        }
    });
});