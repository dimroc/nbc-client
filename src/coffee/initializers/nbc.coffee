singleton = null

class window.NBC
  @instance: ->
    if(!singleton)
      singleton = new NBC()
    singleton

  @events: _.extend({}, Backbone.Events)

  constructor: ->
    @blockView = new NBC.BlockView()

  render: ->
    stopScrolling = ( touchEvent ) -> touchEvent.preventDefault()
    #document.addEventListener( 'touchstart' , stopScrolling , false )
    document.addEventListener( 'touchmove' , stopScrolling , false )

    @blockView.render()
    $("body").html(@blockView.$el)
