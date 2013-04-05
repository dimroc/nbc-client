singleton = null

class window.NBC
  @initialize: ->
    if(!singleton)
      singleton = new NBC()
      singleton.render()

  constructor: ->
    @block = new NBC.Block()
    @blockView = new NBC.BlockView(model: @block)

  render: ->
    stopScrolling = ( touchEvent ) -> touchEvent.preventDefault()
    document.addEventListener( 'touchstart' , stopScrolling , false )
    document.addEventListener( 'touchmove' , stopScrolling , false )

    @blockView.render()
    $("body").html(@blockView.$el)

