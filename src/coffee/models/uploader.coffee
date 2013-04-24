class NBC.Uploader extends Backbone.Events
  constructor: (block) ->
    @block = block
    @dfd = $.Deferred()

  promise: ->
    @dfd.promise()

  upload: ->
    videoUploader = new Uploader.Video(@block)

    #blockUploader = new Uploader.Block(@block)
    #pandaUploader = new Uploader.Panda()

    #videoUploader.promise().then(blockUploader.upload)
    #blockUploader.promise().then(pandaUploader.upload)
    #pandaUploader.promise().then(@_handleSuccess)

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
