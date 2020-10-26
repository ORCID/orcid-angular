# Cypress demo

This is a very simple Cypress integration, that can run e2e testing for orcid-angular and the drupal page. Its goal is to demo how Orcid might run e2e testing for its UI on a local dev environment, CI pipes and manually by QA testers.

The [defined testing suits for each project can be found here](https://github.com/ORCID/orcid-angular/tree/74bedf0e160d6fbe10e3f5de1643beac09e64aa4/cypress/integration)

# How to install

- Make sure to have installed node, npm and yarn
- clone the repo https://github.com/ORCID/orcid-angular
- checkout to the cypress testing branch

```
git checkout feature/cypress-testing
```

- Install the dependencies

```
npm install
```

# How to run

## To run on a local dev environment

- run the app locally

```
npm start
```

- run the test

```
npm run e2e
```

## To run on QA

Run the e2e for qa which changes the base URL

```
npm run e2e:qa
```

## To run on CI

This can be used on automated tools like Travis to test the app

```
npm run e2e:ci
```

# More info about Cypress

https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell
