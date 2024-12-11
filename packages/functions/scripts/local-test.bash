#!/usr/bin/env bash

set -euxo pipefail


yarn run tsc
(echo 'saveUserAnswers({usersAnswers: {
    user: "userIDwillcomehere",
    questions: [
        {
            "formula": "PUBLIC_TRANSPORT_KM_WEEK * 52 * 0.0239",
            "question": "How many kilometers per week do you travel by public transport?",
            "answer": "150",
            "value": 150,
            "id": "8Eeok51Gq6JoMHzrZ7bc",
            "variableName": "PUBLIC_TRANSPORT_KM_WEEK"
            },
        {
            "formula": "FERRY_TRIPS_YEAR * 2 * 85.4",
            "question": "How many return trips have you made by ferry in the past 12 months?",
            "answer": "5",
            "value": 5,
            "id": "BsHPcflUZlVJS2wMCCQF",
            "variableName": "FERRY_TRIPS_YEAR"
            }
    ],
    originalFootprint: 666777
}})'; sleep 5) |
   firebase functions:shell


