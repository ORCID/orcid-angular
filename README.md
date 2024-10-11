# Get started

forktest
forktest2
## Serve the frond-end locally

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

At the moment the only way to run the application on development time with a translation file is using AOT compilations.

1- First generate the translations files

```
yarn build:i18n
```

2- Run the application on the language you want using one of the following options

```
yarn start:en ## Runs the application in using the english properties
yarn start:fr ## Runs the application in using the french properties
yarn start:ar ## Runs the application in using the arabic properties
yarn start:es ## Runs the application in using the spanish properties
yarn start:ca ## ... and so on
yarn start:cs
yarn start:it
yarn start:ja
yarn start:ko
yarn start:pt
yarn start:ru
yarn start:uk
yarn start:zh_CN
yarn start:zh_TW
yarn start:lr ## These last fourth configurations are used only for testing
yarn start:rl
yarn start:xx
yarn start:source
```

## Set up your source code editor (optional)

The following tools are not required to work on the project but they facilitate the development process, please read more about these tools on the provided URLs.

1- Download [Visual Studio Code](https://code.visualstudio.com/) and install it

2- Download and install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) and [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template) extensions

3- Go to VSCode menu Code/Preferences/Settings search for `Format` and select `esbenp.prettier-vscode`. You might also activate the `Editor: Format On Save` checkbox.

## Build the application for other environments

The following commands are used to build the application for non-local environments

- `yarn build:prod`
- `yarn build:sandbox`
- `yarn build:qa`
- `yarn build:int`

## Learn more

Please refer to the following documentation for more information:

https://orcid.github.io/orcid-angular
