/**
 * Created by chengjuan on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config');

    require('common');
    require('pca');

    //获取相关认证信息列表

    Ajax.pageRequest({
        url: config.TrainingGetQualification, // 请求地址
        data: {
        },
        renderFor: 'seqrch-tmpl', // 渲染数据的模板
        renderEle: '#infoList', // 被渲染的dom
    },function(res){
        console.log(res.data)
        if(res.data.length===0){
            $('.noData').show()
        }else {
            $('.noData').hide()
        }
        for(var i in res.data){
            res.data[i].Authstartdate=res.data[i].Authstartdate.substring(0,res.data[i].Authstartdate.indexOf(' '))
            $('.Authstartdate').html(res.data[i].Authstartdate)
        }


    });


});
