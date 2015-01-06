gulp = require "gulp"


settings    = require "./settings"


gulp.task "watch", ["server"], ->
  gulp.watch "#{settings.path.source.css}/**/**.styl", ["stylus"]
