class NBC.Block extends Backbone.Model
  @create: (path) ->
    block = new NBC.Block(path: path)
    block._setCurrentPosition()
    block._setCurrentTime()
    block._setCurrentDirection()

    block

  initialize: ->
    NBC.events.trigger("block:start", @)

    $.when(block._positionDfd, block._directionDfd).then(->
      NBC.events.trigger("block:ready", block))

    @_positionDfd = $.Deferred()
    @_directionDfd = $.Deferred()

  _setCurrentPosition: (geopositions) =>
    navigator.geolocation.getCurrentPosition((geopositions) =>
      @.set('lat', geopositions[0].coords.lat)
      @.set('long', geopositions[0].coords.long)
      @_positionDfd.resolve()
    , @_handleError)

  _setCurrentTime: ->
    @.set('time', new Date())

  _setCurrentDirection: ->
    navigator.compass.getCurrentHeading((heading) =>
      console.log("direction", arguments)
      @.set('direction', heading.magneticHeading)
      @_directionDfd.resolve()
    , @_handleError)

  _handleError: ->
    console.warn "Failed to get block information", arguments

# Example path
# /private/var/mobile/Applications/870AA17D-E0D3-49AE-AFF3-49288FD61B3B/tmp/capture-T0x1f54cc40.tmp.vbqs4s/capturedvideo.MOV
