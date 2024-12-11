# User feedback

## Overview

Users can give general feedback what they think about the application, while they are on plan page.

## Feedback management

Feedback options are created and managed in Google Sheets, in country-specific sheet (with naming
format: `country code + "_FeedbackCard"`).
The structure is very simple: ID column, columns for translations to all needed languages and then the order in which
they should appear in Frontend.

Whenever any changes is applied to those sheets, data needs to be synchronized to Firestore
using [GitHub Action](./google-sheets.md#data-synchronization-to-firestore) to be displayed on Frontend.

## User feedback persistence

After user selects any number of feedback options, they are sent to the backend (Firebase
Functions), `/saveUserFeedback` endpoint, with user identificator, answer set ID for which it was answered and list of
selected options.

If user is authenticated, its session token will be verified.

In any case, the data will be enriched with campaign IDs belonging to the user, and then stored to `feedback`
collection, which is nested collection inside latest answers document (entity) inside `answers` collection, which is
also nested under the user document: `users(hashed email)/anonymousUsers(ID)->answers(most recent document)->feedback`

Date of feedback creation is an ID of the feedback entity.
