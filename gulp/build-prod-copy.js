'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var replace = require('gulp-replace');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
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

gulp.task('html', ['inject', 'partials'], function () {
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
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));

    

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
        
        .pipe(replace('http://localhost:49768/', 'https://ptsg-1skillwb02.azurewebsites.net/'))
        .pipe(replace('adfs.petronas.com', 'sts.petronas.com'))
        .pipe(replace('http://localhost:3000', 'https://skill.petronas.com'))
        .pipe(replace('da26854e-366b-4a69-8752-151fcd0cb31d', '7fa3931d-43ab-4a4d-bc1d-f6fb61486bfe'))
        .pipe(replace('p8JSQEHiDfJXk8HpoYMEUguxyuQFoEGurp1fMV6F', 'bucEVNLFKdyVa028GIg_OKn-O6UBhQu-4_SVAga6'))
        
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
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.size({
            title: path.join(conf.paths.dist, '/'),
            showFiles: true
        }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});
gulp.task("assets", function () {
   //css
    gulp.src("src/assets/css/*.*")
    .pipe(gulp.dest("dist/assets/css"));
    //fonts
    gulp.src("src/assets/css/fonts/*.*")
       .pipe($.flatten())
   .pipe(gulp.dest("dist/assets/css/fonts"));

    gulp.src("src/assets/js/**/*.*")
   .pipe(gulp.dest("dist/assets/js"));
});
gulp.task('other', function () {
    var fileFilter = $.filter(function (file) {
        return file.stat.isFile();
    });

    return gulp.src([
        path.join(conf.paths.src, '/**/*'),
        path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
    ])
        .pipe(fileFilter)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

// Move demo-partials directory for material-docs
gulp.task('material-docs', function () {
    var fileFilter = $.filter(function (file) {
        return file.stat.isFile();
    });

    return gulp.src([
        path.join(conf.paths.src, '/app/main/components/material-docs/demo-partials/**/*')
    ])
        .pipe(fileFilter)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/app/main/components/material-docs/demo-partials/')));
});

gulp.task('clean', function () {
    return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('build', ['clean'], function () {
    gulp.start('build-dist');
});

gulp.task('build:prodcopy', ['html', 'fonts', 'other', 'material-docs', 'assets']);
