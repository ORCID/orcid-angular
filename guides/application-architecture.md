# Application Architecture

This application use more or less a `core, shared, features modules structure` and there are multiple articles that clearly illustrate this method for instance [Angular folder structure best practices](https://www.tektutorialshub.com/angular/angular-folder-structure-best-practices/)

The goal with this standard in to align the project with the following Angular style guides [feature modules](https://angular.io/guide/styleguide#feature-modules),
[folder-by-feature-structure](https://angular.io/guide/styleguide#folders-by-feature-structure),
[shared-feature-module](https://angular.io/guide/styleguide#shared-feature-module),
and [lazy loaded folders](https://angular.io/guide/styleguide#lazy-loaded-folders).

With this, the following folders, modules and files are the backbone of the application:

### Core module:

Most services should be created on the angular `src/core` folder. Using the following CLI command.

```
ng generate service core/helloworld --flat=true
```

The flat structure is applied to follow consideration describe on the [Angular flat style guide](https://angular.io/guide/styleguide#flat)

It is expected that all the services created by the CLI use the [providedIn](https://angular.io/api/core/Injectable#providedIn) method, but also some other providers are going to be declare on the core.module.ts providers array.

This folder is used mostly for services, and should only declare components, pipes or directives in rare scenarios where those should de usable on every or most application modules.

The core module should only be imported on the `app.module`.

### Features modules:

Features should be added as a modules inside the `src/` folder, using the following CLI command

```
ng generate module helloworld --routing=true
```

For a deeper explanation on how to create a feature module please read [create a feature module](https://orcid.github.io/orcid-angular/?path=/docs/docs-create-a-feature-module--page)

### Share module

Some pipes, directives, and components that are going to be reused on multiple application modules, should be declared on the `src/share` folder. This can be done using the following CLI commands.

```
ng generate pipe shared/components/helloworld --flat=false --export=true
ng generate component shared/components/helloworld --flat=false --export=true
ng generate directive shared/directives/helloworld --flat=false --export=true
```

The share module can be imported on most modules, but only when any of it's declare elements is required.

In rare scenarios when a service should have a different instance on each feature module it can also be declared on the share module.

### Types folder

This folder contains the interfaces that defined the application objects structures. This folder contains `.endpoint.ts` and `.local.ts` name terminations

- **.endpoint**: for send or received backend JSON structures.
- **.local**: elements used only inside the frontend. For instance, a particular object created by a core service and consumed by a component.

### Constants file

This contains a list of definitions like regexp, strings, URLs and other variables that are shared among different modules.
