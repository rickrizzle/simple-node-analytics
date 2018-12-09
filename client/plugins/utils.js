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
