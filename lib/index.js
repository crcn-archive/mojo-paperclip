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
    view.on("change:paper", onPaperChange);
    if (view.paper) onPaperChange(view.paper);

    function render () {
      remove(true);
      rendered = true;

      if (!template) return;

      content = template.bind(view, view.section);
    }

    function remove (hard) {
      if (!content) return;
      if (hard) {
        content.dispose();
      } else {
        runlater(function () {
          content.unbind();
        });
      }
    }

    function onPaperChange (paper) {
      if (!paper) return;

      if (typeof paper !== "function") {
        throw new Error("paper template must be a function for view '"+view.path()+"'");
      }

      template =  paperclip.template(paper, view.application);

      if (rendered) {
        render();
      }
    }
  }
}


module.exports = function (app) {
  app.decorator(decorator);
}