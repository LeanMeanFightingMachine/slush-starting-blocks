glob     = require "glob"
expand   = require "glob-expand"
fs       = require "fs-extra"
path     = require "path"
del      = require "del"
gulp     = require "gulp"
gutil    = require "gulp-util"
notifier = require "node-notifier"
sh       = require("child_process").execSync


settings    = require "./settings"


gulp.task "module", (cb) ->
  user = get_user()
  name = gutil.env.add or gutil.env.delete or gutil.env.remove
  name_extend = "abstract-module"
  if name.indexOf(":") > 0
    name_split = name.split(":")
    name = name_split[0]
    name_extend = name_split[1]

  paths =
    css: "#{settings.path.source.css}/module/#{name}.styl"
    js: "#{settings.path.source.js}/module/#{name}.coffee"
    html: "#{settings.path.source.html}/module/#{name}.html"

  if gutil.env.delete or gutil.env.remove
    delete_modules paths, ->
      generate_css_app()
      generate_js_app()

      notifier.notify
        title: "<%= project %>"
        message: "The component #{name} was deleted."
        icon: "#{settings.path.root}/branding.png"
        sound: "Glass"

      cb()
  else
    return cb() if check_module_exists name, paths

    create_css user, name, paths
    create_js user, name, name_extend, paths
    create_html user, name, paths

    generate_css_app()
    generate_js_app()

    notifier.notify
      title: "<%= project %>"
      message: "The component #{name} was created!"
      icon: "#{settings.path.root}/branding.png"
      sound: "Glass"

    cb()



get_user = ->
  name = sh.exec("git config --get user.name", { encoding: "utf8" }).replace("\n", "")
  email = sh.exec("git config --get user.email", { encoding: "utf8" }).replace("\n", "")
  name: name, email: email


delete_modules = (paths, cb) ->
  del [paths.css, paths.js, paths.html], cb


check_module_exists = (name, paths) ->
  err = false

  if fs.existsSync(paths.css)
    err = true
    message = "The Stylus module \"#{name} already\" exists"
    gutil.log gutil.colors.red("Module Error:"), message

    notifier.notify
      title: "<%= project %>"
      message: message
      icon: "#{settings.path.root}/branding.png"
      sound: "Basso"

  if fs.existsSync(paths.js)
    err = true
    message = "The CoffeeScript module \"#{name}\" already exists"
    gutil.log gutil.colors.red("Module Error:"), message

    notifier.notify
      title: "<%= project %>"
      message: message
      icon: "#{settings.path.root}/branding.png"
      sound: "Basso"

  if fs.existsSync(paths.html)
    err = true
    message = "The HTML module \"#{name}\" already exists"
    gutil.log gutil.colors.red("Module Error:"), message

    notifier.notify
      title: "<%= project %>"
      message: message
      icon: "#{settings.path.root}/branding.png"
      sound: "Basso"

  err



create_css = (user, name, paths) ->
  data = """
  /**
  \t@module:   #{name}
  \t@author:   #{user.name} <#{user.email}>
  \t@css:      #{paths.css}
  \t@js:       #{paths.js}
   */

  .#{name}
  \tcontent: "#{name} :)"

  """

  fs.outputFileSync paths.css, data


create_js = (user, name, name_extend, paths) ->
  template = "module/#{name}.html"
  data = """
  ###
  \t@module:   #{name}
  \t@author:   #{user.name} <#{user.email}>
  \t@css:      #{paths.css}
  \t@html:     #{paths.html}
  ###


  Module = require "./#{name_extend}"


  module.exports = Module.extend

  \ttemplate: require "#{template}"

  \toninit: ->
  \t\tconsole.log "#{name} :)"


  """

  fs.outputFileSync paths.js, data


create_html = (user, name, paths) ->
  data = """
  <!--
  \t@module:   #{name}
  \t@author:   #{user.name} <#{user.email}>
  \t@css:      #{paths.css}
  \t@js:       #{paths.js}
  -->

  <div class="#{name}">
  \t<h1>#{name} :)</h1>
  </div>

  """

  fs.outputFileSync paths.html, data


generate_css_app = ->
  app = "#{settings.path.source.css}/module/index.styl"
  data = """
  /*
  \tTHIS FILE IS GENERATED AUTOMATICALLY AND IT WILL
  \tBE REPLACED IF A NEW MODULE IS ADDED OR DELETED.
   */

  """

  modules = expand filter:"isFile", [
    "#{settings.path.source.css}/module/*.styl"
    "!#{settings.path.source.css}/module/index.styl"
  ]
  for module in modules
    module = path.relative "#{settings.path.source.css}/module", module
    module = "@import \"" + gutil.replaceExtension(module, "") + "\""
    data += module + "\n"

  fs.outputFileSync app, data


generate_js_app = ->
  modules = expand filter:"isFile", [
    "#{settings.path.source.js}/module/*.coffee"
    "!#{settings.path.source.js}/module/index.coffee"
    "!#{settings.path.source.js}/module/abstract-module.coffee"
  ]

  paths = ""

  for module in modules
    module = path.relative "#{settings.path.source.js}/module", module
    module = gutil.replaceExtension(module, "")
    paths += "Ractive.components[\"ui-#{module}\"] = require \"./#{module}\"\n\t"
    # module = "Ractive.components[\"module"]"

  data = """
  ###
  \tTHIS FILE IS GENERATED AUTOMATICALLY AND IT WILL
  \tBE REPLACED IF A NEW MODULE IS ADDED OR DELETED.
  ###
  Ractive = require "ractive"

  register = ->
  \t#{paths}
  \ttrue

  module.exports = register()
  """

  fs.outputFileSync "#{settings.path.source.js}/module/index.coffee", data
