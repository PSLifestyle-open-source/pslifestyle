erDiagram
displayCondition {
string operator
string value
string variableName
}

    impactFormula {
        displayCondition condition "nullable"
        string formula
    }

    actions
    actionImportDocument {
        string importDate
    }
    actionsCollections
    action {
        string category
        displayCondition[] displayCondition
        string id
        impactFormula[] impactFormulas
        string[] skipIdsIfSelected "List of IDs of actions which should be removed from recommended action selection if that action is selected"
        string[] tags
        string title
        string type
        string variableName
    }

    actions ||--|{ actionImportDocument : "Contains documents (by import datetime)"
    actionImportDocument ||--|{ actionsCollections : "contains collections (by country code)"
    actionsCollections ||--|{ action : "contains documents (by ID of action)"
    action ||--|{ displayCondition : contains
    action ||--|{ impactFormula : contains

    constantsContent
    constantContentImportDocument {
        string importDate
    }
    constantContentsCollection
    constantContent {
        float keyValue "Dynamic list of key-value pairs synced from GSheet. Key is string, value is always a float"
    }

    constantsContent ||--|{ constantContentImportDocument : "Contains documents (by import datetime)"
    constantContentImportDocument ||--|{ constantContentsCollection : "contains collections (by either 'country code' or 'DEFAULT')"
    constantContentsCollection ||--|{ constantContent : "contains 'constants' document"

    campaigns
    campaignDocument {
        string name
        boolean isHidden
        string[] allowedCountries
        enum[string] redirectDestination "Either 'homepage' or 'test'"
    }

    campaigns ||--|{ campaignDocument : "contains (by ID)"

    feedbackCards
    feedbackCardsImportDocument {
        string importDate
    }
    feedbackCardsCollection
    feedbackCard {
        string sortKey
        string text
    }

    feedbackCards ||--|{ feedbackCardsImportDocument : "Contains documents (by import datetime)"
    feedbackCardsImportDocument ||--|{ feedbackCardsCollection : "contains collections (by 'country code')"
    feedbackCardsCollection ||--|{ feedbackCard : "contains documents (by ID of feedback card)"


    questions
    questionsImportDocument {
        string importDate
    }
    questionsCollection
    question {
        questionChoice[] choices
        string formula
        string id
        string label
        string questionText
        string sortKey
        string variableName
    }
    questionChoice {
        string choiceText
        string choiceTranslationKey
        string choiceValue
    }

    questions ||--|{ questionsImportDocument : "Contains documents (by import datetime)"
    questionsImportDocument ||--|{ questionsCollection : "contains collections (by 'country code')"
    questionsCollection ||--|{ question : "contains documents (by ID of action)"
    question ||--|{ questionChoice : "contains"


    anonymousUsers
    anonymousUserDocument {
        string[] campaignIds
        number version "Version of data schema used"
        Timestamp createdAt "Datetime when object was created"
        Timestamp latestAnswerAt "Datetime when user finished questionnaire"
        Timestamp latestDemographicAt "Datetime when user finished questionnaire"
        Timestamp latestFeedbackAt "Datetime when feedback was created by user"
        Timestamp latestPlanAt "Datetime when plan was created by user"
        Timestamp updateAt "Datetime when object was updated last time"
    }

    users
    userDocument {
        string[] campaignIds
        string id "legacy field, user ID same as document ID"
        string userCreatedAt "legacy field, replaced by createdAt"
        number version "Version of data schema used"
        Timestamp createdAt "Datetime when object was created"
        Timestamp latestAnswerAt "Datetime when user finished questionnaire"
        Timestamp latestDemographicAt "Datetime when user finished questionnaire"
        Timestamp latestFeedbackAt "Datetime when feedback was created by user"
        Timestamp latestPlanAt "Datetime when plan was created by user"
        Timestamp updateAt "Datetime when object was updated last time"

        string linkCreatedAt "Datetime when the magic link was created"
        boolean linkUser "Flag defining whether magic link was successfully used or not"
        string loginFromAnonId "Nullable, informs from which session the login happened, for the purpose of merging data from anon session to authed session"
        string magicLinkToken "Nullable, magic link token to be verified when user tries to login"
    }

    answersMetadata {
        string[] campaignIds
        string constantsVersion "Version of imported constants used for this answer set"
        string questionnaireVersion "Version of imported constants used for this answer set"
        string countryCode "Country code for which the answer set was created"
        Timestamp createdAt
    }
    answersCategorizedFootprint {
        number food "User footprint for 'food' category"
        number housing "User footprint for 'housing' category"
        number purchases "User footprint for 'purchases' category"
        number transport "User footprint for 'transport' category"
    }

    answer {
        string category
        string choiceText
        string footprint "Calculated footprint of the answer"
        string label
        string questionId
        string questionText
        string sortKey
        string[] variables "Empty array for demographic answer, otherwise variables with set values and with result of calculation formula"
    }

    answers
    answerDocument {
        answersMetadata metadata
        answersCategorizedFootprint categorizedFootprint
        answer[] ordinaryAnswers
        answer[] demographicAnswers
    }


    plansMetadata {
        string[] campaignIds
        Timestamp createdAt
    }

    plansSkippedAction {
        string id
        string[] reasons
    }

    plansSelectedAction {
        string actionsVersion "Version of actions import from which are latest data for that action"
        number calculatedImpact "Calculated final impact of the action based on action formula and user footprint"
        string category "Category of action"
        string id
        number percentReduction "Calculated percent reduction of user footprint"
        string[] skipIdsIfSelected "List of IDs of actions to be removed from available list if this action gets added to the plan."
        string state "Enum: new/inProgress/completed"
        string[] tags
        string title
        string type
    }

    plans
    planDocument {
        plansMetadata metadata
        plansSkippedAction[] skippedActions
        plansSelectedAction[] selectedActions
    }

    feedbackMetadata {
        string[] campaignIds
        Timestamp createdAt
    }

    feedback
    feedbackDocument {
        feedbackMetadata metadata
        string[] selectedOptions
    }

    anonymousUsers ||--|{ anonymousUserDocument: "Collection containing documents"
    users ||--|{ userDocument : "Collection containing documents"
    anonymousUserDocument ||--|| answers: "Contains collection of answers"
    userDocument ||--|| answers: "Contains collection of answers"
    answers ||--|{ answerDocument: "Collection containing documents"
    answerDocument ||--|| answersMetadata: "Contains"
    answerDocument ||--|| answer: "Contains"
    answerDocument ||--|| plans: "Contains collection of plans"
    plans ||--|{ planDocument: "Collection containing documents"
    planDocument ||--|| plansMetadata: "Contains"
    answerDocument ||--|| feedback: "Contains collection of feedbacks"
    feedback ||--|{ feedbackDocument: "Collection containing documents"
    feedbackDocument ||--|| feedbackMetadata: "Contains"
