gulp   = require "gulp"
del = require "del"

# Deletes the compiled js and css files and it's source maps
gulp.task "clean", (cb) ->
  del [
      "./public/js/app.js"
      "./public/css/app.css"
    ]
  , cb
