/*auto-generated*/
var modules = {};
{{#modules}}modules['ui-{{name}}'] = require('./{{file}}');{{/modules}}

module.exports = modules;
