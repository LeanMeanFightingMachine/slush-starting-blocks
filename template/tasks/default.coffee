gulp = require "gulp"

gulp.task "default", [
  "clean"
  "stylus"
  "coffee"
  "server"
  "watch"
]
