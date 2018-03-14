/**
 * Created by chengjuan on 15/5/22.
 */
define(function (require) {

    var $ = require('jquery'),
        Ajax = require('Ajax'),
        config = require('../config'),
        Tools = require('tools'),
        amount='';

    require('common');
    require('pca');

    amount = Tools.getQueryValue('amount');
    if(amount){
        $('.success .result p').find('span').html(amount+'元')
        $('.failed').hide()
        $('.success').show()
    }else {
        $('.failed').show()
        $('.success').hide()
    }

    $('.pink_btn').on('click',function(e) {
        e.preventDefault();
        location.href = './training.html';
    })

});
