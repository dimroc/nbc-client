(function() {
  var singleton;

  singleton = null;

  window.NBC = (function() {
    NBC.instance = function() {
      if (!singleton) {
        singleton = new NBC();
      }
      return singleton;
    };

    NBC.events = _.extend({}, Backbone.Events);

    function NBC() {
      this.blockView = new NBC.BlockView();
    }

    NBC.prototype.render = function() {
      var stopScrolling;

      stopScrolling = function(touchEvent) {
        return touchEvent.preventDefault();
      };
      document.addEventListener('touchmove', stopScrolling, false);
      this.blockView.render();
      return $("body").html(this.blockView.$el);
    };

    NBC.constants = {
      AWSAccessKeyId: "AKIAJDXHDWWVPG5LCKCQ",
      policy: "eyJleHBpcmF0aW9uIjoiMjAxOS0wMS0wMVQwMDowMDowMFoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJuZXdibG9ja2NpdHlfZGV2X3VwbG9hZHMifSx7ImFjbCI6InB1YmxpYy1yZWFkIn0seyJDb250ZW50LVR5cGUiOiJ2aWRlby9xdWlja3RpbWUifSxbInN0YXJ0cy13aXRoIiwiJGtleSIsIm5iYy1waG9uZWdhcCJdLHsic3VjY2Vzc19hY3Rpb25fcmVkaXJlY3QiOiJodHRwOi8vbG9jYWxob3N0OjkwMDEvIn0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwxMDQ4NTc2MDBdXX0=",
      signature: "em5ESalb66muSpqNBA9xxnneF04="
    };

    return NBC;

  })();

}).call(this);

(function() {
  var TemplatePreloader, compiled, key, preloader, template, templateFiles, _i, _len;

  TemplatePreloader = (function() {
    function TemplatePreloader() {}

    TemplatePreloader.prototype.preload = function(path) {
      var template;

      template = null;
      $.ajax({
        url: path,
        method: "GET",
        async: false,
        success: function(data) {
          return template = data;
        }
      });
      return template;
    };

    return TemplatePreloader;

  })();

  preloader = new TemplatePreloader;

  templateFiles = ["templates/jqueryMobileShell.ejs"];

  window.JST = {};

  for (_i = 0, _len = templateFiles.length; _i < _len; _i++) {
    template = templateFiles[_i];
    compiled = _.template(preloader.preload(template));
    key = template.replace(/\.jst/, '');
    key = key.replace(/\.ejs/, '');
    JST[key] = compiled;
  }

}).call(this);

(function() {
  NBC.AwsAccess = (function() {
    function AwsAccess() {}

    AwsAccess.prototype.awsAccessKeyId = NBC.constants.AWSAccessKeyId;

    AwsAccess.prototype.base64Policy = NBC.constants.policy;

    AwsAccess.prototype.signature = NBC.constants.signature;

    AwsAccess.prototype.policy = {
      "conditions": [
        {
          "bucket": "newblockcity_dev_uploads"
        }, {
          "acl": "public-read"
        }, {
          "Content-Type": "Content-Type",
          "video/quicktime": "video/quicktime"
        }, ["starts-with", "$key", "nbc-phonegap"], {
          "success_action_redirect": "http://localhost:9001/"
        }, ["content-length-range", 0, 104857600]
      ]
    };

    return AwsAccess;

  })();

}).call(this);

(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NBC.Block = (function(_super) {
    __extends(Block, _super);

    function Block() {
      this._handleError = __bind(this._handleError, this);
      this._setCurrentPosition = __bind(this._setCurrentPosition, this);
      this._videoErrored = __bind(this._videoErrored, this);
      this._videoRecorded = __bind(this._videoRecorded, this);
      this.toString = __bind(this.toString, this);      _ref = Block.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Block.create = function(path) {
      var block;

      block = new NBC.Block();
      block._setCurrentPosition();
      block._setCurrentTime();
      block._setCurrentDirection();
      return block;
    };

    Block.prototype.initialize = function() {
      var _this = this;

      this._positionDfd = $.Deferred();
      this._directionDfd = $.Deferred();
      this._videoDfd = $.Deferred();
      $.when(this._positionDfd, this._directionDfd, this._videoDfd).then(function() {
        return NBC.events.trigger("block:ready", _this);
      });
      return NBC.events.trigger("block:start", this);
    };

    Block.prototype.toString = function() {
      return "block\nposition: " + (this.get('latitude')) + ", " + (this.get('longitude')) + "\ntime: " + (this.get('time')) + "\ndirection: " + (this.get('direction')) + "\npath: " + (this.get('path'));
    };

    Block.prototype.recordVideo = function() {
      if (navigator.device) {
        console.debug("Recording video...");
        return navigator.device.capture.captureVideo(this._videoRecorded, this._videoErrored);
      } else {
        console.warn("Unable to record. No device. Using fake path.");
        return this._videoRecorded([
          {
            fullPath: "BogusPath"
          }
        ]);
      }
    };

    Block.prototype._videoRecorded = function(mediaFiles) {
      var file, paths;

      paths = (function() {
        var _i, _len, _results;

        _results = [];
        for (_i = 0, _len = mediaFiles.length; _i < _len; _i++) {
          file = mediaFiles[_i];
          _results.push(file.fullPath);
        }
        return _results;
      })();
      console.debug("recorded to " + paths[0]);
      this.set('path', paths[0]);
      return this._videoDfd.resolve();
    };

    Block.prototype._videoErrored = function() {
      console.error("video errored", arguments);
      return navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };

    Block.prototype._setCurrentPosition = function(geopositions) {
      var _this = this;

      if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(function(geopositions) {
          _this.set('latitude', geopositions.coords.latitude);
          _this.set('longitude', geopositions.coords.longitude);
          return _this._positionDfd.resolve();
        }, this._handleError);
      } else {
        console.warn("No geolocation available");
        return this._positionDfd.resolve();
      }
    };

    Block.prototype._setCurrentTime = function() {
      return this.set('time', new Date());
    };

    Block.prototype._setCurrentDirection = function() {
      var _this = this;

      if (navigator.compass) {
        return navigator.compass.getCurrentHeading(function(heading) {
          console.log("** setting direction: " + heading.magneticHeading);
          _this.set('direction', heading.magneticHeading);
          return _this._directionDfd.resolve();
        }, this._handleError);
      } else {
        console.warn("No compass available");
        this.set('direction', 'unavailable');
        return this._directionDfd.resolve();
      }
    };

    Block.prototype._handleError = function() {
      var msg;

      if (arguments[0]) {
        msg = arguments[0].message;
      }
      console.warn("Failed to get block information: " + msg);
      if (window.app.runningInPcBrowser) {
        console.warn("RUNNING IN BROWSER: SETTING BOGUS GEOLOCATION");
        this.set('latitude', -73.9973624120529);
        this.set('longitude', 40.5279133236147);
        return this._positionDfd.resolve();
      }
    };

    return Block;

  })(Backbone.Model);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NBC.Uploader = (function(_super) {
    __extends(Uploader, _super);

    function Uploader(block) {
      this._handleFailure = __bind(this._handleFailure, this);
      this._handleSuccess = __bind(this._handleSuccess, this);      this.block = block;
      this.dfd = $.Deferred();
    }

    Uploader.prototype.promise = function() {
      return this.dfd.promise();
    };

    Uploader.prototype.upload = function() {
      var videoUploader;

      videoUploader = new Uploader.Video(this.block.get('path'));
      $.when(videoUploader.promise()).then(this._handleSuccess, this._handleFailure);
      videoUploader.upload();
      return this.promise();
    };

    Uploader.prototype._handleSuccess = function() {
      return this.dfd.resolve();
    };

    Uploader.prototype._handleFailure = function() {
      console.warn("ERROR UPLOADING VIDEO");
      return this.dfd.reject();
    };

    return Uploader;

  })(Backbone.Events);

}).call(this);

(function() {
  var singleton,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NBC.BlockObserver = (function(_super) {
    __extends(BlockObserver, _super);

    BlockObserver.instance = function() {
      return singleton;
    };

    function BlockObserver() {
      NBC.events.on("block:start", this.startHandler, this);
      NBC.events.on("block:ready", this.readyHandler, this);
    }

    BlockObserver.prototype.startHandler = function(block) {
      return console.log("observed block started: ", block);
    };

    BlockObserver.prototype.readyHandler = function(block) {
      var uploader;

      console.log("observed block readied: ", block);
      uploader = new NBC.Uploader(block);
      return new NBC.UploadView({
        model: uploader
      }).render();
    };

    return BlockObserver;

  })(Backbone.Events);

  singleton = new NBC.BlockObserver;

}).call(this);

(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NBC.BlockView = (function(_super) {
    __extends(BlockView, _super);

    function BlockView() {
      _ref = BlockView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BlockView.prototype.events = {
      "click .record.video": "recordVideo"
    };

    BlockView.prototype.render = function() {
      var output;

      output = JST["templates/jqueryMobileShell"]();
      this.$el.html(output);
      return this;
    };

    BlockView.prototype.recordVideo = function() {
      var block;

      block = NBC.Block.create();
      return block.recordVideo();
    };

    return BlockView;

  })(Backbone.View);

}).call(this);

(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NBC.UploadView = (function(_super) {
    __extends(UploadView, _super);

    function UploadView() {
      this.startUpload = __bind(this.startUpload, this);      _ref = UploadView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    UploadView.prototype.initialize = function() {
      return $.when(this.model.promise()).then(this._handleSuccess, this._handleFailure);
    };

    UploadView.prototype.render = function() {
      var _this = this;

      console.log("rendering upload for block: " + (this.model.block.toString()));
      $.mobile.pageContainer.bind("pagechange", function(evt) {
        $("button.start_upload").click(_this.startUpload);
        return $.mobile.pageContainer.unbind("pagechange");
      });
      return $.mobile.changePage("templates/uploadPage.html");
    };

    UploadView.prototype.startUpload = function() {
      return this.model.upload();
    };

    UploadView._handleSuccess = function() {
      console.log("SUCCESSFULLY UPLOADED ALL DATA");
      return UploadView.setResult("SUCCESS");
    };

    UploadView._handleFailure = function() {
      console.warn("FAILED TO UPLOAD", arguments);
      return UploadView.setResult("FAILURE");
    };

    UploadView.setResult = function(result) {
      return $("[data-role=content].result").text(result);
    };

    return UploadView;

  }).call(this, Backbone.View);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  NBC.Uploader.Video = (function() {
    function Video(path) {
      this._uploadFail = __bind(this._uploadFail, this);
      this._uploadSuccess = __bind(this._uploadSuccess, this);
      this.upload = __bind(this.upload, this);      if (!path) {
        console.warn("UPLOADING EMPTY PATH");
      }
      this.path = path;
      this.dfd = $.Deferred();
    }

    Video.prototype.promise = function() {
      return this.dfd.promise();
    };

    Video.prototype.uri = encodeURI("https://newblockcity_dev_uploads.s3.amazonaws.com/");

    Video.prototype.upload = function() {
      var ft, options;

      options = this._generateOptions();
      ft = new FileTransfer();
      return ft.upload(this.path, this.uri, this._uploadSuccess, this._uploadFail, options);
    };

    Video.prototype._uploadSuccess = function(fileUploadResult) {
      this.result = fileUploadResult;
      console.log("upload success\nresponse:\n" + this.result.response);
      return this.dfd.resolve(this.result);
    };

    Video.prototype._uploadFail = function(fileTransferError) {
      this.result = fileTransferError;
      console.error("upload fail:\ncode:" + this.result.code + "\nsource:" + this.result.source + "\ntarget:" + this.result.target + "\nhttp_status:" + this.result.http_status);
      return this.dfd.reject(this.result);
    };

    Video.prototype._generateOptions = function() {
      var access, fileName, options, time;

      time = new Date().getTime();
      fileName = "nbc-phonegap-client-" + time + ".MOV";
      options = new FileUploadOptions();
      options.fileKey = "file";
      options.fileName = fileName;
      options.mimeType = "video/quicktime";
      options.chunkedMode = true;
      access = new NBC.AwsAccess();
      options.params = {
        "key": fileName,
        "AWSAccessKeyId": access.awsAccessKeyId,
        "acl": "public-read",
        "policy": access.base64Policy,
        "signature": access.signature,
        "Content-Type": "video/quicktime"
      };
      return options;
    };

    return Video;

  })();

}).call(this);
