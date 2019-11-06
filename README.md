# Get started

## Serve the frond-end locally

1- Clone the repo

```
git clone https://github.com/ORCID/orcid-angular
```

2- Install its dependencies

```
cd orcid-angular
npm install
```

3- Serve the front-end locally

```
npm run start:local
```

To access the backend endpoints this requires to have a copy of [ORCID-Source](https://github.com/ORCID/ORCID-Source) running locally.

## Set up your source code editor (optional)

The following tools are not required to work on the project but they facilitate the development process, please read more about these tools on the provided url.

1- Download [Visual Studio Code](https://code.visualstudio.com/) and install it

2- Download and install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) and [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template) extensions

3- Go to VSCode menu Code/Preferences/Settings search for `Format` and select `esbenp.prettier-vscode`. You might also activate the `Editor: Format On Save` checkbox.

## Build and test the application locally

1- Install firebase tools

```
npm run install firebase/tools -g
```

2- Login to your firebase account

```
firebase login
```

3- Build and serve the app locally

```
npm run build:local
firebase serve
```

## Build the application for other environments

The following commands are used to build the application for non-local environments

- `npm run build:prod`
- `npm run build:sandbox`
- `npm run build:qa`

## Learn more

Please refer to the following documentation for more information:

- Creating a new feature module
- I18n, Applying translations
- A11y, Notes about accessibility
- Theming: How to apply the style-guide colors to new components
- Fonts: How to use style-guide fonts
- Creating and reusing components
