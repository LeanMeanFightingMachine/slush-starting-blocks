import Ractive from 'ractive';
import RactiveModules from '../module';
import template from './main.html';

Ractive.components = RactiveModules;

export default Ractive.extend({

  el: document.querySelector('.main'),

  template: template,

  data: {
  },

  computed: {
  },

  oninit() {
  },

  onrender() {
  }

});
