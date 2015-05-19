/*auto-generated*/
{{#modules}}import {{nameCamel}} from './{{file}}';
{{/modules}}
var modules = {};
{{#modules}}modules['ui-{{name}}'] = {{nameCamel}};
{{/modules}}
export default modules;
