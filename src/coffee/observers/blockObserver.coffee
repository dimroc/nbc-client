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

    uploader = new NBC.Uploader(block)
    new NBC.UploadView(model: uploader).render()

singleton = new NBC.BlockObserver
