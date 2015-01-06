dat = require "dat-gui"
page = require "page"


gui = window._gui = new dat.GUI()

options =
	"debug": false
	"index": -> page "/"
	"page1": -> page "/page1"
	"page2": -> page "/page2"


module.exports = ->
	# debug
	debug = gui.add(options, "debug")

	# navigation
	folder = gui.addFolder("navigation")
	folder.add(options, "index").name("/index")
	folder.add(options, "page1").name("/page1")
	folder.add(options, "page2").name("/page2")
	folder.open()
