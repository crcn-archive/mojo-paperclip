paperclip = require "paperclip"
type      = require "type-component"

class PaperclipViewDecorator  

  ###
  ###

  constructor: (@view) ->
    @view.once "render", @render
    @view.once "dispose", @remove
    @view._define "paper"
    @view.bind("paper").to(@_onTemplateChange).now()

  ###
  ###

  _onTemplateChange: (template) =>

    if type(template) isnt "function"
      throw new Error "paper template must be a function for view \"#{@view.constructor.name}\""

    @template = paperclip.template template, @view.application

    if @_rendered
      @cleanup true
      @render()


  ###
  ###

  render: () =>
    @_rendered = true
    @content = undefined
    return unless @template
    @content = @template.bind @view
    @content.section.show()
    @view.section.append @content.section.toFragment()

  ###
  ###

  remove: () => 
    @cleanup()

  ###
  ###

  cleanup: (hide) =>
    @content?.unbind()
    if hide
      @content?.section.hide()

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