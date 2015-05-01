var gulp = require('gulp');
var install = require('gulp-install');
var template = require('gulp-template');
var inquirer = require('inquirer');
var slug = require('slug');
var exec = require('child_process').execSync;
var path = require('path');

var questions = [
  { name: 'project', message: 'Project\'s name?', validate: isEmpty },
  { name: 'client', message: 'Client\'s name?', validate: isEmpty },
  {
    name: 'css',
    message: 'Will you need SCSS?',
    type: 'confirm',
    default: true
  },
  {
    name: 'js',
    message: 'Will you need JavaScript?',
    type: 'confirm',
    default: true
  },
  {
    name: 'es6',
    message: 'Use ES6 for this project?',
    type: 'confirm',
    default: false,
    when: function(answers) {

      return answers.js;

    }
  },
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

    var paths = [path.join(__dirname, '/template/**')];

    if (!answers.moveon) {

      return done();

    }

    if (answers.es6) {

      paths.push(path.join(__dirname, '/template-es6/**'));

    }

    if (!answers.js) {

      paths.push('!' + path.join(__dirname, '/template/source/js/**'));
      paths.push('!' + path.join(__dirname, '/template/tasks/module/**'));
      paths.push('!' + path.join(__dirname, '/template/tasks/script.js'));
      paths.push('!' + path.join(__dirname, '/template/tasks/test.js'));
      paths.push('!' + path.join(__dirname, '/template/.jscsrc'));
      paths.push('!' + path.join(__dirname, '/template/.eslintrc'));

    }

    if (!answers.css) {

      paths.push('!' + path.join(__dirname, '/template/source/css/**'));
      paths.push('!' + path.join(__dirname, '/template/tasks/style.js'));
      paths.push('!' + path.join(__dirname, '/template/tasks/watch.js'));

    }

    answers.author = getAuthor();
    answers.shortName = getShortName(answers);

    gulp.src(paths, { dot: true })
      .pipe(template(answers))
      .pipe(gulp.dest('./'))
      .pipe(install())
      .on('end', done)
      .resume();

  });

});
