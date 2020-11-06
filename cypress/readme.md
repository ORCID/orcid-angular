# How to run

Before the following steps make sure to have npm and yarn installed

1- Create your own `cypress/cypress.env.js` based on the `cypress/cypress.env.sample.js` file. To run this on QA you can simple use the same parameters on the sample file, and to run this on a local environment you will need to provide your own parameters.

2- Run the following command

```
yarn install
yarn run cypress:open
```


# How to generate a sharable HTML report

Run the following command and you will find the generated reports on `cypress/reports`

```
yarn cypress
```

