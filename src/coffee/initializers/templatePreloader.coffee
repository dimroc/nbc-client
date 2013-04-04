class TemplatePreloader
  preload: (path) ->
    template = null
    $.ajax(
      url: path,
      method: "GET",
      async: false,
      success: (data) ->
        template = data
    )

    template

preloader = new TemplatePreloader

templateFiles = [
  "templates/jqueryMobileShell.ejs"
]

window.JST = {}
for template in templateFiles
  compiled = _.template(preloader.preload(template))
  key = template.replace(/\.jst/, '')
  key = key.replace(/\.ejs/, '')
  JST[key] = compiled
