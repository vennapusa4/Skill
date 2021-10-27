'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var replace = require('gulp-replace');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials-staging', function () {
    return gulp.src([
        path.join(conf.paths.src, '/app/**/*.html'),
        path.join('!' + conf.paths.src, '/app/main/components/material-docs/demo-partials/**/*.html'),
        path.join(conf.paths.tmp, '/serve/app/**/*.html')
    ])
        .pipe($.htmlmin({
            collapseWhitespace: true,
            maxLineLength: 120,
            removeComments: true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'fuse',
            root: 'app'
        }))
        .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html-staging', ['inject', 'partials'], function () {
    var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: path.join(conf.paths.tmp, '/partials'),
        addRootSlash: false
    };

    var cssFilter = $.filter('**/*.css', { restore: true });
    var jsFilter = $.filter(['**/*.js','!**/*.dev.js'], { restore: true });
    var htmlFilter = $.filter('*.html', { restore: true });
    
    gulp.src([
        path.join(conf.paths.config, '/web.config')
    ])
    .pipe(gulp.dest(path.join(conf.paths.distStaging, '/')));

    

    return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
        .pipe(cssFilter)
        .pipe($.sourcemaps.init())
        .pipe($.cssnano())
        .pipe($.rev())
        // .pipe($.sourcemaps.write('maps'))
        .pipe(cssFilter.restore)
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe($.useref())
        .pipe(jsFilter)
        .pipe($.sourcemaps.init())
        .pipe($.ngAnnotate())
        
        .pipe(replace('http://localhost:49768/', 'https://10.14.21.215:8804/'))
        .pipe(replace('http://localhost:3000', 'https://10.14.21.215:8803'))
        
        .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
        .pipe($.rev())
        // .pipe($.sourcemaps.write('maps'))
        .pipe(jsFilter.restore)
        .pipe($.revReplace())
        .pipe(htmlFilter)
        .pipe($.htmlmin({
            collapseWhitespace: true,
            maxLineLength: 120,
            removeComments: true
        }))
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest(path.join(conf.paths.distStaging, '/')))
        .pipe($.size({
            title: path.join(conf.paths.distStaging, '/'),
            showFiles: true
        }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts-staging', function () {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.distStaging, '/fonts/')));
});
gulp.task("assets-staging", function () {
   //css
    gulp.src("src/assets/css/*.*")
    .pipe(gulp.dest("distStaging/assets/css"));
    //fonts
    gulp.src("src/assets/css/fonts/*.*")
       .pipe($.flatten())
   .pipe(gulp.dest("distStaging/assets/css/fonts"));

    gulp.src("src/assets/js/**/*.*")
   .pipe(gulp.dest("distStaging/assets/js"));
});
gulp.task('other-staging', function () {
    var fileFilter = $.filter(function (file) {
        return file.stat.isFile();
    });

    return gulp.src([
        path.join(conf.paths.src, '/**/*'),
        path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
    ])
        .pipe(fileFilter)
        .pipe(gulp.dest(path.join(conf.paths.distStaging, '/')));
});

// Move demo-partials directory for material-docs
gulp.task('material-docs-staging', function () {
    var fileFilter = $.filter(function (file) {
        return file.stat.isFile();
    });

    return gulp.src([
        path.join(conf.paths.src, '/app/main/components/material-docs/demo-partials/**/*')
    ])
        .pipe(fileFilter)
        .pipe(gulp.dest(path.join(conf.paths.distStaging, '/app/main/components/material-docs/demo-partials/')));
});

gulp.task('clean-staging', function () {
    return $.del([path.join(conf.paths.distStaging, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('build-staging', ['clean-staging'], function () {
    gulp.start('build-stag');
});

gulp.task('build-stag', ['html-staging', 'fonts-staging', 'other-staging', 'material-docs-staging', 'assets-staging']);
