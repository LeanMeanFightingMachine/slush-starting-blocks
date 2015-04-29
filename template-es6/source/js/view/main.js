import Ractive from 'ractive';
import RactiveModules from '../module';
import template from './main.html';

export default function() {

  return new Ractive({

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

}
