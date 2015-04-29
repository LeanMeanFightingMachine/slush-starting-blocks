var gulp 	= require('gulp');
var script = require('./tasks/script');
var style = require('./tasks/style');
var test = require('./tasks/test');
var server = require('./tasks/server');
var watch = require('./tasks/watch');
var moduleTask = require('./tasks/module');


gulp.task('script', ['module:rebuild'], script);
gulp.task('script:build', ['test', 'module:rebuild'], script.build);

gulp.task('style', style);
gulp.task('style:build', ['test'], style.build);

gulp.task('test', test);

gulp.task('module', moduleTask);
gulp.task('module:rebuild', moduleTask.rebuild);

gulp.task('watch', watch);

gulp.task('server', ['script'], server);

gulp.task('default', ['style', 'script', 'server', 'watch']);

gulp.task('build', ['test', 'style:build', 'script:build']);
