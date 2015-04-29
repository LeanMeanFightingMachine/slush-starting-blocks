var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

module.exports = function() {
  return gulp.src(['./source/js/**/**.js'])
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
};
