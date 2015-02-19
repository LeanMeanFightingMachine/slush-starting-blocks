gulp       = require "gulp"
gutil      = require "gulp-util"
duration   = require "gulp-duration"
uglify     = require "gulp-uglify"
streamify  = require "gulp-streamify"
gulpif     = require "gulp-if"
source     = require "vinyl-source-stream"
browserify = require "browserify"
watchify   = require "watchify"
notifier   = require "node-notifier"


settings    = require "./settings"


gulp.task "coffee", ->
  output = settings.entry.js.split(".coffee").join(".js")
  debug = settings.debug

  bundler = browserify
    cache:{}, packageCache:{}, fullPaths:true, debug:debug
    entries: ["#{settings.path.source.js}/#{settings.entry.js}"]
    extensions: [".coffee"]
    paths: [
      settings.path.source.html
    ]

  bundler.transform if debug then "coffeeify" else "coffeeify/no-debug"
  bundler.transform "envify", NODE_ENV: if debug then "development" else "production"
  bundler.transform "aliasify"
  bundler.transform "debowerify"
  bundler.transform "ractivate"

  bundle = ->
    bundler.bundle()
      .on "error", coffeeError
      .pipe source(output)
      .pipe gulpif(!debug, streamify(uglify()))
      .pipe duration("watchify > script")
      .pipe gulp.dest(settings.path.public.js)

  bundler = watchify bundler
  bundler.on "update", bundle
  bundle()

coffeeError = (error) ->
  gutil.log gutil.colors.red("CoffeeScript Error:"), error

  notifier.notify
    title: "<%= project %>"
    message: "Error compiling CoffeeScript"
    icon: "#{settings.path.root}/branding.png"
    sound: "Basso"
