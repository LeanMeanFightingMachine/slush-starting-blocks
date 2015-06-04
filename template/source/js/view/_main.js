var Ractive = require('../module');

module.exports = function() {

  return new Ractive({

    el: document.querySelector('.main'),

    template: require('./main.html'),

    data: {
    },

    computed: {
    },

    oninit: function() {
    },

    onrender: function() {
    }

  });

};
