class NBC.UploadView extends Backbone.View
  # Doesn't work when using $.mobile.changePage
  # As a result, we don't have a this.el or this.$
  #events:
    #"click .start_upload": "startUpload"

  initialize: ->
    $.when(@model.promise()).then(
      @_handleSuccess,
      @_handleFailure)

  render: ->
    console.log("rendering upload for block: #{@model.block.toString()}")

    $.mobile.pageContainer.bind("pagechange", (evt) =>
      $("button.start_upload").click(@startUpload)
      $.mobile.pageContainer.unbind("pagechange")
    )

    $.mobile.changePage("templates/uploadPage.html")
    @setResult("")
    $(".spinner").hide()

  startUpload: =>
    uploadPromise = @model.upload()
    $(".spinner").show()

    $.when(uploadPromise).then(
      @_handleSuccess,
      @_handleFailure)

  _handleSuccess: =>
    console.log("SUCCESSFULLY UPLOADED ALL DATA")
    @setResult("SUCCESS")
    $(".spinner").hide()
    $("a[href=#shell]").click()

  _handleFailure: =>
    console.warn("FAILED TO UPLOAD", arguments)
    argumentString = arguments.join(",")
    $(".spinner").hide()
    @setResult("FAILURE: #{argumentString}")

  setResult: (result) =>
    $(".result").text(result)
