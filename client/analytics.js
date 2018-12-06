import * as utils from './plugins/utils';
import * as observer from './plugins/observer';
import timer from './plugins/timer';

let _config = {
  serviceUrl: 'http://localhost:3010/track',
  projectId: 'demo',
  tracker: {
    click: true,
    observer: true,
    timer: true,
    custom: true
  },
  respectDNT: true
};

let request;

// Global export for browser
export const init = config => {
  _config = utils.merge(_config, config || {});
  _config.session = utils.uuid();
  _config.device = utils.getWidth() > 680 ? 'desktop' : 'mobile';

  // Check if user disallows tracking and if we respect that decision
  if (utils.getDNTConsent() && _config.respectDNT) {
    registerTrackers();
  } else {
    send('custom-dnt-1');
  }
};

const registerTrackers = () => {
  if (_config.tracker.timer) {
    timer.init(send);
  }

  if (_config.tracker.click) {
    const clickables = document.querySelectorAll('[data-click]');

    Array.from(clickables).forEach(element => {
      const callback = utils.once(send);

      element.addEventListener('click', event => {
        let target = event.target;

        if (!target.getAttribute('data-click')) {
          target = target.parentNode;
        }

        callback('click-' + target.getAttribute('data-click'));
      });
    });
  }

  if (_config.tracker.observer) {
    const observables = document.querySelectorAll('[data-observer]');

    observer.init();

    Array.from(observables).forEach(obs => {
      const callback = utils.once(send);
      observer.add(obs, callback);
    });
  }

  // @todo: Pass a function instead
  if (_config.tracker.custom) {
    send('custom-my-event');
  }
};

const send = (string, value) => {
  const requestBody = JSON.stringify({
    session: _config.session,
    project: _config.projectId,
    device: _config.device,
    key: string || undefined,
    value: value || 1
  });

  // Don't track during development
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    /*eslint no-console: ["error", { allow: ["warn"] }] */
    console.warn('Tracking requests are disabled while working on localhost:', requestBody);
  } else {
    // Use sendBeacon if available ...
    if (typeof navigator.sendBeacon == 'function') {
      navigator.sendBeacon(_config.serviceUrl, JSON.stringify(requestBody));
      // .. else use good ol' XMLHttpRequest
    } else {
      if (request) { request.abort(); }
      request = new XMLHttpRequest();
      request.open('POST', _config.serviceUrl, true);
      request.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');
      request.send(JSON.stringify(requestBody));
    }
  }
};
