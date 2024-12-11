# Introduction

This document contains detailed information about responsibilities of each endpoint

For API schema, please check [API schema document](../api-schema.json)

# Glossary

- migratable data: data which can be safely moved from anon to authed user. These data are: `campaignIds`

# Endpoints

## User management

### /checkLink

#### Main duty

Receive email address and magic link token. Email address is used to find user entity,
and then endpoint checks if magic link token belonging to the user is the same one as received.
It obeys 15 minutes of link validity and that link can be used only once.

If the tokens are the same, we set it as used and generates session token which is then returned.
It also checks if user has answers/plan, to be able to inform frontend where user should be redirected after login.

#### Side-effects

If token matches, we copy migratable data to authenticated user.
Also, if user used the "ascend" option, the endpoint will move data from the temporary storage to user storage.

### /deleteUser

#### Main duty

Validates received session token, and if it's valid, deletes all the user data from the database.

### /initializeUser

#### Main duty

This point has several flows, depending on the state of user. It should be activated when page is opened, to handle
authentication and session related matters.

In any case, it will return where user should redirected, based on campaign IDs belonging to the user.
However, frontend will utilize that information only if user came to the test with campaign ID in the URL.

- If user is authenticated, it will check if session token stored by user is still valid.
  - If user is session token is valid, it will just return campaign related information.
    If provided, campaign ID will be assigned to the authenticated user.
- if user is anonymous, but has already the session ID (anon ID)
  - If anon user entity is found with that anon ID, then campaign related info will be returned.
    If provided, campaign ID will be assigned to that anonymous user.
- If user comes without existing anon ID, or anon ID is not found, or session token is not valid anymore
  - Generate new anon ID and assign campaign ID (if provided) to that user. Return campaign related information
    for that campaign ID

### /requestLink

#### Main duty

Create authenticated user entity for received email (hashed and used as an ID for the entity),
generate magic link and send the email to the user with that link.

#### Side-effects

Assign anon ID to the user for the purpose of moving migratable data when logged in successfully.
If provided data for the "ascend" option, store them in the temporary storage for the purpose of moving them to the
authenticated user after successful login.

## Persist / Fetch questionnaire-related information

### /fetchUserAnswers

#### Main duty

Validates received session token, and if it's valid, returns latest entity of user's answers.

### /fetchUserFeedback

#### Main duty

Validates received session token, and if it's valid, returns latest entity of user's feedback.

### /fetchUserPlan

#### Main duty

Validates received session token, and if it's valid, returns latest entity of user's created plan.

### /saveUserAnswers

#### Main duty

Save received answers to the user. If user has a campaign IDs, assigned them to the answer.

#### Side-effects

Increase answers count for the campaign

### /saveUserFeedback

#### Main duty

Save received feedback to the user.

### /saveUserPlan

#### Main duty

Save received plan to the user.

#### Side-effects

Increase plans count for the campaign (based on IDs from user entity)

## Campaign management

### /fetchCampaigns

#### Main duty

Fetch list of campaigns which are applicable for the user based on "CAMPAIGN_MANAGER" countries list option.

### /fetchCampaignStatistics

#### Main duty

Fetch count of how many answers, plans and feedback for created using specific campaign ID.

### /saveCampaign

#### Main duty

Upsert (create/update) campaign configuration
