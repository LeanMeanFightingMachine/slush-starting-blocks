gulp  = require "gulp"
gutil = require "gulp-util"
del   = require "del"

settings  = require "./settings"

# Deletes the compiled js and css files and it's source maps
gulp.task "clean", (cb) ->
  js = "#{settings.path.public.js}/#{settings.entry.js}"
  css = "#{settings.path.public.css}/#{settings.entry.css}"

  js = js.replace /\.coffee/g, ".js"
  css = css.replace /\.styl/g, ".css"

  gutil.log gutil.colors.red("[clean]"), [js, css]

  del [js, css], cb
