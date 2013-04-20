require 'base64'
require 'openssl'
require 'digest/sha1'
require 'active_support'
require "active_support/core_ext/object"
require 'pry'

def policy_document
  {
    #"expiration": "2009-01-01T00:00:00Z",
    conditions: [
      {bucket: "newblockcity_dev_uploads"},
      {acl: "public-read"},
      {"Content-Type" => "video/quicktime"},
      ["starts-with", "$key", "nbc-phonegap"],
      {success_action_redirect: "http://localhost/"},
      ["content-length-range", 0, 104857600]
    ]
  }
end

desc "Generate AWS policy and signature base64 strings"
task :generate_aws_access do

  aws_secret_key = "5fMCY7kabl5vmt/8F+xgaBgO7N1HqFlIGWGxkLTF"
  policy = Base64.encode64(policy_document.to_json).gsub("\n","")

  hmac = OpenSSL::HMAC.digest(
    OpenSSL::Digest::Digest.new('sha1'), 
    aws_secret_key, 
    policy)

  signature = Base64.encode64(hmac).gsub("\n","")

  puts "POLICY:\n#{policy}"
  puts
  puts "HMAC:\n#{hmac}"
  puts
  puts "SIGNATURE:\n#{signature}"
end
