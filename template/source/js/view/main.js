var Ractive = require('ractive');
require('../module');

module.exports = function(data) {

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
