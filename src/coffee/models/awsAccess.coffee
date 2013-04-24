class NBC.AwsAccess
  awsAccessKeyId: NBC.constants.AWSAccessKeyId
  base64Policy: NBC.constants.policy
  signature: NBC.constants.signature

  # Policy and Signature found in Rakefile

  #SUCCESS URL RETURNED:
  # http://localhost:9001/?bucket=newblockcity_dev_uploads&key=nbc-phonegap-test.mov&etag=%226e7389719479b3245e3af3656f4500bc%22

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
