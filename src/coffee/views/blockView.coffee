class NBC.BlockView extends Backbone.View
  events:
    "click .record.video": "recordVideo",

  render: ->
    output = JST["templates/jqueryMobileShell"]()
    @$el.html(output)
    @

  recordVideo: ->
    block = NBC.Block.create()
    block.recordVideo()
