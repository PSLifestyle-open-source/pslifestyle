# PSLifestyle

## Prerequisites

Tools that you need to have globally installed are:

- pnpm: https://pnpm.io/
- firebase-tools: https://firebase.google.com/docs/cli

You can install both for example using `npm` by running:

```
npm install -g pnpm firebase-tools
```

## Development

Install dependencies by running `pnpm install` anywhere in the repo.
This will install dependencies for all packages.

To learn how to set up development environment for `enduser-ui` and
`functions` packages and see all package-specific information, please
refer to their respective README.md files.

The following commands are available on the top level:

- `pnpm dev` Run the frontend in dev mode and backend using an emulator
- `pnpm enduser-ui` Run the frontend only in dev mode
- `pnpm functions` Run the functions in dev mode

For more documentation, see [/doc](/doc).

## Step-by-Step Instructions for Setting Up the Google Cloud Environments

Read the [deployment documentation](/doc/setting-up-environment.md) for more information.

## Folder structure

### /doc

Documentation and diagrams to better understand the application and how to work with it.

### /packages/common

Files used both in frontend and in cloud functions, containing mostly types and arrays of countries and languages.

### /packages/enduser-ui

Frontend. End-user React app with carbon footprint calculator and recommendations.

### /packages/functions

Firebase (GCP) cloud functions to be used as backend. Also scripts to import data from Google Sheets into DB or into json files.
