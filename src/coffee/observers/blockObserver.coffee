class NBC.BlockObserver extends Backbone.Events
  @instance: ->
    singleton

  constructor: ->
    NBC.events.on("block:start", @startHandler, @)
    NBC.events.on("block:ready", @readyHandler, @)

  startHandler: (block) ->
    console.log("observed block recorded...", block)
    #$.mobile.changepage("templates/uploadPage.html")

  readyHandler: (block) ->
    console.log("observed block readied...", block)

singleton = new NBC.BlockObserver
