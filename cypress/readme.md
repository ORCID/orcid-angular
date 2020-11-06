# How to run

Before the following steps make sure to have `npm` and `yarn` installed

1- Create your own `cypress/cypress.env.js` file based on the `cypress/cypress.env.sample.js` file. 

2- Run the following command

```
yarn install
yarn run cypress:open
```

**Note:** To run this on QA the same parameters of the sample file should just work, and to run this on a local environment you will need to provide your own parameters.


# How to generate a sharable HTML report

Run the following command and you will find the generated .html reports on the `cypress/reports` folder

```
yarn cypress
```

You can use a chrome extension like [GoFullPage](https://chrome.google.com/webstore/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl) to easily share a single screen shot of all the tests results.

