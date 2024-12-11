# Google Sheets

## Overview

## ID generation

Applicable to:

- Questions
- Actions
- Feedback

Steps:

1. Copy-paste following
   formula: `=CONCAT(DEC2HEX(RANDBETWEEN(0, 4294967295), 8),DEC2HEX(RANDBETWEEN(0, 4294967295), 8))` to any empty cell
2. Copy the value generated (for example, E463927A7DED7CCA)
3. Paste the value to the ID column under desired row 4. Keyboard: CTRL+SHIFT+V 5. Mouse: Right click -> Paste Special -> Value only

## Questions

Questions are used during questionnaire, for the purpose of collecting information about the user, to determine their
carbon footprint.

They are stored in sheets with country code as a name. (FI, EE, SI, etc).

After synchronization to Firestore, they are placed into `questions` collection.

Structure:

| Column name                                  | Field name in Firestore                       | Example                                                                                                                                                         | Description                                                                                                                                                                                                                                                                                       |
| -------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                                           | id (as well as it is a Firestore document ID) | 29EAFF18229C69B9                                                                                                                                                | Identificator of the question                                                                                                                                                                                                                                                                     |
| Order number                                 | sortKey                                       | 01-01                                                                                                                                                           | Defines category (part before "-" sign) and order in which questions should be presented to the user (second part)                                                                                                                                                                                |
| Q/A identifier                               | variableName                                  | ANSWER_HOU_NO_OF_PEOPLE                                                                                                                                         | Variable name. which can be used later in question or action formula. Selected choice value will be assigned to this name. More information under "Choice value" field.                                                                                                                           |
| Label                                        | label                                         | beef                                                                                                                                                            | More detailed category of question, used on result page                                                                                                                                                                                                                                           |
| Skip from data feed                          |                                               | x                                                                                                                                                               | It's not stored in DB, but it filters which rows should be synced to the translation files only, to support legacy data selected by user.                                                                                                                                                         |
| Text (English)                               | questionText                                  | How often do you have beef as part of your meal?                                                                                                                | Question's title/main text in default language                                                                                                                                                                                                                                                    |
| Text (Language name)                         |                                               |                                                                                                                                                                 | Question's title/main text in specific language. This is only synchronized to translation file                                                                                                                                                                                                    |
| Description/explanation text (English)       | descriptionText                               | Take into consideration all shopping except food.                                                                                                               | Question's description/extra text in default language                                                                                                                                                                                                                                             |
| Description/explanation text (Language name) | descriptionTranslationKey                     | Take into consideration also trips where you are on the passenger seat.                                                                                         | Question's description/extra text in specific language. This field is added with value in format: `ID+"_description": "translation"` to the translation file. This is only synchronized to translation file                                                                                       |
| Math.js formula                              | formula                                       | (HOU_ELECTRICITY_CONSUMPTION_KWH_PER_YEAR _ ANSWER_HOU_TYPE_ELECTRICITY) + ((ANSWER_HOU_SIZE_HOUSE_PER_PERSON _ ANSWER_HOU_TYPE_HOUSE/ANSWER_HOU_NO_OF_PEOPLE)) | Formula of how footprint fo the question is calculated. It can be either static number, or Math.js-supported math formula. It can also use scopes (for example: ANSWER_HOU_NO_OF_PEOPLE), which are combinations of constants, "                                                                  |
| Question display condition                   | displayCondition                              | ANSWER_HOU_ENERGY_CLASS_YEAR_OF_BUILD !== HOU_ENERGY_CLASS_A_B_C_IF_BUILT_AFTER_2010                                                                            | Math.js-supported evaluation formula (including scopes) determining if specific question can be displayed to the user. For example, question about house renovation should be displayed only if user has old house. Semicolon (;) is used to separate conditions, which then work in "OR" manner. |
| Related variable name                        | relatedVariableName                           | TRA_CAR_AND_INFRA                                                                                                                                               | Extra variable name, to which the value based on relatedVariableValue value.                                                                                                                                                                                                                      |
| Related variable value                       | relatedVariableValue                          | TRA_CAR_AND_INFRA_COMBUSTION                                                                                                                                    | Value which will be assigned to relatedVariableName. It can have static value or name. If it has name, then it will get resolved into actual value using scope.                                                                                                                                   |
| Choice text                                  | choices[].choiceText                          | Cool, about 19°C                                                                                                                                                | Choice text in default language.                                                                                                                                                                                                                                                                  |
| Choice value                                 | choices[].choiceValue                         | -2 **or** ANSWER_TRA_KILOMETERS_DRIVEN_400TO600                                                                                                                 | Value when specific choice is selected, which gets assigned to "variableName" name. It can be either static value or name. If it has name, then it will get resolved into actual value using scope.                                                                                               |
| Choice text (Language name)                  |                                               | Viileä, huonelämpötila noin 19°C                                                                                                                                | Choice text in specific language. This is only synchronized to translation file                                                                                                                                                                                                                   |

Every question takes more than 1 row, as each question has more than one choice which can be selected (but only one can
be selected at the time). When the row is just another choice for the previous question, only following columns should
have set a value:

- Choice text
- Choice text (Language name)
- Choice value

## Constants

Constants are variables used as part of scope during calculations or evaluation of formulas
for [questions](./questionnaire.md#calculations) and [actions](./actions-and-plan.md#action-impact-calculation)

They are managed in `Constants` sheet, where each country has own column, and each constant has own row.

| Column name             | Description                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Constant name           | Name of the constant. This name can be used in formulas                                                                    |
| Default                 | Default values for variables. If country does not have country-specific value for specific variable, this one will be used |
| FI / SI / TR / PT / etc | Column per country. Country-specific values for variables                                                                  |

## Actions

Actions are used to promote different actions to users, to help them to reduce their carbon footprint.

They are stored in sheets with naming convention: `{COUNTRY_CODE}_ACT_2`. (FI_ACT_2, EE_ACT_2, SI_ACT_2, etc).

Structure:

| Column name                        | Field in Firestore | Example                                                                                                                                                                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                                 | id                 | 29EAFF18229C69B9                                                                                                                                                                                                             | Identificator of the question                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Action Identifier                  | variableName       | CHECK_YOUR_WINDOW_SEALS                                                                                                                                                                                                      | Text action identificator                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Category                           | category           | Housing                                                                                                                                                                                                                      | Category of action, used to group actions by category and affect footprint of created by specific category of user actions.                                                                                                                                                                                                                                                                                                                                                       |
| Type                               | type               | Action                                                                                                                                                                                                                       | Type of action, used for filtering                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Skip from data feed                |                    | x                                                                                                                                                                                                                            | It's not stored in DB, but it filters which rows should be synced to the translation files only, to support legacy data selected by user.                                                                                                                                                                                                                                                                                                                                         |
| Impact formulas                    | impactFormulas     | QUESTION_A990DD6ACC6D039A_FOOTPRINT === -113 \| 11.3 _ ANSWER_FOO_HOW_MUCH, QUESTION_A990DD6ACC6D039A_FOOTPRINT === 51 \| 31 _ ANSWER_FOO_HOW_MUCH; QUESTION_A990DD6ACC6D039A_FOOTPRINT === 449 \| 71 \* ANSWER_FOO_HOW_MUCH | Formula for calculating impact of the action. It can be real value or mix of variables and/or real values. It allows to provide multiple formulas, and usage of formula is determined based on condition prior it. Combinations of CONDITION+FORMULA are separated by comma (,). Each condition can include multiple conditions in it which then work in OR manner, and those are separated by semicolon (;). Conditions are separated from actual formula by pipe character (\|) |
| Display condition                  | displayCondition   | ANSWER_FOO_DIET !== ANSWER_FOO_DIET_VEGETARIAN;ANSWER_FOO_DIET !== ANSWER_FOO_DIET_VEGAN                                                                                                                                     | Math.js-supported evaluation formula (including scopes) determining if specific action can be displayed to the user. For example, action to reduce temperature at home shouldn't be displayed if users already answered in the questionnaire that they have low temperature. Semicolon (;) is used to separate conditions, which then work in "OR" manner.                                                                                                                        |
| Tags                               | tags               | savemoney;SaveTime;SmallPleasures;SaveEnergy;QualityConsumptionChoices;Wellbeing                                                                                                                                             | Tags of action, used for filtering                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Action title (English)             | title              | Participate in the vegan or meatless October challenge                                                                                                                                                                       | Action's title/main text in default language                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Action title (Language name)       |                    | Osallistu vegaanihaasteeseen tai lihattomaan lokakuuhun                                                                                                                                                                      | Action's title/main text in specific language. This field is added with value in format `{ID}+"_actionTitle_"+{CountryCode}: "translation"` to the translation file. This is only synchronized to translation file                                                                                                                                                                                                                                                                |
| Action description (Language name) |                    | Osallistumalla kuukauden vegaanihaasteeseen tai viettämällä lihatonta lokakuuta voit löytää uusia lempiruokia ja laajentaa ruokavaliosi makumaailmaa.                                                                        | Action's description/extra text in specific language. This field is added with value in format: `{ID}+"_actionDescription_"+{CountryCode}: "translation"` to the translation file. This is only synchronized to translation file                                                                                                                                                                                                                                                  |
| Skip IDs if selected               | skipIdsIfSelected  | 21BD6013E9D8FD82,A414B83B47843F23,04852605B3F8FA07                                                                                                                                                                           | List of actions which should be hidden if this action gets selected, to prevent users from selecting contradicting actions                                                                                                                                                                                                                                                                                                                                                        |

## Feedback options

Feedback options are options users can select when they try to submit feedback form.

They are stored in sheets with naming convention: `{COUNTRY_CODE}_FeedbackCard`. (FI_FeedbackCard, EE_FeedbackCard,
SI_FeedbackCard, etc).

Structure:

| Column name                 | Example                | Description                                    |
| --------------------------- | ---------------------- | ---------------------------------------------- |
| ID                          | D92FA0ADF9E7D010       | Identificator of the feedback option           |
| Option Text (Language name) | Reminders or calendars | Text of the option, synced to translation file |
| Order number                | 1                      | Order in which the option will be displayed    |

## Static translations (email)

Emails are managed in GSheet as well.
They are synced to translation files only.

## Data synchronization to Firestore

All master data used inside the app, which are not translations, are synchronized to Firestore manually.

See [Setting up environment](../setting-up-environment.md) for more information.