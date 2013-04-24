class NBC.Uploader extends Backbone.Events
  constructor: (block) ->
    @block = block
    @dfd = $.Deferred()

  promise: ->
    @dfd.promise()

  upload: ->
    videoUploader = new Uploader.Video(@block)
    #blockUploader = new Uploader.Block(@block)

    #videoUploader.promise().then(blockUploader.upload)
    #blockUploader.promise().then(handlesuccess)

    $.when(videoUploader.promise()).then(
      @_handleSuccess,
      @_handleFailure)

    videoUploader.upload()
    @promise()

  _handleSuccess: =>
    @dfd.resolve()

  _handleFailure: =>
    console.warn "ERROR UPLOADING VIDEO"
    @dfd.reject()
