/**
 * Created by chengjuan on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config'),
        configs = require('config'),
        pid="";
    require('common');
    require('pca');

    //培訓平台
    Ajax.pageRequest({
        url: config.TrainingGetPlatformList, // 请求地址
        data: {
            // dictionaryCode: config.types.dicType.drvnatureenum
        },
        renderFor: 'seqrch-tmpl', // 渲染数据的模板
        renderEle: '#positionPlace' // 被渲染的dom
    });

    //选择培训平台加载缓存数据
    $('#positionPlace').on('change', function (e) {
        e.preventDefault();
        pid=e.target.value
        video(pid)
    });

    video(1);
    /**
     * 获取資料列表
     */
    function video(pid) {
        Ajax.pageRequest({
            url : config.TrainingGetVideo,
            data:{
                platformId:pid,
            },
            renderFor: 'list-tmpl', // 渲染数据的模板
            renderEle: '#videoBox' // 被渲染的dom
        },function(data){
            var data=data.data
            for (var i in data){
                $('video source').attr('src',configs.baseUrl+'/'+data[i].VideoPath)
            }
        },function(){
            console.log('ceshi')
        });
    }

});
