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
        tenderId=Tools.getQueryValue('tenderId'),
        oldDeatil;

    if (!id)return;

    $("#my-tenders-detail").attr("href","my-tenders-detail.html?id="+tenderId);
   

    /**
     * 数据获取
     */
    config.pageRequest = function () {
        Ajax.pageRequest({
            url: config.IBidInfoDetail,
            data: {
                bidId: id
            }
        }, function (data) {

            if(data.status=="0000"){

                oldDeatil=data.data;
                 $('#order-detail').html(template.render('order-detail-tmpl',{list:data.data || {}}));
                 
                
            }else{
                alert(data.resultmsg || '获取数据失败');
            }

        });
    };

    config.pageRequest();

    var bidrankenumHtml=function(rank){
        var _html=['<select>'],
            getName={
                first:"第一名",
                second:"第二名",
                third:"第三名",
                four:"竞标失败",
                tendover:"流标"
            };
        for(var t in config.types.bidrankenum){
            _html.push("<option"+(rank==t?" selected='selected'":"")+" value='"+t+"'>"+getName[t]+"</option>")
        }    
        _html.push("</select>");
        return _html.join("");
    };
    
    function randertenderLine(id){
        var html=[];
        
        for(var i=0;i<oldDeatil.lineInfoList.length;i++){
            if(oldDeatil.lineInfoList[i].tenLineId==id){
                var bidLineList=oldDeatil.lineInfoList[i];
                for(var j=0;j<bidLineList.length;j++){
                    html.push("<tr>");
                        html.push("<td>"+bidLineList[j].companyName+"</td>");
                        html.push("<td>"+bidLineList[j].price+"</td>");
                        html.push("<td>"+bidLineList[j].techScore+"</td>");
                        html.push("<td>"+bidLineList[j].lineScore+"</td>");
                        html.push("<td>"+bidLineList[j].totalScore+"</td>");
                        html.push("<td>"+bidrankenumHtml(bidLineList[j].rank)+"</td>");
                    html.push("</tr>");
                }

                break;
            }
        }
        $("#tenderLine tbody").html("").append(html.join(""));
    }
});