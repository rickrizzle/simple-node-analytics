var timer = (function () {

  'use strict';

  var prefixes = {};
  var seconds = 0;
  var timer;
  var callback;

  function init(_callback) {

    callback = _callback || function () {};
    prefixes = getVisabilityPrefix();

    document.addEventListener(prefixes.visibilityChange, handleChange, false);
    window.addEventListener('blur', stopTimer);
    window.addEventListener('focus', startTimer);

    startTimer();
  }

  function handleChange() {

    if (document[prefixes.hidden]) {

      stopTimer();
    } else {

      startTimer();
    }
  }

  function startTimer() {

    if (!timer) {

      timer = setInterval(tick, 1000);
    }
  }

  function stopTimer() {

    clearInterval(timer);
    timer = undefined;
  }

  function tick() {

    seconds++;

    // Only track full minutes
    if (seconds % 60 === 0) {

      // Only track up to half an hour
      if (seconds / 60 <= 30) {

        callback('timer-' + (seconds / 60) + '-minutes');
      }
    }
  }

  function getVisabilityPrefix () {

    var prefixes = {};

    if (typeof document.hidden !== 'undefined') {

      prefixes.hidden = 'hidden';
      prefixes.visibilityChange = 'visibilitychange';
    } else if (typeof document.mozHidden !== 'undefined') {

      prefixes.hidden = 'mozHidden';
      prefixes.visibilityChange = 'mozvisibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {

      prefixes.hidden = 'msHidden';
      prefixes.visibilityChange = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {

      prefixes.hidden = 'webkitHidden';
      prefixes.visibilityChange = 'webkitvisibilitychange';
    }

    return prefixes;
  }

  // Export global functions
  return {
    init: init
  };
})();

