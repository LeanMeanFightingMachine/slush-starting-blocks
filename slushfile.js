var gulp = require('gulp');
var install = require('gulp-install');
var template = require('gulp-template');
var rename = require('gulp-rename');
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

    var paths = [path.join(__dirname, '/template/**'), '!**/*.DS_Store'];

    if (!answers.moveon) {

      return done();

    }

    if (answers.es6) {

      paths.push(path.join(__dirname, '/template-es6/**'));

    }

    if (!answers.js) {

      paths.push('!' + path.join(__dirname, '/template/source/js/**/**'));
      paths.push('!' + path.join(__dirname, '/template/tasks/module/**/**'));
      paths.push('!' + path.join(__dirname, '/template/tasks/_script.js'));
      paths.push('!' + path.join(__dirname, '/template/tasks/_test.js'));
      paths.push('!' + path.join(__dirname, '/template/.jscsrc'));
      paths.push('!' + path.join(__dirname, '/template/.eslintrc'));

    }

    if (!answers.css) {

      paths.push('!' + path.join(__dirname, '/template/source/css/**/**'));
      paths.push('!' + path.join(__dirname, '/template/tasks/_style.js'));
      paths.push('!' + path.join(__dirname, '/template/tasks/_watch.js'));

    }

    answers.author = getAuthor();
    answers.shortName = getShortName(answers);

    gulp.src(paths, { dot: true })
      .pipe(template(answers))
      .pipe(rename(function(file) {

        // remove the underscore from all files except SCSS files
        if (file.extname !== '.scss') {

          file.basename = file.basename.replace(/^_/g, '');

        }

      }))
      .pipe(gulp.dest('./'))
      .pipe(install())
      .on('end', done)
      .resume();

  });

});
