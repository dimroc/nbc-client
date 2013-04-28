class NBC.Block extends Backbone.Model
  urlRoot: "http://localhost:3000/client/blocks"

  initialize: ->
    @_positionDfd = $.Deferred()
    @_directionDfd = $.Deferred()
    @_videoDfd = $.Deferred()

    @_setCurrentPosition()
    @_setCurrentTime()
    @_setCurrentDirection()
    @_setDestinationPath()

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
    destinationPath: #{@get('destinationPath')}
    destinationUri: #{@get('destinationUri')}
    """

  recordVideo: ->
    if navigator.device
      console.debug "Recording video..."
      navigator.device.capture.captureVideo(@_videoRecorded, @_videoErrored)
    else
      console.warn "Unable to record. No device. Using fake path."
      @_videoRecorded([{fullPath: "BogusPath"}])

  _videoRecorded: (mediaFiles) =>
    paths = for file in mediaFiles
      file.fullPath

    console.debug "recorded to #{paths[0]}"
    @set('path', paths[0])
    @_videoDfd.resolve()

  _videoErrored: =>
    console.error "video errored", arguments
    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error')

  _setCurrentPosition: =>
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
      @.set('direction', 'unavailable')
      @_directionDfd.resolve()

  _setDestinationPath: ->
    timeValue = @.get('time').getTime()
    destinationFileName = "nbc-phonegap-client-"+timeValue+".mov"
    @.set('destinationPath', destinationFileName)

  _handleError: =>
    msg = arguments[0].message if arguments[0]
    console.warn "Failed to get block information: #{msg}"

    if(window.app.runningInPcBrowser)
      console.warn "RUNNING IN BROWSER: SETTING BOGUS GEOLOCATION"
      @.set('latitude', -73.9973624120529)
      @.set('longitude', 40.5279133236147)
      @_positionDfd.resolve()
