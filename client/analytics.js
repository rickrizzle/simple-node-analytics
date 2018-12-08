import * as utils from './plugins/utils';
import * as observer from './plugins/observer';
import timer from './plugins/timer';

let config = {
  serviceUrl: 'http://localhost:3010/track',
  projectId: 'demo',
  tracker: {
    click: true,
    observer: true,
    timer: true,
    custom: true
  },
  ignoreDNT: true
};

let request;

// Global export for browser
export const init = _config => {
  config = Object.assign(config, _config || {});
  config.session = utils.uuid();
  config.device = utils.getWidth() > 680 ? 'desktop' : 'mobile';

  // Check if user disabled tracking and if we respect that decision
  if (utils.getDNTConsent() || config.ignoreDNT) {
    registerTrackers();
  } else {
    send('client-dnt-enabled');
  }
};

const registerTrackers = () => {
  if (config.tracker.timer) {
    timer.init(send);
  }

  if (config.tracker.click) {
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

  if (config.tracker.observer) {
    const observables = document.querySelectorAll('[data-observer]');
    // const callback = utils.once(send);
    const callback = send;

    observer.init(observables, callback);
  }

  // @todo: Pass a function instead
  if (config.tracker.custom) {
    send('custom-my-event');
  }
};

const send = (string, value) => {
  const requestBody = JSON.stringify({
    session: config.session,
    project: config.projectId,
    device: config.device,
    key: string || undefined,
    value: value || 1
  });

  // Don't track during development
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    /*eslint no-console: ["error", { allow: ["warn"] }] */
    console.warn('Tracking requests are disabled while working on localhost:\n', requestBody);
  } else {
    // Use sendBeacon if available ...
    if (typeof navigator.sendBeacon == 'function') {
      navigator.sendBeacon(config.serviceUrl, JSON.stringify(requestBody));
      // .. else use good ol' XMLHttpRequest
    } else {
      if (request) { request.abort(); }
      request = new XMLHttpRequest();
      request.open('POST', config.serviceUrl, true);
      request.setRequestHeader('Content-Type', 'text/plain;charset=utf-8');
      request.send(JSON.stringify(requestBody));
    }
  }
};
