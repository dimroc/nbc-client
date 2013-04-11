class NBC.Uploader.Video
  constructor: (path) ->
    console.warn "UPLOADING EMPTY PATH" if !path
    @path = path
    @dfd = $.Deferred()

  promise: ->
    @dfd.promise()

  uri: encodeURI("https://newblockcity_dev_uploads.s3.amazonaws.com/")

# Example path
# /private/var/mobile/Applications/870AA17D-E0D3-49AE-AFF3-49288FD61B3B/tmp/capture-T0x1f54cc40.tmp.vbqs4s/capturedvideo.MOV

  upload: =>
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
    console.log "upload success: ", @result
    @dfd.resolve(@result)

  _uploadFail: (fileTransferError) =>
    @result = fileTransferError
    console.log "upload fail: ", @result
    @dfd.reject(@result)

  _generateOptions: ->
    time = new Date().getTime()
    fileName = "nbc-phonegap-client-"+time+".MOV"

    options = new FileUploadOptions()
    options.fileKey="file"
    options.fileName = fileName
    options.mimeType ="video/quicktime"
    options.chunkedMode = true

    policyDoc = "POLICY_DOC_GOES_HERE"
    signature = "SIGNATURE_GOES_HERE"

    options.params = {
      "key": fileName,
      "AWSAccessKeyId": "ACCESS_KEY_GOES_HERE",
      "acl": "public-read",
      "policy": policyDoc,
      "signature": signature,
      "Content-Type": "image/jpeg"
    }
    options
