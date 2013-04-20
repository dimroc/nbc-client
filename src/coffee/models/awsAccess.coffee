class NBC.AwsAccess
  constructor: ->
    @base64Policy = "eyJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJuZXdibG9ja2NpdHlfZGV2X3VwbG9hZHMifSx7ImFjbCI6InB1YmxpYy1yZWFkIn0seyJDb250ZW50LVR5cGUiOiJ2aWRlby9xdWlja3RpbWUifSxbInN0YXJ0cy13aXRoIiwiJGtleSIsIm5iYy1waG9uZWdhcCJdLHsic3VjY2Vzc19hY3Rpb25fcmVkaXJlY3QiOiJodHRwOi8vbG9jYWxob3N0LyJ9LFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwXV19"
    @signature = "J4NcTsMaaLXQyu3ji0CyG8zN0GA="

  awsAccessKeyId: "AKIAJDXHDWWVPG5LCKCQ"

  policy:
    {
      #"expiration": "2009-01-01T00:00:00Z",
      "conditions": [
        {"bucket": "newblockcity_dev_uploads"},
        {"acl": "public-read"},
        {"Content-Type", "video/quicktime"},
        ["starts-with", "$key", "nbc-phonegap"],
        {"success_action_redirect": "http://localhost/"},
        ["content-length-range", 0, 104857600]
      ]
    }

  # ***** MUST KEEP POLICY ABOVE IN SYNC WITH Rakefile
  # Shit didn't work. Use Rake generated output

  #_generateSignature: (base64Policy) ->
    #awsSecretKey = "5fMCY7kabl5vmt/8F+xgaBgO7N1HqFlIGWGxkLTF"
    #signature = Crypto.HMAC(Crypto.SHA1, base64Policy, awsSecretKey)
    #debugger
    #signature

  #_generateBase64PolicyDocument: ->
    #stringified = JSON.stringify(@policy)
    #btoa(stringified)
