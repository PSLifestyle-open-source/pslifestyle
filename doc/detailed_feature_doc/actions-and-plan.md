# Actions and Plan

## Overview

After questionnaire is filled by a users, they get an opportunity to select different footprint-reducing actions, which
are recommended to them based on answers selected in the questionnaire.

As a result, users can select any number of actions, creating their own actions plan. This plan can be later followed
by users (if user is authenticated), to see what actions were picked and how it impacts their plan of reducing carbon
footprint, as well as to track their progress.

## Actions management

Recommended actions are created and managed in Google Sheets, in country-specific sheet (name: `${countryCode}_ACT_2`).

More details can be found here:

- [actions](./google-sheets.md#actions)

After any changes are applied to these data, synchronization between GSheet and Firestore must be executed
using [GitHub Action](./google-sheets.md#data-synchronization-to-firestore)

## Actions to be displayed

Actions to be displayed to user are determined by "Display Condition" field in GSheet. It can include multiple
conditions, which when all of them are true, make an action to be visible to a user. Conditions can use constants
and [answer variables](./questionnaire.md#calculations).

Some of the actions can have also configured "skipIdsIfSelected" field. This field defines that if the action get
selected,
all other actions (from the list of IDs from that field) will get hidden from the user. This is made for the purpose of
avoiding contradicting actions, for example, to not display "Reduce flying", if user already selected action "Make your
holiday a staycation".

## Action impact calculation

Action impact is calculated using formula, which can use real values
and [answer variables](./questionnaire.md#calculations). There can be multiple formulas per action, and the one which
will be used is determined by the condition.
Formulas are managed in GSheet under `Impact formulas` column, and they have the following format:

`CONDITION1 ; ANOTHER_CONDITION2 | FORMULA1, CONDITION3 ; ANOTHER_CONDITION4 | FORMULA2`

For example:

```
QUESTION_A990DD6ACC6D039A_FOOTPRINT === -113 | 11.3 * ANSWER_FOO_HOW_MUCH
QUESTION_A990DD6ACC6D039A_FOOTPRINT === 51 | 31 * ANSWER_FOO_HOW_MUC, QUESTION_A990DD6ACC6D039A_FOOTPRINT === 449 | 71 * ANSWER_FOO_HOW_MUCH
QUESTION_A990DD6ACC6D039A_FOOTPRINT === 51 ; QUESTION_A990DD6ACC6D039A_FOOTPRINT === 55 | 31 * ANSWER_FOO_HOW_MUC, QUESTION_A990DD6ACC6D039A_FOOTPRINT === 449 | 71 * ANSWER_FOO_HOW_MUCH
```

Result of calculation is stored under `calculatedImpact` field, and then impact percentage is stored
under `percentReduction`field.

## Recommended actions

After filling a questionnaire, users are presented with list of recommended actions they can take to reduce their carbon
footprint. List of actions is determined [display condition](#actions-to-be-displayed).

Users can perform 3 actions with recommended actions:

### Choose it

This will add chosen action to the actions plan, increasing potential impact of how much footprint it can reduce.

### Skip action

Indicates to user that they decided to skip it

### I already do this

Action will not get visible on to the plan page, but is part of user's plan and it will reduce the user's footprint
which was determined based on questionnaire.

## Plan page

After actions are added to the plan, users can track progress of fulfilling these actions, and see how it impacts their
footprint.

When user finished the action, they can "complete" the action by clicking button, which would result in their footprint
impact bar to grow.

It is possible that user has answers selected in the past, for which formulas or other values differ comparing to the
time when they were added to the plan. In such case, data of actions will be updated on frontend (when loading
recommended actions + stored plan) and then persisted this way to the backend, if there is only newer version of action
(that's why action version is stored on per-action basis rather than in metadata).

## Plan persistence

After the recommended actions page, as well as after clicking "save" button on plan page, the plan actions are sent to
backend. It will firstly ensure that actions from plan are updated with the newest data (formulas, other values), and
then
recalculated and stored to the database.

We store plan set in the following format:

- **metadata**
  - **campaignIds**: list of campaign IDs to which the plan belongs to
  - **createdAt**: datetime of when the answer set was created "2023-11-13T11:06:48.250Z"
- **alreadyDoThisActions**: object with calculated actions, which impact is used to reduce final user's footprint.
- **selectedActions**: object with calculated action.
- **skippedActions**: List of skipped action IDs and reason of why they got skipped. Those actions will not be displayed
  to the user ever again

Example of stored plan selected action:

```json
{
  "actionsVersion": "2023-12-05T08:48:48.163Z",
  "calculatedImpact": 585,
  "category": "transport",
  "id": "AD371A08E7828613",
  "percentReduction": 8.234670267988713,
  "skipIdsIfSelected": [
    "71F460AE8D12D785",
    "95FAEDCF34BD58DE",
    "7AD662D5EB0F1D78",
    "9F2C4EE4D175D4C5"
  ],
  "state": "new",
  "tags": ["savemoney", "savetime", "community", "saveenergy", "newexperience"],
  "title": "Use bioethanol in your car",
  "type": "Action"
}
```

## Sequence diagram of the flow

### Recommended actions and plan initialization flow

```mermaid
sequenceDiagram
    title Recommended actions and plan initialization flow
    participant User
    participant Frontend
    participant Backend
    participant Database

    User ->> Frontend: Finished questionnaire or is an authenticated user with existing plan
    Frontend ->> Database: Request recommended actions for the country user
    Database ->> Frontend: Return recommended actions
    alt If user is authetnicated
        Frontend ->> Backend: Request user's stored plan
        Backend ->> Database: Fetch plan (if user has)
        Database ->> Backend: Return plan (if user has)
        Backend ->> Frontend: Return plan (if user has)
    end
    Frontend ->> Frontend: Determine which actions can be display for user based on display condition
    Frontend ->> Frontend: Calculate recommended actions impact
    alt If user is authenticated and has plan
        Frontend ->> Frontend: Update legacy actions with newer version of their data for each action possible
    end
    Frontend ->> Frontend: Initialize "User Plan" store with calculated recommended actions and (if user authenticated) user plan
```

### Operating on actions

```mermaid
sequenceDiagram
    title Operating on actions
    participant User
    participant Frontend
    participant Backend
    participant Database

    User ->> Frontend: Click 'Choose' button on recommended action
    Frontend ->> Frontend: Add action to the plan (selectedActions)
    Frontend ->> User: Render selected action in distinguishable way and how much it will impact the footprint once acommplished on the impact bar
    User ->> Frontend: Click 'Skip action' button on recommended action and select reason
    Frontend ->> Frontend: Add action to the list of skipped actions (skippedActions)
    Frontend ->> User: Mark action as skipped to the user
    User ->> Frontend: Click "I already do this" button on recommended action
    Frontend ->> Frontend: Add action to list of actions user already does (alreadyDoThisActions)
    Frontend ->> User: Render done action in distinguishable way and display to user the user footprint subtracted by action's impact.

    User ->> Frontend: Goes to plan page
    Frontend ->> User: Render plan page with chosen actions. Present original footprint subtracted by done actions, <br /> and how much impact can be done (by selected actions), and is already done (by completed action)
    User ->> Frontend: Click "complete action" button on plan page
    Frontend ->> Frontend: Change the state of the action from new to completed.
    Frontend ->> User: Render action as completed. Update impact bar.
```

### Persistence of plan

```mermaid
sequenceDiagram
    title Persistence of plan
    participant User
    participant Frontend
    participant Backend
    participant Database

    User ->> Frontend: Go from recommended actions page to plan page, or click "save" button on plan page
    Frontend ->> Backend: Send user's plan (/saveUserPlan endpoint)
    alt If plan data came with email+session token
        Backend ->> Backend: Validate user's session
    end
    Backend ->> Database: Fetch user's answers
    Database ->> Backend: Return user's answers
    Backend ->> Database: Fetch latest actions
    Database ->> Backend: Return latest actions
    Backend ->> Database: Fetch latest constants
    Database ->> Backend: Return latest constants
    Backend ->> Backend: Determine which actions can be display for user based on display condition
    Backend ->> Backend: Calculate recommended actions impact
    Backend ->> Backend: Prepare data to the desired format
    Backend ->> Backend: Filter out removed actions
    Backend ->> Database: Persist plan
    Database ->> Backend: Return persistence result
    Backend ->> Frontend: Return persistence result
    Frontend ->> User: Display persistence success or failure information
```
