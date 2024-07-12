# Get started

## Serve the frond-end locally connected to qa.orcid.org

Before running the following steps make sure you have `yarn` installed

1- Clone the repo

```
git clone https://github.com/ORCID/orcid-angular
```

2- Install its dependencies

```
cd orcid-angular
yarn
```

3- Serve the front-end locally

```
yarn start
```

## Serve the frond-end locally using other languages

Currently, the only way to run the application on development time with a translation file is using AOT compilations.

1- First generate the translation files

```
yarn build:i18n
```

2- Run the application in the language you want using one of the following options

```
yarn start:en ## Runs the application in using the english properties
yarn start:fr ## Runs the application in using the french properties
yarn start:ar ## Runs the application in using the arabic properties
```


## Build the application for other environments

The following commands are used to build the application for non-local environments

- `yarn build:prod`
- `yarn build:sandbox`
- `yarn build:qa`
- `yarn build:int`


