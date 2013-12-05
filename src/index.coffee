paperclip = require "paperclip"
type      = require "type-component"

class PaperclipViewDecorator  

  ###
  ###

  constructor: (@view) ->
    @view.on "render", @render
    @view.on "remove", @remove
    @view.bind("paper").to(@_onTemplateChange).now()

  ###
  ###

  _onTemplateChange: (template) =>

    if type(template) isnt "function"
      throw new Error "paper template must be a function for view \"#{@view.constructor.name}\""

    # make the template
    @template = paperclip.template template, @view.application

    # rendered? re-render
    if @_rendered
      @dispose()
      @render()


  ###
  ###

  render: () =>

    # dispose just incase
    @remove()

    @_rendered = true

    # return if there isn't a template
    return unless @template

    # create the content, and add to the view
    @view.section.append (@content = @template.bind(@view)).toFragment()


  ###
  ###

  remove: () =>
    return unless @content
    @content.dispose()

  ###
  ###
  
  @getOptions : (view) -> view.__isView
  @decorate   : (view, options) -> new PaperclipViewDecorator view, options


module.exports = (app) -> 
  app.decorator module.exports.decorator
module.exports.decorator = { 
  priority: "render"
  decorator: PaperclipViewDecorator, 
  inheritable: false 
}