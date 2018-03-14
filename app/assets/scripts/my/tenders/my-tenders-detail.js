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
        oldDeatil;

    if (!id)return;
   

    /**
     * 数据获取
     */
    config.pageRequest = function () {
        Ajax.pageRequest({
            url: config.IMyTenderDetail,
            data: {
                tenderId: id
            }
        }, function (data) {

            oldDeatil=data.data;
             $('#order-detail').html(template.render('order-detail-tmpl',{list:data.data || {}}));
             
             if(oldDeatil.lineInfoList.length){
                randertenderLine(oldDeatil.lineInfoList[0].tenLineId);
             }

             setTimeout(btnsOperate,300);

        });
    };

    config.pageRequest();

    var bidrankenumHtml=function(rank,id){
        var _html=['<select bidLineId="'+id+'">'],
            getName={
                four:"竞标失败",
                first:"第一名",
                second:"第二名",
                third:"第三名",
                tendover:"流标"
            };
        if(rank){
            _html=[getName[rank]];
        }else{
            for(var t in config.types.bidrankenum){
                _html.push("<option"+(rank==t?" selected='selected'":"")+" value='"+t+"'>"+getName[t]+"</option>")
            }    
            _html.push("</select>");
        }
        return _html.join("");
    };
    
    function randertenderLine(tenLineId){
        var html=[];
        
        for(var i=0;i<oldDeatil.lineInfoList.length;i++){
            if(oldDeatil.lineInfoList[i].tenLineId==tenLineId){
                var bidLineList=oldDeatil.lineInfoList[i].bidLineList;
                for(var j=0;j<bidLineList.length;j++){
                    html.push("<tr>");
                        html.push("<td><a href='my-tenders-detail-bidcompany.html?tenderId="+id+"&id="+bidLineList[j].bidId+"'>"+bidLineList[j].companyName+"</a></td>");
                        html.push("<td>"+bidLineList[j].price+"</td>");
                        html.push("<td>"+bidLineList[j].techScore+"</td>");

                        if(bidLineList[j].isRed=="true"){
                            html.push("<td class='red'>"+bidLineList[j].lineScore+"</td>");
                        }else{
                            html.push("<td>"+bidLineList[j].lineScore+"</td>");
                        }

                        html.push("<td>"+bidLineList[j].totalScore+"</td>");
                        html.push("<td>"+bidrankenumHtml(bidLineList[j].rank,bidLineList[j].bidLineId)+"</td>");

                        if(bidLineList[j].rank){
                            html.push('<td></td>');
                        }else{
                            html.push('<td><button bidLineId="'+bidLineList[j].bidLineId+'" class="gray_btn feibiao" style="display: inline-block;">废标</button></td>');
                        }
                    html.push("</tr>");
                }

                break;
            }
        }
        $("#tenderLine tbody").html("").append(html.join(""));
    }

    //线路选择
    $("#order-detail").on("change","#lineInfoList",function(){
        randertenderLine(this.value);
    });
    //o-auto-calc 自动计算得分
    $("#order-detail").on("click","#o-auto-calc",function(){
        
        //非竞标中状态不允许操作按钮
        if(oldDeatil.tenderStatus!=config.types.tenderbidenum.beginbid){
            alert("此招标已结束");
            return;
        }

        Ajax.submit({
            url:config.IGetTenderResul,
            data:{
                tenderId:id
            }
        },function(res){
            if(res){
                if(res.status!='0000'){
                    alert(res.resultmsg ||"服务器错误,请稍后再试");
                    return;
                }
                location.replace(location);
            }else{
                alert("服务器错误,请稍后再试");
            }
        });
    });

    /**
     * 按钮操作
     */
    function btnsOperate(){

        //非竞标中状态不允许操作按钮
        if(oldDeatil.tenderStatus!=config.types.tenderbidenum.beginbid){
            return;
        }

        //提交招标结果
        $('.o-pay').on('click',function(){
            if(!confirm("您确认提交该线路的中标人吗?")){ return; }
            var first=$("#tenderLine").find(":selected").filter("[value='first']").size(),
                second=$("#tenderLine").find(":selected").filter("[value='second']").size(),
                third=$("#tenderLine").find(":selected").filter("[value='third']").size();

            if(first>1){ alert("第一名只能选择一家"); return; }
            if(second>1){ alert("第二名只能选择一家"); return; }
            if(third>1){ alert("第三名只能选择一家"); return; }

            Ajax.submit({
                url:config.ISumitTenderResult,
                data:{
                    tenLineId:$("#lineInfoList").val(),
                    bidLineId1:$("#tenderLine").find(":selected").filter("[value='first']").parent().attr("bidLineId")||"",
                    bidLineId2:$("#tenderLine").find(":selected").filter("[value='second']").parent().attr("bidLineId")||"",
                    bidLineId3:$("#tenderLine").find(":selected").filter("[value='third']").parent().attr("bidLineId")||""
                }
            },function(res){
                if(res){
                    if(res.status!='0000'){
                        alert(res.resultmsg ||"服务器错误,请稍后再试");
                        return;
                    }
                    alert(res.resultmsg ||"保存线路中标人成功");
                    location.replace(location);
                }else{
                    alert("服务器错误,请稍后再试");
                }
            });

        }).show();

        //废标
        $('.o-msg').on('click',function(){
            if(!confirm("您确认该线路流标吗?")){ return; }

            Ajax.submit({
                url:config.ITendOver,
                data:{
                    tenLineId:$("#lineInfoList").val()
                }
            },function(res){
                if(res){
                    if(res.status!='0000'){
                        alert(res.resultmsg ||"服务器错误,请稍后再试");
                        return;
                    }
                    alert(res.resultmsg ||"线路流标成功");
                    location.replace(location);
                }else{
                    alert("服务器错误,请稍后再试");
                }
            });

        }).show();



        //单个公司废标
        $("#tenderLine").on("click",".feibiao",function(){
            var  _this=$(this);
            if(confirm("确认后该条报价将会删除，您确认该线路废标吗?")){
                Ajax.submit({
                    url:config.Itendbiddeleteapi,
                    data:{
                        tenLineId:$("#lineInfoList").val(),
                        bidLineId:_this.attr("bidLineId")
                    }
                },function(res){
                    if(res){
                        if(res.status!='0000'){
                            alert(res.resultmsg ||"服务器错误,请稍后再试");
                            return;
                        }
                        alert(res.resultmsg ||"废除成功");
                        _this.parent().parent().remove();
                    }else{
                        alert("服务器错误,请稍后再试");
                    }
                });
            }
        });
    }
});