### Deploying a single cloud function

- firebase deploy --only functions:functionName

### Deploying all cloud functions

- firebase deploy --only functions

### Settings secrets to Secret Manager

- Link to GCP documentation: https://firebase.google.com/docs/functions/config-env#create-secret

### Switching Firebase admin SDK environment

- firebase use dev
- firebase use prod

You have to switch to a correct environment in Firebase SDK when you, for example:

- Set / manage secrets
- Deploy / manage functions
