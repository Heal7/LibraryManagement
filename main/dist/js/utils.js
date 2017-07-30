(function() {
  var Utils;

  Utils = (function() {
    function Utils() {}

    Utils.prototype.addEventHandler = function(ele, event, handler) {
      if (ele.addEventListener) {
        return ele.addEventListener(event, handler, false);
      } else if (ele.attachEvent) {
        return ele.attachEvent('on' + event, handler);
      } else {
        return ele['on' + event] = handler;
      }
    };

    return Utils;

  })();

  window.utils = new Utils();

}).call(this);
