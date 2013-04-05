(function() {
  var singleton;

  singleton = null;

  window.NBC = (function() {
    NBC.initialize = function() {
      if (!singleton) {
        singleton = new NBC();
        return singleton.render();
      }
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
      document.addEventListener('touchstart', stopScrolling, false);
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
  NBC.Block = Backbone.Model.extend({});

}).call(this);

(function() {
  NBC.BlockView = Backbone.View.extend({
    render: function() {
      var output;

      output = JST["templates/jqueryMobileShell"]();
      this.$el.html(output);
      return this;
    },
    presenter: function() {
      return {};
    }
  });

}).call(this);
