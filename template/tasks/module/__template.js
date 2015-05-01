/**
 * @module:   {{name}}
 * @scss:     {{paths.scss}}
 * @html:     {{paths.html}}
 */
{{#shouldExtend}}
var Module = require('../{{nameExtend}}/{{nameExtend}}');{{/shouldExtend}}
{{^shouldExtend}}
var Module = require('../{{nameExtend}}');{{/shouldExtend}}

module.exports = Module.extend({

  template: require('./{{name}}.html')

});
