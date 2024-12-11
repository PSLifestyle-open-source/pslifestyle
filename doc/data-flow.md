# Data flow

For fetching, the web app uses Firestore API to access Firestore directly. For sending data, the frontend calls cloud functions that also check authentication and validate data.

## Questionnaire

At the beginning the user chooses the country and language. When the questionnaire is being accessed, the app fetches the questions and constants for the chosen country (default constants are merged with country-specific constants). The questions array is saved in `availableQuestions` in state of `QuestionnaireWrapper`, and constants are saved in `mathScope` in `QuestionnaireContext`.

The questions are displayed one at a time, with navigation buttons and progress bar at the bottom of the screen. All questions are of multiple-choice type, mostly with 3-5 choice options.

When user clicks a choice option:

- The answer is saved to the correct set. In the case of positioning and demographic questions, the answer is set directly to `positioningAnswer` or `demographic` in `QuestionnaireContext`. In case of regular questions, the value of the choice option is evaluated against `mathScope` to get a numerical value and then the whole answer is saved into the array of `userAnswers`. The answer is a copy of the question plus the text of the answer, its value, variable name, and if needed also related variable name and its value.
- The choice's variable and its value are saved in `mathScope`, so that the app can use it in evaluating the upcoming formulas (so called related questions). For example, the formula of compensating for flights needs a variable from the previous question about the amount of flying.
- Formula of the question is added to the formulas array in `QuestionnaireContext`.
- The changes in `mathScope` (new variable and/or value) and in formulas array trigger recalculating of user's current footprint. The bar chart then reacts to the change in footprint, updating its data.
- Available questions and the formulas array are filtered against the display conditions. This prevents displaying irrelevant questions, for example when the user answers that they don't drive, we skip the question about kilometers driven and type of fuel.
- Index of displayed question is increased, so the next question is displayed.

When the user answers the last question, the outro is displayed. The user can still go back and change their answers. If they click "continue" button, their answers are saved and they are redirected to the results page.

The button triggers `sendAnswersToBackend()` which prepares the data, skips saving to database if the answer set is exactly the same, and calls the cloud function. The cloud function checks if the user is logged in and based on that decides which collection to save to, fills out metadata, validates against schemas and saves data to Firestore.

## Results

The results page component is relatively static. It gets the user's answer set either from `QuestionnaireContext` or if not available there, fetches it from the database (along with the constants to fill `mathScope`). Then the footprint by category and footprint by label are calculated. That data is used to display various kinds of charts and comparisons. "Continue" button takes the user to the recommendations page.

## Recommendations list

When the recommendations page is opened, country-specific recommendations are fetched from the database, filtered according to the display conditions, sorted by the highest impact, and irrelevant choices are skipped (that is, if choosing the option would increase the user's footprint). Then they are sorted by category and type, actions and challenges&ideas are set to their own states in `RecommendationsList`. The recommendations are displayed in categories, first the actions and then 5 challenges and ideas. More challenges and ideas can be displayed by clicking a button.

The user can use the checkbox on the recommendation card to add it to or remove it from `pickedActions` or `pickedChallengesIdeas` in `PlanContext`. When checking the checkbox, the option with the highest impact is chosen by default. When unchecking the checkbox, the recommendation is removed from the `picked` and the footprint is recalculated with user's original answer's values.

When an action is checked, user can choose an option (if there is more than one viable option). When a radio button of an option is clicked, that option's values and translation key override what was already saved for that action in `pickedActions`.

As the user chooses actions and their options, other actions' impact (shown by the corner number) might be changing as some of the actions depend on the same variables in `mathScope`. Choosing actions also triggers recalculating of the potential footprint, that is the future footprint if the user executes all the recommendations they are committing to.

After the user chooses at least one recommendation, they can click the "continue" button. Their plan is saved and they are redirected to the plan page.

The button triggers `sendPlanToBackend()` which prepares the data and calls the cloud function. The cloud function checks if the user is logged in and based on that decides which collection to save to, validates against schemas and saves data to Firestore.

## Plan

The `PlanList` component gets the user's picked actions and challenges&ideas from `PlanContext`. User's footprint, potential footprint and percent of plan progress (how much of the plan is marked as done) are available.

Using a button within the recommendation card, the user can mark a recommendation as done. If it's an action, it's impact is reflected in user's plan progress. If it's a challenge, a pop-up with action suggestion is displayed.

The user can save their updated plan with a click of a button, triggering `sendPlanToBackend()`, which prepares the data and calls the cloud function. The cloud function checks if the user is logged in and based on that decides which collection to save to, validates against schemas and saves data to Firestore.
