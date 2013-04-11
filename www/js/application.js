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
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NBC.Block = (function(_super) {
    __extends(Block, _super);

    function Block() {
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
        return console.warn("Unable to record. No device.");
      }
    };

    Block.prototype.upload = function() {
      return console.debug("uploading block:\n" + (JSON.stringify(this.toJSON())));
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
        return this._directionDfd.resolve();
      }
    };

    Block.prototype._handleError = function() {
      return console.warn("Failed to get block information", arguments);
    };

    return Block;

  })(Backbone.Model);

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
      console.log("observed block readied: ", block);
      new NBC.UploadView({
        model: block
      }).render();
      return block.upload();
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
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NBC.UploadView = (function(_super) {
    __extends(UploadView, _super);

    function UploadView() {
      _ref = UploadView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    UploadView.prototype.render = function() {
      console.log("rendering upload for block: " + (this.model.toString()));
      return $.mobile.changePage("templates/uploadPage.html");
    };

    return UploadView;

  })(Backbone.View);

}).call(this);
