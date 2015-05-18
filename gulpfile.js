var gulp = require('gulp');
var eslint = require('gulp-eslint');

var files = [
  './slushfile.js',
  './gulpfile.js',
  '!./template/package.json',
  './template/source/**/**.js',
  './template/tasks/*.js',
  '!./template/tasks/_script.js',
  './template/tasks/module/index.js',
  './template-es6/tasks/*.js',
  './template-es6/source/**/**.js',
  './template-node/tasks/*.js',
  './template-es6/server/**/**.js'
];

gulp.task('test', function() {

  gulp.src(files)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

});

gulp.task('default', ['test']);
