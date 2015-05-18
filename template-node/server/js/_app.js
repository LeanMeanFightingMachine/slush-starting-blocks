var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var path = require('path');


// start express and the server
var app = express();
var port = process.env.PORT || 8000;
var server = app.listen(port);


// express configuration
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// static files from the "public" folder
app.use(express.static(path.join(process.cwd(), 'public')));

// for any other file, send the index file
app.use(function(req, res, next) {

  path.join(process.cwd(), 'public/index.html');

});
