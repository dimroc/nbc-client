class NBC.Uploader extends Backbone.Events
  constructor: (block) ->
    @block = block
    @dfd = $.Deferred()

  promise: ->
    @dfd.promise()

  upload: =>
    console.log ("CREATING UPLOADERS")
    videoUploader = new Uploader.Video(@block)
    blockUploader = new Uploader.Block(@block)

    console.log("PROMISING UPLOADERS:VIDEO")
    videoUploader.promise().then(blockUploader.upload, @_handleFailure)
    console.log("PROMISING UPLOADERS:BLOCK")
    blockUploader.promise().then(@_handleSuccess, @_handleFailure)

    console.log("STARTING UPLOADERS")
    videoUploader.upload()
    @promise()

  _handleSuccess: =>
    @dfd.resolve()

  _handleFailure: =>
    console.warn "ERROR UPLOADING VIDEO"
    @dfd.reject()
