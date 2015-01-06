Ractive = require "ractive"
page = require "page"


module.exports = Ractive.extend

	el: document.body

	append: true

	template: require "main-view.html"

	data:
		view: "map"



	oninit: ->
		console.log "[main-view] init"

		@set_router()


	set_router: ->
		self = @

		page "/", ->
			console.log "[main-view] index"

			self.set "view": "index"

		page "/page1", (ctx) ->
			console.log "[main-view] page1"

			self.set "view": "page1"

		page "/page2", (ctx) ->
			console.log "[main-view] page2"

			self.set "view": "page2"

		page click: false, dispatch: true, hashbang: false
