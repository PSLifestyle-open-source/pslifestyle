# Introduction

This folder consists of the backend of PSLifestyle application.

It's set of functions for following purposes:

- **[./src/CloudFunctions]** serverless functions exposed via Google Firebase
- **[./src/SchedulerFunctions]** serverless functions to be triggered on interval via Google Firebase
- **[./src/Scripts/Export]** - localization sync scripts
- **[./src/Scripts/GenerateTranslations]** - data sync scripts

More about localization and data sync scripts you can find [here](./src/Scripts/README.md)

# Development

To develop locally, you need to run Firebase emulators, and ensure that both backend and frontend is utilizing them.

For that purpose, set "VITE_USE_EMULATOR" environment variable to any, non-empty value.
