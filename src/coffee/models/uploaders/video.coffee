class NBC.Uploader.Video
  constructor: (block) ->
    @block = block
    @path = block.get('path') if block
    console.warn "UPLOADING EMPTY PATH" if !@path
    @dfd = $.Deferred()

  promise: ->
    @dfd.promise()

  uri: encodeURI("https://newblockcity_dev_uploads.s3.amazonaws.com/")

# Example path
# /private/var/mobile/Applications/870AA17D-E0D3-49AE-AFF3-49288FD61B3B/tmp/capture-T0x1f54cc40.tmp.vbqs4s/capturedvideo.MOV

  upload: =>
    @time = new Date().getTime()
    @destinationFileName = "nbc-phonegap-client-"+@time+".mov"
    @destinationUri = "#{@uri}nbc-phonegap-client-"+@time+".mov"

    @_updateBlock()

    # Phonegap specific libraries. Does not function on web.
    options = @_generateOptions()

    ft = new FileTransfer()
    ft.upload(
      @path,
      @uri,
      @_uploadSuccess,
      @_uploadFail,
      options)

  _uploadSuccess: (fileUploadResult) =>
    @result = fileUploadResult
    console.log(
      """
      upload success for #{@destinationFileName}
      response:\n#{@result.response}
      """)
    @dfd.resolve(@result)

  _uploadFail: (fileTransferError) =>
    @result = fileTransferError
    console.error(
      """
      upload fail:
      code:#{@result.code}
      source:#{@result.source}
      target:#{@result.target}
      http_status:#{@result.http_status}
      """)
    @dfd.reject(@result)

  _generateOptions: ->
    options = new FileUploadOptions()
    options.fileKey="file"
    options.fileName = @destinationFileName
    options.mimeType ="video/quicktime"
    options.chunkedMode = true

    access = new NBC.AwsAccess()

    options.params = {
      "key": @destinationFileName,
      "AWSAccessKeyId": access.awsAccessKeyId,
      "acl": "public-read",
      "policy": access.base64Policy,
      "signature": access.signature,
      "Content-Type": "video/quicktime"
    }
    options

  _updateBlock: ->
    @block.set('uploadTime', @time)
    @block.set('uploadUri', @destinationUri)
    @block.set('uploadFileName', @destinationFileName)