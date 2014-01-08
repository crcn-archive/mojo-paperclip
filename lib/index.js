var protoclass = require("protoclass"),
paperclip      = require("paperclip"),
runlater       = require("runlater").global;

var decorator = {

  /**
   */

  multi: false,

  /**
   */

  priority: "render",

  /** 
   */

  getOptions: function (view) { 
    return view.__isView;
  }, 

  /**
   */

  decorate: function (view, options) {

    var listening, rendered, content, template;
    view._define("paper");
    view.on("render", render);
    view.on("remove", remove);
    view.on("warm", render);
    view.on("change:paper", onPaperChange);
    if (view.paper) onPaperChange(view.paper);

    var paper;

    function render () {


      if (view.paper !== paper) {

        remove(true);

        paper = view.paper;

        if (typeof paper !== "function") {
          throw new Error("paper template must be a function for view '"+view.path()+"'");
        }


        template =  paperclip.template(paper, view.application);
      }

      rendered = true;

      if (!template) return;

      if (content) {
        //content.render();
        content.bind(view);
      } else {
        content = template.bind(view, view.section);
      }

    }

    function remove (hard) {
      if (!content) return;
      if (hard) {
        content.removeAllNodes();
        content.unbind();
        content = undefined;
      } else {
        content.unbind();
      }
    }

    function onPaperChange (paper) {
      if (rendered) {
        render();
      }
    }
  }
}


module.exports = function (app) {
  app.decorator(decorator);
}