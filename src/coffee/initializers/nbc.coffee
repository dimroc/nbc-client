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

  @constants:
    AWSAccessKeyId: "AKIAJDXHDWWVPG5LCKCQ"
    policy: "eyJleHBpcmF0aW9uIjoiMjAxOS0wMS0wMVQwMDowMDowMFoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJuZXdibG9ja2NpdHlfZGV2X3VwbG9hZHMifSx7ImFjbCI6InB1YmxpYy1yZWFkIn0seyJDb250ZW50LVR5cGUiOiJ2aWRlby9xdWlja3RpbWUifSxbInN0YXJ0cy13aXRoIiwiJGtleSIsIm5iYy1waG9uZWdhcCJdLHsic3VjY2Vzc19hY3Rpb25fcmVkaXJlY3QiOiJodHRwOi8vbG9jYWxob3N0OjkwMDEvIn0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwxMDQ4NTc2MDBdXX0="
    signature: "em5ESalb66muSpqNBA9xxnneF04="
