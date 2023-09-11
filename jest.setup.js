// jest.setup.js
import '@testing-library/jest-dom/extend-expect';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    NEXT_PUBLIC_RELAY_GELATO_API_KEY_GOERLI_OPTIMISM:
      'gelato_api_key_for_goerli_optimism_chain',
  },
}));

var localStorageMock = (function () {
  var store = {};
  return {
    getItem: function (key) {
      return store[key];
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
    removeItem: function (key) {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
