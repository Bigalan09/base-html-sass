var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var browserSync = require('browser-sync').create();
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');

// secondary tasks

//Compiles sass into .css
gulp.task('sass', function() {
    return gulp.src('./main.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

// Watches .scss files and compiles into .css
gulp.task('sass:watch', function() {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

// autoprefixes cross browser selectors in css and creates sourcemaps.
gulp.task('autoprefixer', function() {
    return gulp.src('./css/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer({
            browsers: ['last 2 versions']
        })]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./css/'))
});

// minifies the css into destributional formats
gulp.task('minify-css', ['sass', 'autoprefixer'], function() {
    return gulp.src('css/*.css')
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

// primary tasks

// develop task
gulp.task('develop', ['build', 'sass:watch'], function() {
    browserSync.init({
        files: "../css/*.css",
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("*.html").on('change', browserSync.reload);
});

// build task
gulp.task('build', ['minify-css'], function() {

});

// default task
gulp.task('default', ['build', 'sass:watch'], function() {
    gulp.watch('./*/**/*.scss', ['sass']);
});
