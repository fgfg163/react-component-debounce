/*eslint-disable */

var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var pump = require('pump');
var rename = require("gulp-rename");
var gulpCopy = require('gulp-copy');

gulp.task('es', function () {
  return gulp.src('src/*')
    .pipe(babel({
      'presets': [
        [
          'env',
          {
            modules: false,
            targets: {
              browsers: [
                '>= 5%',
                'last 10 versions',
                'not ie <= 8'
              ]
            }
          }
        ],
        'stage-2',
        'react'
      ],
      plugins: [
        'transform-runtime'
      ]
    }))
    .pipe(gulp.dest('dist/es'));
});

gulp.task('lib', function () {
  return gulp.src('src/*')
    .pipe(babel())
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('package', function () {
  return gulp.src('src/*')
    .pipe(sourcemaps.init())
    .pipe(babel())
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
