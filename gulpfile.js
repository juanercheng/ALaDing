/*
 * gulp-rev-easy  https://www.npmjs.com/package/gulp-rev-easy
 * 路径问题
 * 有效利用服务器缓存静态资源
 *
 *
 *
 *
 */


/*******
 * 编译步骤,每次运行任务都需要等待任务执行完成，再执行下一个任务
 * 1.删除dest文件
 * 2.运行html任务
 * 3.运行templates任务
 * 4.运行default任务
 *
 * *********/

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var src = {
    css: 'app/assets/styles/**/*.styl',
    img: 'app/assets/image/*',
    js: 'app/assets/scripts/**/*',
    html: 'app/**/*.html',
    tmpl: 'app/**/*.jade'
};

var dest = {
    css: 'dest/assets/styles/',
    img: 'dest/assets/image/',
    js: 'dest/assets/scripts/',
    html: 'dest/'
};

/**
 * 是否打印log
 * @type {boolean}
 */
var isLog = true,
    idDeploy = false,//是否压缩js, true为压缩 false为不压缩
    isHtmlMin = false ;//是否压缩html true为压缩 false为不压缩

/**
 * clean file
 */
gulp.task('clean', require('del').bind(null, ['dest']));


gulp.task('styles', function () {
    return gulp.src(src.css)
        .pipe($.plumber(errrHandler)) //异常处理
        .pipe($.stylus())
        .pipe($.autoprefixer({
            browsers: ['> 1%', 'last 0 versions', 'Firefox ESR', 'Opera 12.1'],
            cascade: false
        }))
        .pipe($.csso())
        .pipe($.rename({
            suffix:'.min'
        }))
        .pipe(gulp.dest(dest.css))
        .pipe(reload({
            stream: true
        }));
});

//remove task 
gulp.task('jshint', function () {
    return gulp.src(src.js)
        .pipe(reload({
            stream: true,
            once: true
        }))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});


// js 合并，压缩
gulp.task('scripts', function () {
    return gulp.src(src.js)
        .pipe($.plumber(errrHandler)) //异常处理
        .pipe($.if('*.js'&&idDeploy,$.uglify({mangle:false})))
        .pipe(gulp.dest(dest.js));
});


gulp.task('images', function () {
    return gulp.src(src.img)
        .pipe(gulp.dest(dest.img));
});


gulp.task('html', function () {
    var assets = $.useref.assets({
        searchPath: ['dest', 'app', '.']
    });
    return gulp.src(src.html)
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(dest.html));
});

gulp.task('templates', function () {
    gulp.src(src.tmpl)
        .pipe($.plumber(errrHandler)) //异常处理
        .pipe($.jade({
            pretty: !isHtmlMin
        }))
        .pipe(gulp.dest(dest.html));
});


gulp.task('start', ['styles', 'images','scripts', 'html', 'templates'], function () {

    //browserSync.init({
    //    proxy: "http://www.dingding56.cn"
    //});

    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['dest']
        }
    });


    gulp.watch(src.css, ['styles']);
    gulp.watch(src.js, ['scripts']);
    gulp.watch(src.video, ['video']);
    gulp.watch(src.img, ['images']);
    gulp.watch(src.tmpl, ['templates']);

    // watch for changes
    gulp.watch([src.js, src.css, src.tmpl]).on('change', reload);

    log('服务器启动成功!');
});


/**
 * 默认任务
 */
gulp.task('default', function () {
    gulp.start(['start']);
});


/**
 * 异常捕获,避免jade编译出错时停止进程
 * @param e
 */
function errrHandler(e) {
    log(e.message);
}


function log(msg) {
    var dateStr = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    isLog ? console.log('[' + dateStr + '] : ' + msg) : ''
}


