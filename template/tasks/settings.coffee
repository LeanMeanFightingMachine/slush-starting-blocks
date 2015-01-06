path  = require "path"
gutil = require "gulp-util"


module.exports =

  path:
    root: path.resolve(__dirname, "../")
    public:
      root : "./public"
      js   : "./public/js"
      css  : "./public/css"
      img  : "./public/img"
    source:
      js  : "./source/js"
      css : "./source/css"
      module: "./source/js/module"
      html: "./source/template"
    vendor: "./vendor"


  entry:
    js: "app.coffee"
    css: "app.styl"


  server:
    # Fallback if a file or path can't be found on the server
    fallback: "index.html"


  css:
    browsers: ["last 2 version", "ie 9"]


  debug: !gutil.env.build
