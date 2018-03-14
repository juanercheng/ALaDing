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
    require('pca');



    /**
     * 保存
     */
    var d = new Date();
    $('#publish-order').on('valid.form',function(e,f){
        var data = Tools.formJson('#publish-order');
        
        data.guid = d.getTime();

        data.isTechnical=data.isTechnical?data.isTechnical:"false";

        var tenderBaisc=[];
        var tenderLine=[];

        $("#tenderbasic tbody tr").each(function(){
            tenderBaisc.push(JSON.parse($(this).find("input").val()));
        });

        $("#tenderLine tbody tr").each(function(){
            tenderLine.push(JSON.parse($(this).find("input").val()));
        });

        data.tenderBaisc=JSON.stringify(tenderBaisc);
        data.tenderLine=JSON.stringify(tenderLine);

        if(data.isTechnical=="false"){
            if(data.basicScore!="100"){
                alert('非技术标，中标依据必须选择100');
                //
                return;
            }
        }else{
            if(parseInt(data.basicScore)+parseInt(data.techScore)!=100){
                alert('技术标分值和中标依据分值相加必须等于100');
                return;
            }
        }

        //deviation 偏离度 String  必须      不设置即为1
        if(data.deviation=="0"){
            data.deviation=$("#deviation select").val();
        }

        if(data.isOpen=="false"){
            var _t=[];
            data.invitations=function(){
                jQuery("#invitations td[v]").each(function(){
                    _t.push($(this).attr("v"));
                });
                return _t.join(",");
            }();

            if(_t.length<2){
                alert('请至少选择两家邀标公司');
                return;
            }
        }

        //tenderLine

        Ajax.submit({
            url:config.ITenderSave,
            data:data
        },function(res){
            alert(res.resultmsg || '保存失败！');
            if(res.status === '0000'){
                location.replace(location);
            }
        });

        return false;
    });

    /**
     * 文件上传
     */
    var flag=setInterval(function(){
        if($.fn.fileupload){
            clearInterval(flag);
           /* $('input.notice[type="file"]').fileupload({
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
            });*/
            $('input[type="file"]').fileupload({
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

    var end = {
        elem: '#end',
        format: 'YYYY-MM-DD hh:mm:ss',
        min: laydate.now(),
        istime: true,
        choose: function(datas){
            $('#end').trigger("validate");
        }
    };
    $('#end').click(function(){
        laydate(end);
    });

    /******table删除按钮处理*****/
    $(".tlist").on("click","span.delete",function(){
        if(confirm("确认删除?")){
            $(this).parent().parent().remove();
        }
    });

    /**************技术标***************/
    var tenderbasic_dialog=$("#tenderbasic_dialog");
    function addTenderbasic(){
        var html=[],
            data=function(){
                var _d={};
                tenderbasic_dialog.find("[name]").each(function(){
                    _d[this.name]=this.value;
                });
                return _d;
            }(),
            _t="",
            _tCount=0;

        html.push("<tr>");
            html.push("<td><input type='hidden' data-basicScore='"+data.basicScore+"' value='"+(JSON.stringify(data))+"' />"+data.basicName+"/"+data.basicScore+"分</td>");
            for(var i=1;i<5;i++){
                _t=data["name"+i]+"/"+data["score"+i]+"分";
                _t=_t=="/分"?"":_t;

                _tCount+=(data["name"+i]?1:0);
                if(i==4){
                    html.push("<td class='delete'>"+_t+"<span class='delete'>删除</span></td>");
                }else{
                    html.push("<td>"+_t+"</td>");
                }
            }
        if(_tCount<2){
            alert("评分依据最少要求填写两项");
            return false;
        }
        html.push("</tr>");
        $("#tenderbasic tbody").append(html.join(""));

        $("#tenderbasic_dialog [type='text']").val("");
        return true;
    }

    //新增技术标
    $("#add_tenderbasic").click(function(){
        if($("#tenderbasic tbody tr").size()>=10){
            alert("最多只能填写10条技术标依据");
            return false;
        }
        $("#tenderbasic_dialogbg").show();
        $("#tenderbasic_dialog").show();
        return false;
    });

    //保存技术标
    var _techScore=$("[name='techScore']");

    $("#tenderbasic_dialog .save_btn").click(function(){

        /** 如果是技术标，判断所有依据分数总和不能超过技术标分数 **/
        var count=0,_basicScore=parseInt(tenderbasic_dialog.find("[name='basicScore']").val());
        $("#tenderbasic").find("[data-basicScore]").each(function(){
            count+=parseInt($(this).attr("data-basicScore"));
        });

        if(!tenderbasic_dialog.find("[name='basicName']").val().trim()){
            alert("技术标依据不能为空");
            return;
        }
        if(!tenderbasic_dialog.find("[name='basicScore']").val().trim()){
            alert("技术标依据分值不能为空");
            return;
        }
        if(!/\d+/.test(tenderbasic_dialog.find("[name='basicScore']").val())){
            alert("技术标依据分值只允许输入整数");
            return;
        }

        if(count+_basicScore  > parseInt(_techScore.val()) ){
            alert("技术标依总分值不能大于技术标分值");
            return;
        }

        var _t="",_l={ "0":"A","1":"B","2":"C","3":"D" };
        tenderbasic_dialog.find("[name^='score']").each(function(i){

            if( this.value ){
                if(!/\d+/.test(this.value)){
                    _t="评分依据"+_l[i]+"分值只允许输入整数";
                    return false;
                }
                if( parseInt(this.value) > _basicScore){
                    _t="评分依据"+_l[i]+"分值不能大于技术标依据分值";
                    return false;   
                }
            }
        });
        if(_t){
            alert(_t);
            return;
        }

        var _flag=true,_flagmsg="";
        tenderbasic_dialog.find("[name^='name']").each(function(i){
            var _v=this.value;
            if(_v){
                tenderbasic_dialog.find("[name^='name']").each(function(j){
                    if(this.value && i!=j){
                        if(_v==this.value){
                            _flagmsg="评分依据"+_l[i]+"项和"+_l[j]+"项重复";
                            _flag=false;
                            return false;
                        }
                    }
                });
            }
            if(!_flag){
                return false;
            }
        });
        if(!_flag){
            alert(_flagmsg);
            return;
        }

        // var _nv="",_sv="";
        // tenderbasic_dialog.find("[name^='name']").each(function(){
        //     if($(this).val().trim()){
        //         _nv=this.value;
        //     }
        // });
        // tenderbasic_dialog.find("[name^='score']").each(function(){
        //     if($(this).val().trim()){
        //         _sv=this.value;
        //     }
        // });

        // if(!_nv){
        //     return;
        // }

        if(addTenderbasic()){
            $("#tenderbasic_dialogbg").hide();
            $("#tenderbasic_dialog").hide();
        }
    });

    //取消保存技术标
    $("#tenderbasic_dialog .cannel").click(function(){
        $("#tenderbasic_dialogbg").hide();
        $("#tenderbasic_dialog").hide();
    });

    
    $("[name='isTechnical']").click(function(){
        if(this.checked){
            $("#add_tenderbasic").show().next().show();
        }else{
            $("#add_tenderbasic").hide().next().hide();
        }
    });



    /***************线路*************/
    var tenderLine_dialog=$("#tenderLine_dialog");
    function addtenderLine(){
        var html=[],
            data=function(){
                var _d={};
                tenderLine_dialog.find("[name]").each(function(){
                    _d[this.name]=this.value;
                });
                return _d;
            }();

        html.push("<tr>");
            html.push("<td><input type='hidden' value='"+(JSON.stringify(data))+"' />"+data.fromAdd+"</td>");
            html.push("<td>"+data.toAdd+"</td>");
            html.push("<td>"+data.goodName+"</td>");
            html.push("<td>"+data.nowPrice+"</td>");
            html.push("<td>"+data.load+"吨/"+data.unit+"</td>");
            html.push("<td class='delete'>"+data.remark+"<span class='delete'>删除</span></td>");
        html.push("</tr>");
        $("#tenderLine tbody").append(html.join(""));

        $("#tenderLine_dialog [type='text']").val("");
    }

    //新增线路
    $("#add_tenderLine").click(function(){
        if($("#tenderLine tbody tr").size()>=50){
            alert("最多只能填写50条线路");
            return false;
        }
        $("#tenderLine_dialogbg").show();
        $("#tenderLine_dialog").show();
        return false;
    });

    //保存线路
    $("#tenderLine_dialog .save_btn").click(function(){
        if(!tenderLine_dialog.find("[name='fromAdd']").val().trim()){
            alert("起运地不能为空");
            return;
        }
        if(!tenderLine_dialog.find("[name='toAdd']").val().trim()){
            alert("目的地不能为空");
            return;
        }
        if(!tenderLine_dialog.find("[name='goodName']").val().trim()){
            alert("货物名称不能为空");
            return;
        }
        if( tenderLine_dialog.find("[name='nowPrice']").val() && (!/\d+/.test(tenderLine_dialog.find("[name='nowPrice']").val())) ){
            alert("现执行价只允许输入整数");
            return;
        }

        addtenderLine();
        $("#tenderLine_dialogbg").hide();
        $("#tenderLine_dialog").hide();
    });

    //取消保存线路
    $("#tenderLine_dialog .cannel").click(function(){
        $("#tenderLine_dialogbg").hide();
        $("#tenderLine_dialog").hide();
    });

    //邀标方式
    $("[name='isOpen']").click(function(){
        if(this.value=="true"){
            $("#invitaBid").show();
            $("#add_invitations").hide().next().hide();
        }else{
            $("#invitaBid").hide();
            $("#add_invitations").css("display","block").next().show();
        }
    });


    //新增邀标公司

    /**
     * 获取货源列表
     */
    config.pageRequest = function(){
        var data = Tools.formJson('#list_search');
        data.pageSize=200;
       
        Ajax.pageRequest({
            url : config.Igetnearbylogistics,
            data:data
        },function(data){
            if(data){
                $('#count').text('共'+(data.data.length || 0) + '条');
            }
        },function(){
            $('#count').text('共0条');
        });
    };

    var _invitationsHeight;
    $("#add_invitations").click(function(){

        //config.pageRequest();

        if($("#tenderLine tbody tr").size()>=30){
            alert("最多只能填写30家公司");
            return false;
        }
        $("#invitations_dialogbg").show();
        $("#invitations_dialog").show();

        if(!_invitationsHeight){
            _invitationsHeight=$("#invitations_dialog").height();
            $("#invitations_dialog").height(_invitationsHeight);
            $("#data-list").height(_invitationsHeight-185-40);
        }
        return false;
    });
    $(".invitations_btn").click(function(){
        var html=[];
        $("#invitations_dialog ul li .chbox_invitations:checked").each(function(){
            var _this=this,flag=true;
            $("#tenderLine tbody tr td[v]").each(function(){
                if($(this).attr("v")==_this.value){
                    flag=false;
                    return false;
                }
            });
            if(flag){
                html.push("<tr><td v='"+this.value+"'>"+($(this).attr("vt") || "&nbsp;")+"<span class='delete'>删除</span></td></tr>")
            }
        });
        if($("#tenderLine tbody tr").size()+html.length>30){
            alert("最多只能填写30家公司");
            return;
        }else if(html.length){
            $("#invitations tbody").append(html.join(""));
        }
        $("#invitations_dialogbg").hide();
        $("#invitations_dialog").hide();
    });
});
