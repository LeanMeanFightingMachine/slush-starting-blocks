var gulp = require('gulp');
var install = require('gulp-install');
var conflict = require('gulp-conflict');
var template = require('gulp-template');
var inquirer = require('inquirer');
var slug = require('slug');
var exec = require('child_process').execSync;
var path = require('path');

var questions = [
  { name: 'project', message: 'Project\'s name?', validate: isEmpty },
  { name: 'client', message: 'Client\'s name?', validate: isEmpty },
  { name: 'moveon', message: 'Continue?', type: 'confirm' }
];

function isEmpty(answer) {

  return answer.replace(/ /g, '') !== '';

}

function getAuthor() {

  var stdout = exec('git config user.name && git config user.email', { encoding: 'utf8' }).split('\n');
  return stdout[ 0 ] + ' <' + stdout[ 1 ] + '>';

}

function getShortName(obj) {

  var client = obj.client.toLowerCase();
  var project = obj.project.toLowerCase();
  return slug(client) + '_' + slug(project);

}

gulp.task('default', function(done) {

  inquirer.prompt(questions, function(answers) {

    if (!answers.moveon) {

      return done();

    }

    answers.author = getAuthor();
    answers.shortName = getShortName(answers);

    gulp.src(path.join(__dirname, '/template/**'), { dot: true })
      .pipe(template(answers))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .pipe(install())
      .on('end', done)
      .resume();

  });

});
