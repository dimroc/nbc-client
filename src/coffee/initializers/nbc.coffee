singleton = null

class window.NBC
  @constants:
    AWSAccessKeyId: "AKIAJDXHDWWVPG5LCKCQ"
    policy: "eyJleHBpcmF0aW9uIjoiMjAxOS0wMS0wMVQwMDowMDowMFoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJuZXdibG9ja2NpdHlfZGV2X3VwbG9hZHMifSx7ImFjbCI6InB1YmxpYy1yZWFkIn0seyJDb250ZW50LVR5cGUiOiJ2aWRlby9xdWlja3RpbWUifSxbInN0YXJ0cy13aXRoIiwiJGtleSIsIm5iYy1waG9uZWdhcCJdLFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwXV19"
    signature: "hZ9vxI1SogIN8vsI+ZaecvKebtk="

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
