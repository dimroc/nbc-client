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

  startUpload: =>
    @model.upload()

  @_handleSuccess: =>
    console.log("SUCCESSFULLY UPLOADED ALL DATA")
    @setResult("SUCCESS")
    #$.mobile.changePage("#shell")

  @_handleFailure: =>
    console.warn("FAILED TO UPLOAD", arguments)
    @setResult("FAILURE")
    #$.mobile.changePage("#shell")

  @setResult: (result) =>
    $("[data-role=content].result").text(result)
