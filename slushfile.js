var gulp     = require('gulp'),
    install  = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    inquirer = require('inquirer'),
    slug     = require('slug'),
    exec     = require('child_process').execSync;


function isEmpty(answer) {
  return answer.replace(/ /g, '') !== '';
}

function getAuthor() {
  var stdout = exec('git config user.name && git config user.email', { encoding:"utf8" }).split('\n');
  return stdout[ 0 ] + ' <' + stdout[ 1 ] + '>';
}

function getShortName(obj) {
  var client = obj.client.toLowerCase();
  var project = obj.project.toLowerCase();
  return slug(client) + '_' + slug(project);
}

var questions = [
  { name:'project', message:'Project\'s name?', validate:isEmpty },
  { name:'client', message:'Client\'s name?', validate:isEmpty },
  { name:'moveon', message:'Continue?', type:'confirm' }
];

gulp.task('default', function (done) {
  inquirer.prompt(questions, function (answers) {
    if (!answers.moveon) {
      return done();
    }

    answers.author = getAuthor();
    answers.shortName = getShortName(answers);

    gulp.src(__dirname + '/template/**', { dot:true })
      .pipe(template(answers))
      .pipe(conflict('./'))
      .pipe(gulp.dest('./'))
      .pipe(install())
      .on('end', done)
      .resume();
  });
});
