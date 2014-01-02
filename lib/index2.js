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

    view._define("paper");

    var listening, rendered, content;

    view.bind("paper", function (paper) {

      var template;

      if (!paper) return;

      if (!listening) {
        listening = true;
        view.once("render", render);
        view.once("remove", remove);
        rendered = rendered || view._rendered;
      }


        console.log(view.constructor.name, view._rendered, rendered);

      if (typeof paper !== "function") {
        throw new Error("paper template must be a function for view '" + view.constructor.name + "'");
      }

      template = paperclip.template(paper, view.application);

      if (rendered) {
        render();
      }


      function render () {
        rendered = true;
        remove(true);

        if (!template) {
          return;
        }

        view.section.append((content = template.bind(view)).toFragment());
      }

      function remove (hard) {
        if (!content) return;
        if (hard) {
          content.dispose();
          content = undefined;
        } else {
          runlater(function () {
            content.unbind();
          });
        }
      }

    }).now();


  }
}


module.exports = function (app) {
  app.decorator(decorator);
}