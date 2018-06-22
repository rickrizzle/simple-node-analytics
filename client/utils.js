var utils = (function () {

  // Merge two objects, similar to Object.assign()
  function merge(obj1, obj2) {

    var result = {};

    Object.keys(obj1).forEach(function (key) {

      result[key] = obj1[key];
    });

    Object.keys(obj2).forEach(function (key) {

      result[key] = obj2[key];
    });

    return result;
  }

  // Makes nothing
  function noop() {}

  // Allows function execution only every x milliseconds
  // https://davidwalsh.name/javascript-debounce-function
  function debounce(func, delay) {

    var timer = null;

    return function () {

      var context = this;
      var args = arguments;

      clearTimeout(timer);

      timer = setTimeout(function () {

        func.apply(context, args);
      }, delay);
    };
  }

  // Makes a function only executable once
  function once(func) {

    var executed = false;

    return function () {

      if (!executed) {

        executed = true;
        return func.apply(this, arguments);
      }
    };
  }

  // Get device width
  function getWidth() {

    return parseInt((window.innerWidth > 0) ? window.innerWidth : screen.width);
  }

  // Generates a unique ID (good, but not RFC compliant)
  // https://gist.github.com/gordonbrander/2230317
  function uuid() {

    return Math.random().toString(36).slice(2);
  }

  return {
    merge: merge,
    noop: noop,
    debounce: debounce,
    once: once,
    getWidth: getWidth,
    uuid: uuid
  };
})();
