import domready from 'domready';
import mainView from './view/main';


const app = {

  /**
   * Setup and configs
   */
  init() {

  },


  /**
   * Renders a Ractive instance
   */
  render() {

    const view = mainView();

  }

};


domready(() => {

  app.init();
  app.render();

});
