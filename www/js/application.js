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

    function NBC() {
      this.block = new NBC.Block();
      this.blockView = new NBC.BlockView({
        model: this.block
      });
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
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NBC.Block = (function(_super) {
    __extends(Block, _super);

    function Block() {
      _ref = Block.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Block.prototype.toString = function() {
      return "path: " + (this.get('path'));
    };

    return Block;

  })(Backbone.Model);

}).call(this);

(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  NBC.BlockView = (function(_super) {
    __extends(BlockView, _super);

    function BlockView() {
      this.videoErrored = __bind(this.videoErrored, this);
      this.videoRecorded = __bind(this.videoRecorded, this);      _ref = BlockView.__super__.constructor.apply(this, arguments);
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
      if (navigator.device) {
        console.debug("Recording video...");
        return navigator.device.capture.captureVideo(this.videoRecorded, this.videoErrored);
      } else {
        return console.warn("Unable to record. No device.");
      }
    };

    BlockView.prototype.videoRecorded = function(mediaFiles) {
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
      this.model.set('path', paths[0]);
      return console.debug("model set to: " + (this.model.toString()));
    };

    BlockView.prototype.videoErrored = function() {
      console.error("video errored", arguments);
      return navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };

    return BlockView;

  })(Backbone.View);

}).call(this);
