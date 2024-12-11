# Scripts overview

The application uses Google Sheet as its main content management system. This document describes the purposes of those
scripts.

Initially the scripts fetch all the data from the defined Google Sheet document tab. However, for each script there is a
defined object that holds the names of the Google Sheet columns that the script takes into account. The object also
defines the name for the column that is used in the parsing phase as well as in the database.

This means that the Google Sheet can have however many columns, but only the ones defined in the 'keysMap' (or any other
name) object are taken into account in the scripts.

const keysMap = {
'ID': 'id',
'Action identifier (automatic)': 'variableName'
}

In this example, 'ID' is the name of a column in the GSheet document. The script fetches the data, takes the column with
name 'ID', uses the values from that column in the objects in a property named 'id'.

#### The Google Sheet document contains

- All question-specific data and their translations for each country & language (tabs named with country codes, such as
  FI, EE, PT...)
- All recommendation-specific data and their translations for each country & language (actions on country tabs FI, EE...
  and challenges & ideas on FI_ACT, EE_ACT...)

#### The scripts are used for two purposes

- To fetch and parse data from the sheet and export it to database (questions, recommendations, constants)
- To fetch and parse translations from the sheet and export it to JSON files in /enduser-ui (translations for
  questions & recommendations as well as some of the "static" [not customizable] translations)
  <br><br><br>

## Constants

### ImportParsers/constantFetchAndParse.ts

- Fetches and parses the constants from the specified Google Sheet document and range 'CONSTANTS'.

### Sync/constantExport.ts

- Calls constantFetchAndParse, validates and exports constants to database.

<br><br><br>

## Questions

### ImportParsers/questionsFetchAndParse.ts

- Fetches and parses questions from Google Sheet's country tabs. Returns an array of complete question objects (
  excluding translations, of course).

### Sync/questionExport.ts

- Calls questionsFetchAndParse, parses the question data out of every object</strong>, validates and exports them to
  database.
  <br><br><br>

## Actions

### ImportParsers/actionsFetchAndParse.ts

- Fetches and parses actions from Google Sheet's country action tabs. Returns an array of complete action objects (
  excluding translations, of course).

### Sync/actionExport.ts

- Calls actionsFetchAndParse.ts, validates the actions and exports them to database.
  <br><br><br>

## Translations

### ImportParsers/Translations/fetchQuestionTranslations.ts

- Fetches and parses translations for questions. Creates proper translation keys.

### ImportParsers/Translations/fetchActionTranslations.ts

- Fetches and parses translations for challenges & ideas. Creates translation keys. Unlike questions, actions between
  countries might share the same id, which is why it adds the language code to the end of the translations key (such as
  SD6124215_actionTitle_FI)

### Sync/actionsAndQuestionsTranslations.ts

- Calls <em>Translations/fetchQuestionTranslations.ts</em> and <em>Translations/fetchActionTranslations.ts</em>,
  combines their content by language and replaces old JSON files.

### ImportParsers/Translations/fetchStaticTranslations.ts

- Fetches and parses translations from Google Sheet's tab <em>Static translations</em>. There are now separate functions
  for different translations groups, such as email translations (createEmailTranslationFiles) and privacy policy
  translations (createPrivacyPolicyTranslationFile). These functions are ran in fetchStaticTranslations file. You can
  comment out the ones for those translations that do not require updating. This is a hacky solution, but there should
  only be few groups, and they allow customization.

<br><br><br>

# Using the scripts

- See [setting-up-environment.md](../../../../doc/setting-up-environment.md) for how to run the scripts.
