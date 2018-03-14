/**
 * Created by chengjuan on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config'),
        Tools = require('tools'),
        platformId='',
        pType='',
        productName='';

    require('common');
    require('pca');
    require('layui');
    layui.config({
        dir: '../../assets/scripts/module/layui/'
    });

    platformId = Tools.getQueryValue('platformId');
    pType=Tools.getQueryValue('pType');
    productName=Tools.getQueryValue('productName');

    layui.use(['layer'], function () {
        var layer = layui.layer;
        testList();
        //生成试卷
        function testList() {
            Ajax.pageRequest({
                url: config.TrainingGetExamQuestions, // 请求地址
                data: {
                    platformId:platformId,
                    authType:pType,
                    productName:productName
                }
            },function(res){
                console.log(res)
                var data=res.data.lstExamInfo
                // var testNum=data.length;
                // var TimingEnd=res.data.TimingEnd
                // var TimingStart=new Date().getTime();
                // TimingEnd=new Date(TimingEnd).getTime();
                var time=parseInt(res.data.Testtime/60);
                var examinfoId='';
                var optionId='';
                var optionName='';
                var qIDarry=[];
                var dataqIDarry=[];
                timeOut(time);
                var platformqualificationsId=res.data.Id;
                var num=1;
                var index=0;
                if(!Array.indexOf){
                    Array.prototype.indexOf = function( ){
                        for(var i=0; i<data.length; i++){
                            if(data[i].OptionId == 0){
                                return i;
                            }
                        }
                        return -1;
                    }
                }
                index = data.indexOf(0);
                num=index+1
                testDetail(index,num);
                //上一题
                $('.notFirstBtn').on('click',function(e){
                    e.preventDefault();
                    if(!optionId){
                        layer.alert('请选择答案！');
                        return
                    }
                    index--;
                    num=index+1;
                    oneSend(examinfoId,optionId,optionName,index,num)
                });
                //下一题
                $('.orange_btn').on('click',function(e){
                    e.preventDefault();
                    if(!optionId){
                        layer.alert('请选择答案！');
                        return
                    }
                    index++;
                    num=index+1;
                    debugger
                    oneSend(examinfoId,optionId,optionName,index,num);
                    if(qIDarry.indexOf(optionId)==-1){
                        qIDarry.push(optionId);
                    }
                    if($('.listOl ol').find('#'+optionId).hasClass('liChecked')==true){
                        optionId=''
                    }
                });

                //提交答案
                $('.pink_btn').on('click',function(e){
                    e.preventDefault();
                    oneSend(examinfoId,optionId,optionName,index,num);
                    qIDarry.push(optionId);
                    setTimeout(function () {
                        location.href = 'testResult.html?platformqualificationsId='+platformqualificationsId;
                    },300)
                });
                //试卷内容填充
                function testDetail(index,num) {
                    if(index===0&&index!=data.length){
                        $('.orange_btn').show()
                        $('.send_btn').hide()
                    }else if(index===data.length-1){
                        $('.orange_btn').hide()
                        $('.send_btn').show()
                    }else {
                        $('.orange_btn').show()
                        $('.send_btn').hide()
                    }
                    var liContent='';
                    var olContent='';
                    for (var i = 0; i < data.length; i++) {
                        if(index<data.length){
                            liContent = "<div class='topic'>" +
                                "<span >" + num + '.'  +
                                "</span>" +
                                "<span>" +data[index].QuestionTitle+
                                "</span>" +
                                "<div class='listOl'>"+
                                "<ol id='ol' class="+num+">"+
                                "</ol>"+
                                "</div>"
                        }
                        examinfoId=data[index].Id
                    }
                    for(var j in data[index].lstQuestionOption){
                        olContent += "<li qId="+data[index].QuestionId+" id="+data[index].lstQuestionOption[j].Id+" >" +data[index].lstQuestionOption[j].Optionname+
                            "</li>"

                        if(dataqIDarry.indexOf(data[index].lstQuestionOption[j].Id)==-1){
                            dataqIDarry.push(data[index].lstQuestionOption[j].Id)
                        }
                    }

                    $('#testList').html(liContent);
                    $('#testList .topic #ol').html(olContent)

                    //已答题目的选中效果：
                    for(var s in dataqIDarry){
                        for(var x in qIDarry){
                            if(dataqIDarry[s].toString()==qIDarry[x].toString()){
                                $('.listOl ol').find('#'+dataqIDarry[s]).addClass('liChecked')
                            }
                        }
                    }

                    //选项选中
                    $('.listOl ol li').click(function () {
                        $(this).addClass('liChecked').siblings().removeClass('liChecked');
                        optionId=$(this).attr('id');
                        optionName=encodeURI($(this).text());
                    });

                }
                //提交答案
                function oneSend(examinfoId,optionId,optionName,index,num) {
                    Ajax.detail({
                        url: config.TrainingTitleSubmitted, // 请求地址
                        data: {
                            examinfoId:examinfoId,
                            optionId:optionId,
                            optionName:optionName
                        }
                    },function(res){
                        console.log(res)
                        testDetail(index,num)
                    });
                }

                //倒计时
                function timeOut(time) {
                    //倒计时
                    var x = time,
                        interval;
                    var d = new Date("1111/1/1,0:" + time + ":0");
                    interval = setInterval(function() {
                        var m = d.getMinutes();
                        var s = d.getSeconds();
                        m = m < 10 ? "0" + m : m;
                        s = s < 10 ? "0" + s : s;
                        $('.timetext').html(m + ":" + s)
                        if (m == 0 && s == 0) {
                            clearInterval(interval);
                            layer.alert('考试结束，系统已自动交卷',function () {
                                oneSend(examinfoId,optionId,optionName,index);
                                setTimeout(function () {
                                    location.href = 'testResult.html?platformqualificationsId='+platformqualificationsId;
                                },300)
                            });
                            return;
                        }
                        d.setSeconds(s - 1);
                    }, 1000);

                }
            });

        }



        //退出考试
        $('.exit_btn').on('click',function(e){
            e.preventDefault();
            layer.open({
                content: '退出后你将取消本次考试资格，您确定要退出吗？'
                ,closeBtn: 0
                ,btn: ['继续考试 ', ' 确定退出']
                ,btn1: function(index, layero){
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
                ,btn2: function(index, layero){
                    location.href = 'training.html';
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                }
            });
        });
    });



});
