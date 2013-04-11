class NBC.BlockObserver extends Backbone.Events
  @instance: ->
    singleton

  constructor: ->
    NBC.events.on("block:start", @startHandler, @)
    NBC.events.on("block:ready", @readyHandler, @)

  startHandler: (block) ->
    console.log("observed block started: ", block)

  readyHandler: (block) ->
    console.log("observed block readied: ", block)
    new NBC.UploadView(model: block).render()
    block.upload()

singleton = new NBC.BlockObserver
