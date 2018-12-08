// Does nothing
export const noop = () => {};

// Makes a function only executable once
export const once = func => {
  let executed = false;

  return function() {
    if (!executed) {
      executed = true;
      return func.apply(this, arguments);
    }
  };
};

// Get device width
export const getWidth = () => {
  return parseInt(window.innerWidth > 0 ? window.innerWidth : screen.width);
};

// Generates a unique ID (good, but not RFC compliant)
// https://gist.github.com/gordonbrander/2230317
export const uuid = () => {
  return Math.random()
    .toString(36)
    .slice(2);
};

// Get user do-not-track settings
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/doNotTrack
export const getDNTConsent = () => {
  if (typeof navigator.doNotTrack != 'undefined') {
    return navigator.doNotTrack == '1' ? false : true;
  } else {
    return true;
  }
};
