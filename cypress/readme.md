# How to run

Before the following steps make sure to have `npm` and `yarn` installed

1- Create your own `cypress/cypress.env.js` file based on the `cypress/cypress.env.sample.js` file.

2- Run the following command

```
yarn
yarn run cypress:open
```

**Note:** To run this on QA the same parameters of the sample file should just work, and to run this on a local environment you will need to provide your own parameters.

# Test data
Use testing-users.fixture-sample.json to create at least two type of users, one with Primary Email verified (set visibility PRIVATE) and another one with no primary email verified.

# Gmail API library requirements 
In order to run gmail library tasks from plugins/index.js a credentials.json file needs to be generated in the API platform and then use this credentials file to generate a token.json to be able to access the gmail account where the notification emails will be sent.
Follow instructions at https://www.npmjs.com/package/gmail-tester-extended

# How to generate a sharable HTML report

Run the following command and you will find the generated .html reports on the `cypress/reports` folder

```
yarn cypress
```

You can use a chrome extension like [GoFullPage](https://chrome.google.com/webstore/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl) to easily share a single screen shot of all the tests results.
