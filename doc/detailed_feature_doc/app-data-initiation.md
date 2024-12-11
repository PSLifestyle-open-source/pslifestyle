# App data initiation

## App main initialization

When the application is opened, [InitializationWrapper](../../enduser-ui/src/InitializationWrapper.tsx) component is
triggered. Its job is to pull all data needed by the entire application.

First of all, it ensures that [user session is established](./users-and-sessions.md#session-initialization).

Then, **if user is authenticated**, it will try to pull user's answers and plan, as well as recommended actions based on persisted answers.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend

    title App main initialization
    User ->> Frontend: open the app
    Frontend ->> Backend: Establish/validate session
    Backend ->> Frontend: Session valid or new session ID provided
    alt User is logged in
        par Request answer set (answers)
            Frontend ->> Backend: Request user's answer set (answers)
            Backend ->> Frontend: Return answer set
            Frontend ->> Frontend: Initialize User Answers state store with received data
        and Request plan and recommended actions
            Frontend ->> Backend: Request user's plan and latest set of recommended actions for country from answer set
            Backend ->> Frontend: Return user's plan and latest set of recommended actions for country from answer set
        end

        Frontend ->> Frontend: Update and recalculate all actions to ensure all data are matching latest version of recommended actions
        Frontend ->> Frontend: Initialize User Plan state store with received data
    end
```

## Questionnaire

When questionnaire is opened, both questions and constants are fetched on-demand, for the country selected by the user.
Always latest version of them is fetched.
