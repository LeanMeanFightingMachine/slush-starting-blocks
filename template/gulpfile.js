var gulp = require('gulp');<% if (js) { %>
var script = require('./tasks/script');
var test = require('./tasks/test');
var moduleTask = require('./tasks/module');<% } %><% if (css) { %>
var style = require('./tasks/style');
var watch = require('./tasks/watch');<% } %>
var server = require('./tasks/server');
<% if (js) { %>
gulp.task('script', ['module:rebuild'], script);
gulp.task('script:build', ['test', 'module:rebuild'], script.build);

gulp.task('test', test);

gulp.task('module', moduleTask);
gulp.task('module:rebuild', moduleTask.rebuild);
<% } %><% if (css) { %>
gulp.task('style', style);
gulp.task('style:build'<% if (js) { %>, ['test']<% } %>, style.build);

gulp.task('watch', watch);
<% } %>
gulp.task('server'<% if (js) { %>, ['script']<% } %>, server);

gulp.task('default', [<% if (js) { %>'script', <% } %><% if (css) { %>'style', 'watch', <% } %>'server']);
<% if (js || css) { %>
gulp.task('build', [<% if (js) { %>'test', 'script:build'<% if (css) { %>, <% } %><% } %><% if (css) { %>'style:build'<% } %>]);
<% } %>
