# Frontend of PSLifestyle web app

## Development Environment Setup

- create a `.env.development.local` file to store your development time
  environment variables (see documentation below for more
  information and available `.env.*` files for example values)
- run `pnpm install` to install dependencies
- run `pnpm dev` to run the app. It opens in browser at localhost:3000 (if the port is available).

## Environment Variables

- `VITE_USE_EMULATOR` Set to `true` if you want to connect to emulator instead of the real backend

## Available Scripts

In the package directory (`packages/enduser-ui`), you can run:

### `pnpm dev`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `pnpm tsc`

Run the TypeScript compiler.

### `pnpm lint`

Lint all relevant source files.

### `pnpm test`

Run all unit tests.

### `pnpm test:watch`

Launches the Vitest test runner in the interactive watch mode.

### `pnpm cy:run`

Run all Cypress E2E tests in non-interactive mode. Note that you need to have enduser-ui
running as well the backend to be able to complete the tests.

### `pnpm cy:open-e2e`

Launches Cypress GUI and watches for changes. In the GUI, click on the test to run it.

### `pnpm storybook`

Launches Storybook UI for developing components in a way isolated from the app.

### `pnpm build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes. Your app is ready to be deployed!

## Info About Legacy Tests (To Be Updated)

This test prepares list of all unique question paths for every country and executes them for every language.
The general flow is as follows:

1. `cypress.config.ts` - Uses Cypress's `before:run` event to prepare unique paths (by calling `preparePathsToTest`) to test and saves them to JSON file (done this way to work around Cypress limitation regarding promises)
2. `cypress/setup-cypress-tests.ts` - All the testing data preparation is happening here. It's called per country.
   1. We go recursively from the last question to the first (very important)
   2. Add variables from display condition and formulas needed by the question
   3. We check if question provides variable which is useful for question which will appear later
   4. We check if question fulfills a condition of question which will appear later. If it does, we split paths (or basically copy-paste), where one path is one where question fulfills next question condition, and another path is one which doesn't fulfill
   5. Take next (or technically, take previous, as we go backward) question and repeat steps 2-4
   6. When all questions are checked, check if we still have any unresolved variables or conditions. If so, throw an error
   7. Return unique paths
3. `cypress/e2e/snapshot-test-all-questionnaires.cy.js` - Execute tests for each country and language and every unique path for them:
   1. Load fixture data from JSON file created by cypress config file.
   2. Select country/language, confirm selection
   3. Fill questionnaire
   4. Go to results page
   5. Take snapshot test of user's footprint and comparison of that footprint to other countries average value
   6. Snapshots are stored to file `snapshots.json`

How to debug:
Test data are stored in `cypress/support/paths-to-json` in the following format:

```json
{
  "countryCode": [
     [{"questionKey":"01-01","choice":{"choiceValue":1,"choiceText":"1","choiceTranslationKey":"995AD4BCA440115C_choice1"}}, ...]
  ]
}
```

Where outer array represents list of all unique paths to test for country, and inner array represents list of questions and choices to select for that path.

The structure of the snapshot file is as follows:

```json
{"Full questionnaire test: test for country {COUNTRY_NAME}, language {LANGUAGE_NAME} and path key {NUMBER_OF_TESTED_PATH_INDEXED_FROM_0}-{SNAPSHOT_NUMBER_FOR_TEST}":"3644","Full questionnaire test: test for country {COUNTRY_NAME}, language {LANGUAGE_NAME} and path key {NUMBER_OF_TESTED_PATH_INDEXED_FROM_0}-{SNAPSHOT_NUMBER_FOR_TEST}":["9800 kg CO2","8600 kg CO2","8000 kg CO2","7700 kg CO2","7700 kg CO2","6100 kg CO2","5600 kg CO2","4700 kg CO2","3644 kg CO2","2500 kg CO2"], ...
```

If you want to limit countries/languages to be tested, related conditions can be added to the loops inside `cypress/e2e/snapshot-test-all-questionnaires.cy.js`
