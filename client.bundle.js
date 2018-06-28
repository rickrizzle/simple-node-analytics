var analytics =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// Merge two objects, similar to Object.assign()
var merge = exports.merge = function merge(obj1, obj2) {

  var result = {};

  Object.keys(obj1).forEach(function (key) {

    result[key] = obj1[key];
  });

  Object.keys(obj2).forEach(function (key) {

    result[key] = obj2[key];
  });

  return result;
};

// Makes nothing
var noop = exports.noop = function noop() {};

// Allows function execution only every x milliseconds
// https://davidwalsh.name/javascript-debounce-function
var debounce = exports.debounce = function debounce(func, delay) {

  var timer = null;

  return function () {

    var context = this;
    var args = arguments;

    clearTimeout(timer);

    timer = setTimeout(function () {

      func.apply(context, args);
    }, delay);
  };
};

// Makes a function only executable once
var once = exports.once = function once(func) {

  var executed = false;

  return function () {

    if (!executed) {

      executed = true;
      return func.apply(this, arguments);
    }
  };
};

// Get device width
var getWidth = exports.getWidth = function getWidth() {

  return parseInt(window.innerWidth > 0 ? window.innerWidth : screen.width);
};

// Generates a unique ID (good, but not RFC compliant)
// https://gist.github.com/gordonbrander/2230317
var uuid = exports.uuid = function uuid() {

  return Math.random().toString(36).slice(2);
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = exports.init = undefined;

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _config = { delay: 100 };
var observables = [];

var init = exports.init = function init(config) {

  _config = utils.merge(_config, config || {});

  var debouncedCheck = utils.debounce(check, _config.delay);

  window.addEventListener('resize', debouncedCheck, false);
  // window.addEventListener('scroll', debouncedCheck, false);
  window.addEventListener('scroll', check, false);
  window.addEventListener('next', check, false);
};

var add = exports.add = function add(element, callback) {

  observables.push({
    element: element,
    callback: callback,
    visibility: false
  });
};

// Check if visibility has changed
var check = function check() {

  observables.forEach(function (obs) {

    var visibility = isVisible(obs.element);

    if (visibility !== obs.visibility) {

      if (visibility) {

        obs.callback('observer-' + obs.element.getAttribute('data-observer'));
      }

      obs.visibility = visibility;
    }
  });
};

// Check if element is fully visible in viewport
// https://stackoverflow.com/a/7557433/2037629
var isVisible = function isVisible(element) {

  var rect = element.getBoundingClientRect();
  var page = document.querySelector('.slider').getBoundingClientRect();

  return (
    // Mobile
    rect.right - rect.width == page.width ||
    // Desktop
    rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var prefixes = {};
var seconds = 0;
var timer = void 0;
var callback = void 0;

exports.default = {
  init: function init(_callback) {

    callback = _callback || function () {};
    prefixes = getVisabilityPrefix();

    document.addEventListener(prefixes.visibilityChange, handleChange, false);
    window.addEventListener('blur', stopTimer);
    window.addEventListener('focus', startTimer);

    startTimer();
  }
};


var handleChange = function handleChange() {

  if (document[prefixes.hidden]) {

    stopTimer();
  } else {

    startTimer();
  }
};

var startTimer = function startTimer() {

  if (!timer) {

    timer = setInterval(tick, 1000);
  }
};

var stopTimer = function stopTimer() {

  clearInterval(timer);
  timer = undefined;
};

var tick = function tick() {

  seconds++;

  // Only track full minutes
  if (seconds % 60 === 0) {

    // Only track up to half an hour
    if (seconds / 60 <= 30) {

      callback('timer-' + seconds / 60 + '-minutes');
    }
  }
};

var getVisabilityPrefix = function getVisabilityPrefix() {

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
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

var _observer = __webpack_require__(1);

var observer = _interopRequireWildcard(_observer);

var _timer = __webpack_require__(2);

var _timer2 = _interopRequireDefault(_timer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _config = {
  serviceUrl: 'http://localhost:3010/track',
  projectId: 'demo',
  tracker: {
    click: true,
    observer: true,
    timer: true,
    custom: true
  }
};

var request = void 0;

// Global export for browser
var init = exports.init = function init(config) {

  _config = utils.merge(_config, config || {});
  _config.session = utils.uuid();
  _config.device = utils.getWidth() > 680 ? 'desktop' : 'mobile';

  registerTrackers();
};

var registerTrackers = function registerTrackers() {

  if (_config.tracker.timer) {

    _timer2.default.init(send);
  }

  if (_config.tracker.click) {

    var clickables = document.querySelectorAll('[data-click]');

    clickables.forEach(function (element) {

      var callback = utils.once(send);

      element.addEventListener('click', function (event) {

        var target = event.target;

        if (!target.getAttribute('data-click')) {

          target = target.parentNode;
        }

        callback('click-' + target.getAttribute('data-click'));
      });
    });
  }

  if (_config.tracker.observer) {

    var observables = document.querySelectorAll('[data-observer]');

    observer.init();

    observables.forEach(function (obs) {

      var callback = utils.once(send);
      observer.add(obs, callback);
    });
  }

  // @todo: Pass a function instead
  if (_config.tracker.custom) {

    send('my-custom-event');
  }
};

var send = function send(string, value) {

  var requestBody = JSON.stringify({
    'session': _config.session,
    'project': _config.projectId,
    'device': _config.device,
    'key': string || undefined,
    'value': value || 1
  });

  // Use sendBeacon if available ...
  if (typeof navigator.sendBeacon == 'function') {

    navigator.sendBeacon(_config.serviceUrl, requestBody);

    // .. else use good ol' XMLHttpRequest
  } else {

    if (request) {
      request.abort();
    }

    request = new XMLHttpRequest();
    request.open('POST', _config.serviceUrl, true);
    request.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');
    request.send(requestBody);
  }
};

/***/ })
/******/ ]);
//# sourceMappingURL=client.bundle.js.map