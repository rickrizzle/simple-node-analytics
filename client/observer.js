var observer = (function () {

  'use strict';

  var _config = {
    delay: 100
  };

  var observables = [];

  function init(config) {

    _config = utils.merge(_config, config || {});

    var debouncedCheck = utils.debounce(check, _config.delay);

    window.addEventListener('resize', debouncedCheck, false);
    // window.addEventListener('scroll', debouncedCheck, false);
    window.addEventListener('scroll', check, false);
    window.addEventListener('next', check, false);
  }

  function add(element, callback) {

    observables.push({
      element: element,
      callback: callback,
      visibility: false
    });
  }

  // Check if visibility has changed
  function check() {

    observables.forEach(function (obs) {

      var visibility = isVisible(obs.element);

      if (visibility !== obs.visibility) {

        if (visibility) {

          obs.callback('observer-' + obs.element.getAttribute('data-observer'));
        }

        obs.visibility = visibility;
      }
    });
  }

  // Check if element is fully visible in viewport
  // https://stackoverflow.com/a/7557433/2037629
  function isVisible(element) {

    var rect = element.getBoundingClientRect();
    var page = document.querySelector('.slider').getBoundingClientRect();

    return (
      // Mobile
      rect.right - rect.width == page.width ||
      // Desktop
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Export global functions
  return {
    init: init,
    add: add,
    check: check
  };
})();
