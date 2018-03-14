/**
 * Created by haner on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('./config'),
        us = require('UserService'),
        Tools = require('tools'),

        template = require('template');

    require('fileupload');
    require('common');
    require('validform');


    var user = us.getUser();

    if(!user || !user.memberType){return;}
    if(user.memberType === config.types.userType.driver){
        $('#driver-form').css({display:'inline-block'});
    }else{
        $('#ge-form').css({display:'inline-block'});
    }



    /**
     * 文件上传
     */
    var flag=setInterval(function(){
        if($.fn.fileupload){
            clearInterval(flag);
            /**
             * 文件上传
             */
            $('input[type="file"]').fileupload({
                url: config.imageServer,
                dataType: "JSON",
                acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
                maxFileSize: 5000000,
                done: function (e, data) {
                    console.log(data)
                    $(this).prev().attr('src', data.result.data.picUrl);
                    $(this).next().val(data.result.data.picUrl);
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
                    var index = data.index,file = data.files[index];
                    if (file.error) {alert(file.error);}
                },
                fail: function (e) {}
            });
        }
    },300);


    /**
     * 司机表单
     */
    $('#driver-form').on('valid.form',function(e){
        e.preventDefault();
        var data=Tools.formJson('#driver-form');
        var _t=[];
        $("div.provinceIds").find("input:checked").each(function(){
            _t.push(this.value);
        });
        data.provinceIds=_t.join(",");

        Ajax.submit({
            url:config.IUpdateInfo,
            data:data
        },function(res){
            if(res&&res.status === '0000'){
                alert('保存成功！');
            }else{
                alert(res.resultmsg || '保存失败！');
            }
        });
    });

    /**
     * 货主，物流公司表单
     */
    $('#ge-form').on('valid.form',function(e){
        e.preventDefault();
        Ajax.submit({
            url:config.IUpdateInfo,
            data:Tools.formJson('#ge-form')
        },function(res){
            if(res&&res.status === '0000'){
                user.reallyName = $('input[name="reallyName"]').val();
                us.saveOrUpdateUser(user);
                alert('保存成功！');
            }else{
                alert(res.resultmsg || '保存失败！');
            }
        });
    });

    /**
     * 获取个人信息
     */
    Ajax.detail({
        url:config.IUserInfo
    },function(res){
        if(!res){return;}
        //回填数据
        var userinfo = res.data || {},
        drvZoneProvince=userinfo.drvZoneProvince||{};

        userinfo = userinfo.member || {};

        $('input[name="reallyName"]').val(userinfo.reallyName || '');
        $('input[name="memberId"]').val(userinfo.memberId || '');
        $('input[name="drvVehicleLicenceNo"]').val(userinfo.drvVehicleLicenceNo || '');
        $('input[name="drvVehicleType"]').val(userinfo.drvVehicleType || '');
        $('input[name="drvLoad"]').val(userinfo.drvLoad || '');
        $('input[name="drvVehicleLong"]').val(userinfo.drvVehicleLong || '');
        $('input[name="drvVehicleWidth"]').val(userinfo.drvVehicleWidth || '');
        $('input[name="drvVehicleHigh"]').val(userinfo.drvVehicleHigh || '');
        $('input[name="drvWork"]').val(userinfo.drvWork || '');
        $('input[name="drvParkPlace"]').val(userinfo.drvParkPlace || '');
        $('input[name="identityCardId"]').val(userinfo.identityCardId || '');
        $('input[name="drvLicenseNum"]').val(userinfo.drvLicenseNum || '');
        $('input[name="cp"]').val(userinfo.cellPhone || '');

        $('input[name="userPhotoImg"]').val(userinfo.userPhotoImg || '');
        $('input[name="identityCardImg"]').val(userinfo.identityCardImg || '');
        $('input[name="drvLicenseImg"]').val(userinfo.drvLicenseImg || '');
        $('input[name="drvOLicenseImg"]').val(userinfo.drvOLicenseImg || '');
        $('input[name="drvVehicleImg"]').val(userinfo.drvVehicleImg || '');

        $('.userPhotoImg').attr('src',userinfo.userPhotoImg || '');
        $('.identityCardImg').attr('src',userinfo.identityCardImg || '');
        $('.drvLicenseImg').attr('src',userinfo.drvLicenseImg || '');
        $('.drvOLicenseImg').attr('src',userinfo.drvOLicenseImg || '');
        $('.drvVehicleImg').attr('src',userinfo.drvVehicleImg || '');
        $('.cmpLicenseImg').attr('src',userinfo.cmpLicenseImg || '');


        $('textarea[name="cmpDetailAdd"]').val(userinfo.cmpDetailAdd || '');
        $('textarea[name="cmpBusinessScope"]').val(userinfo.cmpBusinessScope||'');
        $('input[name="cmpLicenseImg"]').val(userinfo.cmpLicenseImg || '');
        $('input[name="cmpLicenseId"]').val(userinfo.cmpLicenseId || '');
        $('input[name="cmpPhone"]').val(userinfo.cmpPhone || '');
        $('input[name="cmpName"]').val(userinfo.cmpName || '');

        function getZoneProvince(zoneId,checkeds){
            for(var t in config.drvzoneprovincemap){
                if(config.drvzoneprovincemap[t].zoneId==zoneId){
                    var html=[];
                    for(var i in config.drvzoneprovincemap[t].province){
                        var _is="";
                        if(checkeds&&checkeds.length){
                            for(var j=0;j<checkeds.length;j++){
                                if(config.drvzoneprovincemap[t].province[i].provinceId==checkeds[j]){
                                    _is=" checked='checked'";
                                    break;
                                }
                            }
                        }
                        html.push("<input"+_is+" type='checkbox' class='checkbox' value='"+config.drvzoneprovincemap[t].province[i].provinceId+"' />"+config.drvzoneprovincemap[t].province[i].provinceName);
                    }
                    return html.join("<br/>");
                    break;
                }
            }
            return "";
        }

        var result = template.render("drvZoneProvince-tmpl", {'list':config.drvzoneprovincemap});
        $("#drvZoneProvince").html(result);
        var $provinceIds=$("[name='provinceIds']").prev("div");
        $("#drvZoneProvince").change(function(){
            $("[name='provinceIds']").val("");
            $provinceIds.html("").html(getZoneProvince(this.value));
        });

        if(drvZoneProvince){
            $("#drvZoneProvince").val(drvZoneProvince[0].zoneId || config.drvzoneprovincemap[0].zoneId);
            
            var _tp=[];
            for(var i=0;i<drvZoneProvince.length;i++){
                _tp.push(drvZoneProvince[i].provinceId);
            }
            $("[name='provinceIds']").val(_tp.join(","));
            $provinceIds.html("").html(getZoneProvince($("#drvZoneProvince").val(),_tp));
        }
        $provinceIds.on("click","input",function(){
            var _t=[];
            $("div.provinceIds").find("input:checked").each(function(){
                _t.push(this.value);
            });
            $("[name='provinceIds']").val(_t.join(","));
        });

        //

        /**
         * 车辆性质
         */
        Ajax.pageRequest({
            url: config.IDictionary, // 请求地址
            data: {
                dictionaryCode: config.types.dicType.drvnatureenum
            },
            renderFor: 'drvNature-tmpl', // 渲染数据的模板
            renderEle: '#drvNature' // 被渲染的dom
        },function(){
            $('#drvNature').val(userinfo.drvNature || '');
        });

        if(userinfo.memberType&&userinfo.memberType == config.types.userType.driver){
            /**
             * 获取省
             */
            Ajax.custom({
                url:config.IProvince
            }, function (res) {
                $('.province').html(createOption(res.data,'provinceID','provinceName'));
                $('select[name="fromProvinceId"]').val(userinfo.fromProvinceId || '');
                $('select[name="toProvinceId"]').val(userinfo.toProvinceId || '');
                //设置默认值
                $('.province').each(function(){$(this).trigger('change');});
                $('select[name="fromCityId"]').attr('value',userinfo.fromCityId || '');
                $('select[name="fromAreaId"]').attr('value',userinfo.fromAreaId || '');
                $('select[name="toCityId"]').attr('value',userinfo.toCityId || '');
                $('select[name="toAreaId"]').attr('value',userinfo.toAreaId || '');



            });
        }


    });




    /**
     * 省选市
     */
    $('.province').on('change',function(){
        var  _this = $(this);
        if(!$(this).val()){$(this).nextAll('select').html('')};

        Ajax.custom({
            url:config.ICity,
            data:{
                provinceId:$(this).val()
            }
        }, function (res) {
            _this.next('select').html(createOption(res.data,'cityID','cityName'));
            var nextS = _this.next('select');
            nextS.val(nextS.attr('value'));
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
            nextS.val(nextS.attr('value'));
            nextS.trigger('change');
        });
    });

    /**
     * 构建 html
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

});