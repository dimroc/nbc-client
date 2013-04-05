class NBC.BlockView extends Backbone.View
  events:
    "click .record.video": "recordVideo",

  render: ->
    output = JST["templates/jqueryMobileShell"]()
    @$el.html(output)
    @

  recordVideo: ->
    if navigator.device
      console.debug "Recording video..."
      navigator.device.capture.captureVideo(@videoRecorded, @videoErrored)
    else
      console.warn "Unable to record. No device."

  videoRecorded: (mediaFiles) =>
    paths = for file in mediaFiles
      file.fullPath

    console.debug "recorded to #{paths[0]}"
    @model.set('path', paths[0])
    console.debug "model set to: #{@model.toString()}"

  videoErrored: =>
    console.error "video errored", arguments
    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error')
