var gulp     = require('gulp'),
    install  = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    inquirer = require('inquirer'),
    slug     = require('slug');

gulp.task('default', function (done) {
	error_empty = function(answer) { return answer.replace(/ /g, '') !== '' }

  inquirer.prompt([
    { type: 'input', name: 'project', message: 'Project\'s name?', validate: error_empty },
    { type: 'input', name: 'client', message: 'Client\'s name?', validate: error_empty },
    { type: 'confirm', name: 'moveon', message: 'Continue?' }
  ],
  function (answers) {
		answers.short_name = slug(answers.client.toLowerCase()) + "_" + slug(answers.project.toLowerCase());

    if (!answers.moveon) {
      return done();
    }
    gulp.src(__dirname + '/template/**')
      .pipe(template(answers))
      .pipe(conflict('./test'))
      .pipe(gulp.dest('./test'))
      .pipe(install())
      .on('finish', function () {
        done();
			});
  });
});
