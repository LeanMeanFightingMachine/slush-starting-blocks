gulp     = require "gulp"
gutil    = require "gulp-util"
stylus   = require "gulp-stylus"
plumber  = require "gulp-plumber"
prefix   = require "gulp-autoprefixer"
maps     = require "gulp-sourcemaps"
notifier = require "node-notifier"
rupture  = require "rupture"


settings    = require "./settings"


gulp.task "stylus", ->

  gulp
  	.src "#{settings.path.source.css}/#{settings.entry.css}"

    .pipe plumber()
    .pipe stylus(
      use: rupture()
      compress: !settings.debug
      sourcemap:
        inline: true
        sourceRoot: "."
        basePath: settings.path.public.css
      ).on "error", stylusError

    .pipe prefix settings.css.browsers

    .pipe gulp.dest "#{settings.path.public.css}/"


stylusError = (error) ->
  gutil.log gutil.colors.red("Stylus Error:\n"), gutil.colors.red(error.name + "\n"), error.message

  notifier.notify
    title: "<%= project %>"
    message: "Error compiling Stylus"
    icon: "#{settings.path.root}/branding.png"
    sound: "Basso"
