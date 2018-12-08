import { detect } from 'detect-browser';

const browser = detect();

// Get user browser information
export const getBrowser = () => {
  return {
    name: browser ? browser.name : 'unknown',
    version: browser ? browser.version : 'unknown',
    os: browser ? browser.os : 'unknown'
  };
};
