/**
 * Created by haner on 15/6/4.
 */

define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js');

    /**
     * 获取个人线路
     */

    Ajax.detail({
        url:config.IMyRoute
    },function(res){
        if(res&&res.data){
            var mainLine={},otherLine = [];
            for(var i in res.data){
                if(res.data[i].lineType == "mainline"){
                    mainLine = res.data[i];
                }else{
                    otherLine.push(res.data[i]);
                }
            }

            /**
             * 设置主线路
             */
             $('#mainline select[name="fromProvince"]').attr('value',mainLine.fromProvinceId);
             $('#mainline select[name="fromCity"]').attr('value',mainLine.fromCityId);
             $('#mainline select[name="fromArea"]').attr('value',mainLine.fromAreaId);
             $('#mainline select[name="toProvince"]').attr('value',mainLine.toProvinceId);
             $('#mainline select[name="toCity"]').attr('value',mainLine.toCityId);
             $('#mainline select[name="toArea"]').attr('value',mainLine.toAreaId);
             $('#mainline input[name="lineId"]').attr('value',mainLine.lineId);

            /**
             * 设置其他线路
             */
            for(var i in otherLine){
                $('.other_line select[name="fromProvince"]').eq(i).attr('value',otherLine[i].fromProvinceId);
                $('.other_line select[name="fromCity"]').eq(i).attr('value',otherLine[i].fromCityId);
                $('.other_line select[name="fromArea"]').eq(i).attr('value',otherLine[i].fromAreaId);
                $('.other_line select[name="toProvince"]').eq(i).attr('value',otherLine[i].toProvinceId);
                $('.other_line select[name="toCity"]').eq(i).attr('value',otherLine[i].toCityId);
                $('.other_line select[name="toArea"]').eq(i).attr('value',otherLine[i].toAreaId);
                $('.other_line input[name="lineId"]').eq(i).attr('value',otherLine[i].lineId);
            }

        }

        getProvince();
    });


    /**
     * 获取省
     */
    function getProvince(){
        Ajax.custom({
            url:config.IProvince
        }, function (res) {
            $('.province').html(createOption(res.data,'provinceID','provinceName'));
            //设置默认值
            $('.province').each(function(){
                if($(this).attr('value')){
                    $(this).val($(this).attr('value'));
                    $(this).trigger('change');
                }
            });
        });
    }

    /**
     * 省选市
     */
    $('.province').on('change',function(){
        var  _this = $(this);
        if(!$(this).attr('value')){
            $(this).nextAll('select').html('');
        }

        Ajax.custom({
            url:config.ICity,
            data:{
                provinceId:$(this).val()
            }
        }, function (res) {
            _this.next('select').html(createOption(res.data,'cityID','cityName'));
            var nextS = _this.next('select');
            nextS.val(nextS.attr('value')|| "");
            nextS.trigger('change');
        });
    });

    /**
     * 市选区
     */
    $('.city').on('change',function(){
        var  _this = $(this);
        if(!$(this).val()){$(this).nextAll('select').html('');}

        Ajax.custom({
            url:config.IArea,
            data:{
                cityId:$(this).val()
            }
        }, function (res) {
            _this.next('select').html(createOption(res.data,'areaID','areaName'));
            var nextS = _this.next('select');
            nextS.val(nextS.attr('value') || "");
            nextS.trigger('change');
        });
    });


    /**
     * 构建 html
     * @param list
     * @param id
     * @param text
     * @returns {string}
     */
    function createOption(list,id,text){
        if(!list || !list.length){
            return '';
        }
        var html = '<option value="">---请选择---</option>';

        for(var i in list){
            html += ('<option value="'+list[i][id]+'">'+list[i][text]+'</option>');
        }
        return html;
    }



    /**
     * 保存路线
     */

    $('form.route_form').submit(function(e){
        e.preventDefault();
        var ok = !0;
        $(this).find('select').each(function(){
            if(!$(this).val()){ok = !!0;}
        });

        if(!ok){
            alert('请选择完整线路！');return;
        }

        Ajax.submit({
            url:config.ISaveRoute,
            data:formJson($(this))
        },function(res){
            if(res && res.status==='0000'){
                alert(res.resultmsg || '保存成功！');
                location.replace(location);
            }
        });
    });

    /**
     * 序列化表单
     * @param form
     * @returns {{}}
     */
    function formJson(form) {
        var o = {};
        var a = form.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }

});