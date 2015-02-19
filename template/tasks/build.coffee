gulp     = require "gulp"
settings = require "./settings"

gulp.task "prep-build", (cb) ->
  settings.debug = false
  cb()

gulp.task "build", ["prep-build", "clean", "stylus", "coffee"]
