var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('test', function() {

  gulp.src(['./slushfile.js', './gulpfile.js', './template/gulpfile.js', './template/source/**/**.js', './template/tasks/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

});

gulp.task('default', ['test']);
