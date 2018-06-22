var analytics = (function () {

  'use strict';

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

  var request;

  function init(config) {

    _config = utils.merge(_config, config || {});
    _config.session = utils.uuid();
    _config.device = utils.getWidth() > 680 ? 'desktop' : 'mobile';

    registerTrackers();
  }

  function registerTrackers() {

    if (_config.tracker.timer) {

      timer.init(send);
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
  }

  function send(string, value) {

    var requestBody = JSON.stringify({
      // 'session': _config.session,
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

      if (request) { request.abort(); }

      request = new XMLHttpRequest();
      request.open('POST', _config.serviceUrl, true);
      request.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');
      request.send(requestBody);
    }
  }

  // Export global functions
  return {
    init: init,
    send: send
  };
})();
