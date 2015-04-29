var gulp = require('gulp');
var eslint = require('gulp-eslint');

var files = [
  './slushfile.js',
  './gulpfile.js',
  './template/gulpfile.js',
  './template/source/**/**.js',
  './template/tasks/*.js',
  './template-es6/tasks/*.js'
];

var es6Files = [
  './template-es6/source/**/**.js'
];

gulp.task('test:es5', function() {

  gulp.src(files)
    .pipe(eslint({ envs: ['browser', 'node'] }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

});

gulp.task('test:es6', ['test:es5'], function() {

  gulp.src(es6Files)
    .pipe(eslint({
      envs: ['browser', 'es6'],
      ecmaFeatures: {
        arrowFunctions: true,
        blockBindings: true,
        classes: true,
        defaultParams: true,
        destructuring: true,
        forOf: true,
        generators: false,
        modules: true,
        objectLiteralComputedProperties: true,
        objectLiteralDuplicateProperties: false,
        objectLiteralShorthandMethods: true,
        objectLiteralShorthandProperties: true,
        spread: true,
        superInFunctions: true,
        templateStrings: true,
        jsx: true
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

});

gulp.task('test', ['test:es5', 'test:es6']);

gulp.task('default', ['test']);
