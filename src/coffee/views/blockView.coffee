NBC.BlockView = Backbone.View.extend({
  render: ->
    output = JST["templates/jqueryMobileShell"]()
    @$el.html(output)
    @

  presenter: ->
    {}
})
