/**
 * Created by Han on 2015/2/7.
 * 处理用户信息
 */
define(function (require) {
    var Cookie = require('./cookie'),
        json3 = require('json3'),
        $ = require('jquery'),
        config = require('./config');

    return {
        saveOrUpdateUser: function (user) {
            var o = {};
            o.accessToken = user.accessToken || '';
            o.cellPhone = user.cellPhone || '';
            o.memberId = user.memberId || '';
            o.memberType = user.memberType || '';
            o.userPhotoImg = user.userPhotoImg || '';
            o.reallyName = user.reallyName || '';
            o.password = user.password || '';
            Cookie.set(Cookie.ACCOUNT, JSON3.stringify(o));
        },
        removeUser: function () {
            Cookie.remove(Cookie.ACCOUNT);
            Cookie.remove(Cookie.REMEMBER);
        },
        getUser: function () {
            return JSON3.parse(Cookie.get(Cookie.ACCOUNT)) || undefined;
        },
        getUserId: function () {
            var o = this.getUser();
            return o ? o.memberId : '';
        },
        logout: function () {
            var User = this.getUser();
            if(User){
                User.accessToken='';
            }
            this.saveOrUpdateUser(User);
            location.reload();
        },
        isRememberPwd: function () {
            return JSON3.parse(Cookie.get(Cookie.REMEMBER));
        },
        getAccessToken:function(){
            var o = this.getUser();
            return o ? o.accessToken : '';
        },
        remPwd:function(){
            Cookie.remove(Cookie.REMEMBER);
        },
        rememberPwd:function(){
            Cookie.set(Cookie.REMEMBER,'true');
        },
        isLogin:function(){
            if(!this.getUser() || !this.getUser().accessToken){
                return false;
            }
            return true;
        },
        setLL:function(latitude,longitude){
            var o={
                latitude:latitude,
                longitude:longitude
            }
            Cookie.set("latitudeLongitude",JSON3.stringify(o));
        },
        getLL:function(){
            return JSON3.parse(Cookie.get("latitudeLongitude")) || {};
        }
    };

});