define(function (require) {
    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config.js');

    /**
     * 获取省
     */
    Ajax.custom({
        url:config.IProvince
    }, function (res) {
        $('.province').html(createOption(res.data,'provinceID','provinceName'));
        setTimeout(function(){
            for(var t in setProvinceList){
                setProvinceList.shift()();
            }
        },300);
    });

    /**
     * 省选市
     */
    $('.province').on('change',function(){
        var  _this = $(this);
       $(this).nextAll('select').html('');

        Ajax.custom({
            url:config.ICity,
            data:{
                provinceId:$(this).val()
            }
        }, function (res) {
            _this.next('select').html(createOption(res.data,'cityID','cityName'));
        });
    });

    /**
     * 市选区
     */
    $('.city').on('change',function(){
        var  _this = $(this);
        if(!$(this).val()){$(this).nextAll('select').html('');return;}

        Ajax.custom({
            url:config.IArea,
            data:{
                cityId:$(this).val()
            }
        }, function (res) {
            _this.next('select').html(createOption(res.data,'areaID','areaName'));
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
     * 搜索
     */
    $('.search_btn').click(function(e){
        e.preventDefault();
        if(typeof config.pageRequest ==='function'){
            config.pageRequest();
        }
    });

    /**
     * 排序
     */
    $('.d_order,.o_order,.t_order').click(function(e){
        e.preventDefault();

        $(this).siblings().attr('data-order','');

        if($(this).is('.d_order')){
            $(this).attr('data-order','true');
        }else{
            $(this).attr('data-order')==='big' ? $(this).attr('data-order','small'):$(this).attr('data-order','big');
        }
        if(typeof config.pageRequest ==='function'){
            config.pageRequest();
        }
    });

    var setProvinceList=[],setCityList=[],setAreaList=[];
    return {
        setData:function(province,city,area,compCallback){
            if(province){
                setProvinceList.push(function(){
                    if($('.province').find("[value='"+province+"']").size()){
                        $('.province').val(province);
                    }

                    Ajax.custom({
                        url:config.ICity,
                        data:{
                            provinceId:province
                        }
                    }, function (res) {
                        $('.city').html(createOption(res.data,'cityID','cityName'));

                        setTimeout(function(){
                            for(var t in setCityList){
                                setCityList.shift()();
                            }
                        },300);

                    });
                });
            }
            if(city){
                setCityList.push(function(){
                    if($('.city').find("[value='"+city+"']").size()){
                        $('.city').val(city);
                    }

                    Ajax.custom({
                        url:config.IArea,
                        data:{
                            cityId:city
                        }
                    }, function (res) {
                        $('.area').html(createOption(res.data,'areaID','areaName'));

                        setTimeout(function(){
                            for(var t in setAreaList){
                                setAreaList.shift()();
                            }
                        },300);
                    });

                });
            }
            if(area){
                setAreaList.push(function(){
                    if($('.area').find("[value='"+area+"']").size()){
                        $('.area').val(area);
                    }
                    compCallback && compCallback();
                });
            }
        }
    }
});

