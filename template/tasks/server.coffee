fs          = require "fs"
path        = require "path"
url         = require "url"
gulp        = require "gulp"
browserSync = require "browser-sync"


settings    = require "./settings"


gulp.task "server", ["stylus", "coffee"], ->
  browserSync
    open: false
    files: [
      "#{settings.path.public.css}/*.css"
      "#{settings.path.public.js}/*.js"
      "./**/*.html"
    ]
    server:
      baseDir: settings.path.public.root
      middleware: (req, res, next) ->
        name = url.parse req.url
        name = name.href.split(name.search).join("")
        root = path.resolve(settings.path.root, settings.path.public.root)

        fileExists = fs.existsSync root + name
        fileExtension = path.extname name
        isBrowserSync = name.indexOf("browser-sync-client") >= 0

        if not fileExists and not isBrowserSync
          req.url = "/#{settings.server.fallback}"

        next()
