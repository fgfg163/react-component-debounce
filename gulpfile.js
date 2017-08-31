/*eslint-disable */

var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var babelOption = require('./.babelrc');
var commonjs = babelOption.commonjs;
var nomodules = babelOption.nomodules;

gulp.task('es', function () {
  return gulp.src('src/*')
    .pipe(babel(nomodules))
    .pipe(gulp.dest('dist/es'));
});

gulp.task('lib', function () {
  return gulp.src('src/*')
    .pipe(babel(commonjs))
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('package', function () {
  return gulp.src('src/*')
    .pipe(sourcemaps.init())
    .pipe(babel(commonjs))
    .pipe(concat('react-component-debounce.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/dist'));
});

gulp.task('package-min', ['package'], function (cb) {
  return gulp.src('dist/dist/react-component-debounce.js')
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/dist'));
});

gulp.task('copy', function (cb) {
  return gulp.src(['LICENSE', 'package.json', 'README.md'])
    .pipe(gulp.dest('dist'));
});

// script: publish
gulp.task('publish', ['copy', 'es', 'lib', 'package', 'package-min'], function () {
});
