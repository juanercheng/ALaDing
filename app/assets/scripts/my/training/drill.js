/**
 * Created by chengjuan on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config'),
        configs = require('config'),
        Tools = require('tools'),
        platformId=1;

    require('common');
    require('pca');
    if(Tools.getQueryValue('platformId')){
        platformId = Tools.getQueryValue('platformId');
    }else {
        platformId=1
    }

    /**
     * 获取資料列表
     */
    config.pageRequest = function () {
        Ajax.pageRequest({
            url : config.TrainingGetVideo,
            data:{
                platformId:platformId,
            },
            // pageFor: 'seqrch-tmpl', // 渲染数据的模板
            // pageEle: '#videoBox' // 被渲染的dom
        },function(data){
            var data=data.data
            if(data.length===0){
                $('.noData').show()
            }else {
                $('.noData').hide()
            }
            for (var i in data){
                $('video source').attr('src',configs.baseUrl+'/'+data[i].VideoPath)
            }

        },function(){
            console.log('ceshi')
        });

    };

    config.pageRequest();

});
