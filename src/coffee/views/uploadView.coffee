class NBC.UploadView extends Backbone.View
  render: ->
    console.log("rendering upload for block: #{@model.toString()}")
    $.mobile.changePage("templates/uploadPage.html")
