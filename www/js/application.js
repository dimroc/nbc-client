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
