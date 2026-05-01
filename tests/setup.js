import { plugin } from "bun";
import { mock } from "bun:test";
import { JSDOM } from "jsdom";

// Stub CSS/SCSS imports so source files like awesomeSezzle.js (which does
// `import "../css/global.scss"` for side effects) load under `bun test`.
plugin({
  name: "stub-css",
  setup(build) {
    build.onLoad({ filter: /\.s?css$/ }, () => ({
      contents: "export default {};",
      loader: "js",
    }));
  },
});

const jsdom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost",
  pretendToBeVisual: true,
});
const { window } = jsdom;

// Define critical DOM globals as writable so later code (or other tests) can
// override them. jsdom defines window.window as a non-writable getter, so
// copying its descriptor blindly produces read-only globals.
const explicitGlobals = {
  window,
  document: window.document,
  navigator: window.navigator,
  HTMLElement: window.HTMLElement,
  Element: window.Element,
};
for (const [key, value] of Object.entries(explicitGlobals)) {
  Object.defineProperty(globalThis, key, {
    value,
    writable: true,
    configurable: true,
    enumerable: true,
  });
}
globalThis.getComputedStyle = window.getComputedStyle.bind(window);

// Copy a fixed allowlist of jsdom globals onto globalThis. An allowlist keeps
// the surface area small and makes setup regressions easy to spot — a missing
// global throws here instead of silently leaving the test environment in a
// half-configured state.
const additionalGlobals = [
  "Node",
  "Event",
  "CustomEvent",
  "MouseEvent",
  "KeyboardEvent",
  "XMLHttpRequest",
  "localStorage",
  "sessionStorage",
  "location",
];

for (const key of additionalGlobals) {
  if (!(key in globalThis) && key in window) {
    Object.defineProperty(
      globalThis,
      key,
      Object.getOwnPropertyDescriptor(window, key),
    );
  }
}

globalThis.matchMedia =
  globalThis.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
};

globalThis.alert = mock(() => {});
