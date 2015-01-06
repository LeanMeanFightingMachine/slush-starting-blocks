fs       = require "fs-extra"
gulp     = require "gulp"
gutil    = require "gulp-util"
dploy    = require "dploy"
inquirer = require "inquirer"
YAML     = require "yamljs"
When     = require "when"
execSync = require "execSync"


settings    = require "./settings"


gulp.task "dploy", (next) ->
	config = YAML.load("./dploy.yaml")

	keys = (key for key of config)

	get_server(config: config, servers: keys)
		.then get_version
		.then get_message
		.then bump_version
		.then create_history
		.then deploy
		.then display_message
		.then next


get_server = (obj) ->
	defer = When.defer()

	inquirer.prompt [
		name: "server"
		type: "checkbox"
		choices: obj.servers
		message: "Which environment you want to update?"
	], (result) ->
		obj.servers = result.server
		defer.resolve obj

	defer.promise


get_message = (obj) ->
	defer = When.defer()

	inquirer.prompt [
		name: "message"
		type: "input"
		message: "Describe what's being uploaded:"
	], (result) ->
		obj.message = result.message
		defer.resolve obj

	defer.promise


get_version = (obj) ->
	defer = When.defer()

	inquirer.prompt [
		name: "version"
		type: "list"
		choices: ["major", "minor", "patch"]
		message: "Is this a major, minor or patch upload?"
	], (result) ->
		obj.version = result.version
		defer.resolve obj

	defer.promise


bump_version = (obj) ->
	defer = When.defer()

	servers = obj.servers.join(", ")
	execSync.run "npm version #{obj.version} -m \"[#{servers}] #{obj.message}\""
	defer.resolve obj

	defer.promise

deploy = (obj, defer) ->
	defer = When.defer() unless defer

	return defer.resolve() unless obj.servers.length

	key = obj.servers.shift()
	deploy = new dploy obj.config[key], -> deploy obj, defer

	defer.promise


display_message = ->
	defer = When.defer()

	gutil.log gutil.colors.yellow("[dploy] don't forget to push your changes: ") + gutil.colors.green("git push --tags")

	defer.resolve()

create_history = (obj) ->
	defer = When.defer()

	content = "# DPLOY History\n"
	commits = execSync.exec "git log --decorate --all --oneline"
	commits = commits.stdout.split("\n").filter (el) -> el isnt ""
	commits = commits.map (el) -> parse_commit(el)
	has_tag = false

	for commit in commits
		if commit.tag
			content += "\n## #{commit.tag} #{commit.message}\n"
			has_tag = true
		else
			unless has_tag
				has_tag = true
				content += "\n## pre-release\n"
			content += "- #{commit.hash} #{commit.message}\n"

	fs.outputFile "./DPLOY_HISTORY.md", content, (error) ->
		execSync.run "git add ./DPLOY_HISTORY.md"
		execSync.run "git commit --amend --no-edit"

		defer.resolve(obj)

	defer.promise

parse_commit = (commit) ->
	reg = /\(tag:\s(.*?)\)/g
	match = reg.exec commit
	tag = match[1] if match

	commit = commit.replace reg, ""
	commit = commit.replace /[ ]{2,}/g, " "

	index = commit.indexOf(" ")
	hash: commit.slice(0, index), message: commit.slice(index + 1, commit.length), tag: tag
