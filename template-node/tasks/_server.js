var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');

var started = false;

function startBrowserSync() {

  if (started) return;
  started = true;

  browserSync.init({
    notify: true,
    open: false,
    proxy: 'localhost:8000',
    files: ['./public/css/*.css', './public/js/*.js', './public/*.html']
  });

}

module.exports = function() {

  return nodemon({
    script: 'index.js',
    ext: 'js',
    watch: ['server/'],
    env: { 'NODE_ENV': 'local' }
  }).on('start', startBrowserSync);

};
