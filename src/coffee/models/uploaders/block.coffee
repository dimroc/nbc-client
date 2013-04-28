class NBC.Uploader.Block
  constructor: (block) ->
    @block = block
    @dfd = $.Deferred()
    console.warn "Block is EMPTY" unless block

  promise: =>
    @dfd.promise()

  upload: =>
    console.log("SAVING BLOCK\n#{@block.toString()}")
    @block.save(null, {success: @_handleSuccess, error: @_handleError})
    @dfd.promise()

  _handleSuccess: =>
    console.log("SAVED Block\n#{@block.toString()}")
    @dfd.resolve()

  _handleError: =>
    console.error("Failed to save Block\n#{@block.toString()}")
    @dfd.reject()
