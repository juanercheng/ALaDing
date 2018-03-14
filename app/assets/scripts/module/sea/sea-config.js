// Set configuration
seajs.config({
    base: "/assets/scripts/",
    alias: {
        'common':'base/common.js',
        'Ajax':'base/ajax.js',
        'config':'base/config.js',
        'cookie':'base/cookie.js',
        'UserService':'base/user-service.js',
        'tools':'base/tools.js',
        'tmplConfig':'base/template-config.js',
        'pca':'base/pca.js',

        //tools
        "jquery": "module/jquery/jquery.js",
        "template": "module/template/template.js",

        //lib
        'json3': 'module/json/json3.min.js',

        //plugin
        'validator': 'module/validator/jquery.validator.js',
        'validform':'module/validator/local/zh_CN.js',
        'easing': 'module/plugin/jquery.easing.1.3.js',
        'jquery.ui.widget': 'module/jQuery-File-Upload-9.5.7/jquery.ui.widget.js',
        'fileupload': 'module/jQuery-File-Upload-9.5.7/jquery.fileupload.js',
        'scrollable':'module/scrollable/jquery.tools.scrollable.min.js',
        'star':'module/star/star.js',
        'address':'module/address/address.js',
        'imgpreview':'module/imgpreview/imgpreview.min.js',
        "layui":"module/layui/layui.js"
    }
});