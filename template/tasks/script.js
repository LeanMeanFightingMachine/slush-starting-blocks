var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');


var customOpts = {
  entries: ['./source/js/app.js'],
  debug: true
};

var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

b.transform('ractivate');
b.on('update', bundle);
b.on('log', gutil.log);


function bundle() {

  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpif(customOpts.debug,
      sourcemaps.init({ loadMaps: true }),
      uglify({ preserveComments: false })
    ))
    .pipe(gulpif(customOpts.debug, sourcemaps.write('./')))
    .pipe(gulp.dest('./public/js'));

}

bundle.build = function() {

  // no need for sourcemaps
  customOpts.debug = false;

  // we only need browserify for this task
  b = browserify(customOpts);
  b.transform('ractivate');
  b.on('log', gutil.log);

  return bundle();

};

module.exports = bundle;
