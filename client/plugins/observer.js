import 'intersection-observer';

export const init = (observables, callback) => {
  const observer = new IntersectionObserver(observables => {
    Array.from(observables).forEach(obs => {
      if (obs.intersectionRatio > 0) {
        callback('observer-' + obs.element.getAttribute('data-observer'));
        console.log(`Element ${obs.target.dataset.id} moved into view`);
      } else {
        console.log(`Element ${obs.target.dataset.id} moved out of view`);
      }
    });
  });

  Array.from(observables).forEach(obs => {
    observer.observe(obs);
  });
};
