class NBC.BlockView extends Backbone.View
  events:
    "click .record.video": "recordVideo",

  render: ->
    output = JST["templates/jqueryMobileShell"]()
    @$el.html(output)
    @

  recordVideo: ->
    block = new NBC.Block()
    block.recordVideo()
