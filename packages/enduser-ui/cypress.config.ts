import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on) {
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.name === "chrome") {
          // bypass proxy for the Firestore emulator host:port
          launchOptions.args.push(
            "--proxy-bypass-list=<-loopback>,localhost:5001",
          );
        }
        return launchOptions;
      });
    },
    excludeSpecPattern: [
      // disable testing all questionnaires by default
      "**/snapshot-test-all-questionnaires.cy.js",
    ],
    // use a longish timeout since running tests in CI may be quite slow
    defaultCommandTimeout: 20000,
    // test on large screen by default
    viewportWidth: 1024,
    viewportHeight: 768,
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
