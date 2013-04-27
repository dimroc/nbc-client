class NBC.Uploader.Block
  constructor: (block) ->
    @block = block
    console.warn "Block is EMPTY" unless block

  upload: ->
    @block.save(
      success: @_handleSuccess,
      error: @_handleError
    )

  _handleSuccess: =>
    console.log("Saved Block\n#{@block.toString()}")

  _handleError: =>
    console.error("Failed to save Block\n#{@block.toString()}")
