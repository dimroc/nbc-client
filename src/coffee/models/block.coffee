class NBC.Block extends Backbone.Model
  @create: (path) ->
    block = new NBC.Block()
    block._setCurrentPosition()
    block._setCurrentTime()
    block._setCurrentDirection()

    block

  initialize: ->
    @_positionDfd = $.Deferred()
    @_directionDfd = $.Deferred()
    @_videoDfd = $.Deferred()

    $.when(@_positionDfd, @_directionDfd, @_videoDfd).then(=>
      NBC.events.trigger("block:ready", @))

    NBC.events.trigger("block:start", @)

  toString: =>
    """
    block
    position: #{@get('latitude')}, #{@get('longitude')}
    time: #{@get('time')}
    direction: #{@get('direction')}
    path: #{@get('path')}
    """

  recordVideo: ->
    if navigator.device
      console.debug "Recording video..."
      navigator.device.capture.captureVideo(@_videoRecorded, @_videoErrored)
    else
      console.warn "Unable to record. No device."

  upload: ->
    console.debug("uploading block:\n#{JSON.stringify(@toJSON())}")

  _videoRecorded: (mediaFiles) =>
    paths = for file in mediaFiles
      file.fullPath

    console.debug "recorded to #{paths[0]}"
    @set('path', paths[0])
    @_videoDfd.resolve()

  _videoErrored: =>
    console.error "video errored", arguments
    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error')

  _setCurrentPosition: (geopositions) =>
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition((geopositions) =>
        @.set('latitude', geopositions.coords.latitude)
        @.set('longitude', geopositions.coords.longitude)
        @_positionDfd.resolve()
      , @_handleError)
    else
      console.warn("No geolocation available")
      @_positionDfd.resolve()

  _setCurrentTime: ->
    @.set('time', new Date())

  _setCurrentDirection: ->
    if (navigator.compass)
      navigator.compass.getCurrentHeading((heading) =>
        console.log("** setting direction: #{heading.magneticHeading}")
        @.set('direction', heading.magneticHeading)
        @_directionDfd.resolve()
      , @_handleError)
    else
      console.warn("No compass available")
      @_directionDfd.resolve()

  _handleError: ->
    console.warn "Failed to get block information", arguments

# Example path
# /private/var/mobile/Applications/870AA17D-E0D3-49AE-AFF3-49288FD61B3B/tmp/capture-T0x1f54cc40.tmp.vbqs4s/capturedvideo.MOV
