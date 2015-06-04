/*auto-generated*/
var Ractive = require('ractive');
{{#modules}}Ractive.components['ui-{{name}}'] = require('./{{file}}');
{{/modules}}
module.exports = Ractive;
