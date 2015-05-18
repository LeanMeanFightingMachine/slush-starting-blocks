var assert = require('assert');
var fs = require('fs');
var path = require('path');
var sass = require('node-sass');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
chai.use(require('chai-fs'));


describe("CSS:", function() {

  describe('font-face mixin', function() {

    it('should include a local font face', function(done) {

      parseAndTest('font-face', done);

    });

    it('should include a local bold font face', function(done) {

      parseAndTest('font-face.bold', done);

    });

    it('should include a local italic font face', function(done) {

      parseAndTest('font-face.italic', done);

    });

  });


  describe('position mixin', function() {

    it('absolute position', function(done) {

      parseAndTest('position.absolute', done);

    });

    it('fixed position', function(done) {

      parseAndTest('position.fixed', done);

    });

    it('relative position', function(done) {

      parseAndTest('position.relative', done);

    });

  });


  describe('pseudo-content mixin', function() {

    it('create a generic pseudo-element', function(done) {

      parseAndTest('pseudo-content', done);

    });

    it('create a generic pseudo-element with arguments', function(done) {

      parseAndTest('pseudo-content.arguments', done);

    });


    it('create a generic pseudo-element with a blue background', function(done) {

      parseAndTest('pseudo-content.blue', done);

    });

  });


  describe('retina mixin', function() {

    it('should display content only for retina displays', function(done) {

      parseAndTest('retina', done);

    });

  });


  describe('breakpoint mixins', function() {

    it('should display content only for small displays', function(done) {

      parseAndTest('break.small', done);

    });

    it('should display content only for medium displays', function(done) {

      parseAndTest('break.medium', done);

    });

    it('should display content only for large displays', function(done) {

      parseAndTest('break.large', done);

    });

  });

});




function parseAndTest(fixture, done) {

  var fileName = path.join(__dirname, '/fixtures/', fixture);
  renderSass(fileName + '.scss', function(err, css) {

    expect(fileName + '.css').to.have.content(css);
    done();

  });

}




function renderSass(file, done) {

  sass.render({
    file: file,
    outputStyle: 'expanded',
    includePaths: [path.join(__dirname, '../../template/source/css')]
  }, function(err, result) {

    done(err, result ? result.css.toString() : result);

  });

}
