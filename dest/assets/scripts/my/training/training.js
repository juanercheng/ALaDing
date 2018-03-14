/**
 * Created by chengjuan on 15/5/22.
 */

define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config'),
        configs = require('config'),
        us = require('UserService'),
        Tools = require('tools'),
        UserService = require('/assets/scripts/base/user-service.js'),
        drvLicenseImg,carImg,operatingImg,seniorityImg,IDImg,supercargoImg;

    require('fileupload');
    require('common');
    require('validform');
    require('layui')
    layui.config({
        dir: '../../assets/scripts/module/layui/'
    });


    //培訓平台
    Ajax.pageRequest({
        url: config.TrainingGetPlatformList, // 请求地址
        data: {},
        renderFor: 'seqrch-tmpl', // 渲染数据的模板
        renderEle: '#positionPlace' // 被渲染的dom
    });

    //获取相关证件
    Ajax.detail({
        url: config.TrainingGetDocuments, // 请求地址
        data: {}
    },function(res){
        if(res&&res.data){
            //页面展示需要的路径：
            $('.drvLicenseImg img').attr('src',res.data.Drivinglicense?configs.baseUrl+'/'+res.data.Drivinglicense:'')    //行驶证照片
            $('.carImg img').attr('src',res.data.Driverlicense?configs.baseUrl+'/'+res.data.Driverlicense:'')  //驾驶证照片
            $('.operatingImg img').attr('src',res.data.Operatingcertificate?configs.baseUrl+'/'+res.data.Operatingcertificate:'')  //营运证照片
            $('.seniorityImg img').attr('src',res.data.Businesscertificate?configs.baseUrl+'/'+res.data.Businesscertificate:'')  //从业资格证照片
            $('.IDImg img').attr('src',res.data.identityCardImg?configs.baseUrl+'/'+res.data.identityCardImg:'')  //身份证照片
            $('.supercargoImg img').attr('src',res.data.Escortcard?configs.baseUrl+'/'+res.data.Escortcard:'')  //押运员证照片

            //提交时候需要的路径：
            drvLicenseImg=res.data.Drivinglicense?res.data.Drivinglicense:''
            carImg=res.data.Driverlicense?res.data.Driverlicense:''
            operatingImg=res.data.Operatingcertificate?res.data.Operatingcertificate:''
            seniorityImg=res.data.Businesscertificate?res.data.Businesscertificate:''
            IDImg=res.data.identityCardImg?res.data.identityCardImg:''
            supercargoImg=res.data.Escortcard?res.data.Escortcard:''
        }
    });

    //选择培训角色显示对应图片
    $('.supercargo').hide()
    $('#positionRole').on('change', function (e) {
        var value=e.target.value;
        if(value==='押运员'){
            $('.supercargo').show();
            $('.driver').hide()
        }else {
            $('.supercargo').hide();
            $('.driver').show()
        }
    });

    /**
     * 文件上传
     */
    var flag=setInterval(function(){
        if($.fn.fileupload){
            clearInterval(flag);
            imgUploade($('#drvLicenseImg'),1);
            imgUploade($('#carImg'),2);
            imgUploade($('#operatingImg'),3);
            imgUploade($('#seniorityImg'),4);
            imgUploade($('#IDImg'),6);
            imgUploade($('#supercargoImg'),5)//押运证
        }
    },300);
    function imgUploade(imgId,Type) {
        imgId.fileupload({
            url: config.TrainingUploadImg,
            dataType: "JSON",
            formData:{
                memberId: UserService.getUserId(),
                accessToken: UserService.getAccessToken(),
                // imgFile:'ceshi',
                imgFileType:Type,
            },
            done: function (e, data) {
                $(this).prev().attr('src',configs.baseUrl+'/'+data.result.data);
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


   $('.save_btn1').on('click',function(e){
       e.preventDefault();
       var platformId=$('#positionPlace').val();

       layui.use(['layer'], function () {
           var layer = layui.layer;
           if(!platformId){
               layer.alert('请选择培训平台！')
           }
           else {
               location.href = 'drill.html?platformId=' + platformId;
           }
       });

   });
   $('.save_btn3').on('click',function(e){
       e.preventDefault();
       var platformId=$('#positionPlace').val();
       var productName=$('#productName').val()
       var pType=$('#positionRole').val()

       layui.use(['layer'], function () {
           var layer = layui.layer;
           if(!platformId){
               layer.alert('请选择培训平台！');
               return
           }
           if(!productName){
               layer.alert('请输入货物名称！');
               return
           }
           if(pType==='司机'){
               if(!drvLicenseImg){
                   layer.alert('请上传行驶证照片！');
                   return
               }
               if(!carImg){
                   layer.alert('请上传驾驶证照片！');
                   return
               }
               if(!operatingImg){
                   layer.alert('请上传营运证照片！');
                   return
               }
               if(!seniorityImg){
                   layer.alert('请上传从业资格证照片！');
                   return
               }
           }
           if(pType==='押运员'){
               if(!IDImg){
                   layer.alert('请上传身份证照片！');
                   return
               }
               if(!supercargoImg){
                   layer.alert('请上传押运员证照片！');
                   return
               }
           }

           //检查是否有未考完的试卷
           Ajax.detail({
               url:config.IUserInfo
           },function(res){
               if(res.status==='0000'){
                   if(res.data.member&&res.data.member.identityCardId){
                       Ajax.pageRequest({
                           url: config.TrainingExamCheck, // 请求地址
                           data: {
                               platformId:platformId
                           }
                       },function(res) {
                           if(res.status==='0000'){
                               AddTest();
                           }else if(res.status==='1001'){
                               layer.alert(res.resultmsg,function () {
                                   location.href = 'test.html?platformId='+ platformId +'&pType=' + pType +'&productName='+productName;
                               })
                           } else {
                               layer.alert(res.resultmsg)
                           }
                       });
                   }else {
                       layer.alert('培训考试需要实名认证，请进入个人中心进行实名认证！',function () {
                           location.href = '../my-index.html'
                       })
                   }
               }else {
                   layer.alert(res.resultmsg)
               }
           });

           //题目时长和数量
           function AddTest() {
               Ajax.pageRequest({
                   url:config.TrainingGetPlatformList
               },function(res){

                   if(res.status==='0000'){
                       var time,testNum;
                       for(var i=0;i<res.data.length;i++){
                           if(platformId==res.data[i].Id){
                               time=res.data[i].TotalTime
                               testNum=res.data[i].TotalQuestions
                           }
                       }
                       layer.open({
                           content: '单项选择题（系统自动生成'+testNum+'道题目，考试时间为'+time+'分钟）'
                           ,closeBtn: 0
                           ,btn: ['开始考试 ', '取消考试']
                           ,btn1: function(index, layero){
                               addTest();
                               layer.close(index); //如果设定了yes回调，需进行手工关闭
                           }
                           ,btn2: function(index, layero){
                               layer.close(index); //如果设定了yes回调，需进行手工关闭
                           }
                       });
                   } else {
                       layer.alert(res.resultmsg)
                   }
               });
           }

           //参加考试
           function addTest() {
               Ajax.pageRequest({
                   url: config.TrainingGetExamQuestions, // 请求地址
                   data: {
                       platformId:platformId,
                       productName:productName,
                       authType:pType
                   },
               },function(res) {
                   var account=res.resultmsg
                   console.log(res)
                   if(res.status==='0000'){
                       location.href = 'test.html?platformId='+ platformId +'&pType=' + pType +'&productName='+productName;
                   }else if(res.status==='1003'){
                       layer.open({
                           content: '请先支付，再考试！'
                           ,closeBtn: 0
                           ,btn: ['确定 ', '取消']
                           ,btn1: function(index, layero){
                               location.href = 'payTest.html?account='+account+'&platformId='+platformId;
                               layer.close(index); //如果设定了yes回调，需进行手工关闭
                           }
                           ,btn2: function(index, layero){
                               layer.close(index); //如果设定了yes回调，需进行手工关闭
                           }
                       });
                   }else {
                       layer.alert(res.resultmsg)
                   }
               })
           }

       });
   });

});
