# Create a new feature module

This guide gives a quick explanation of the basics of how to create a routed feature module.

#### 1- Install Angular CLI

```
npm install -g @angular/cli
```

#### 2- Generate the new Module

```
ng generate module hello-world --routing
# Note: The --routing flag creates a router in the new module to allow sub-routing in the new feature
# Note2: For any `ng generate` cli you can use `--dry-run` to test what's going to be created before generating the code
```

#### 3- Add a new page component to the new module.

There are different types of components sometimes a component might represent a complete view, and sometimes a component can be a small reusable part of a view.
To make sense of that this project follows the module structure of having a folder called `pages` (which contains complete views) and another folder called `components` (for sub-elements of a page) inside the module.

```

-hello-world
----components
-------- (component pages folders)
----pages
-------- (component pages folders)
----hello-word-routing.module.ts
----hello-world.module.ts

```

To follow this and create a new page call

```
ng generate component hello-world/pages/hello-world
```

And after that, if you want to create a component inside that view you can call

```
ng generate component hello-world/components/hello-sub-element
```

To read more about this structure please go to [How to define a highly scalable folder structure for your Angular project](https://itnext.io/choosing-a-highly-scalable-folder-structure-in-angular-d987de65ec7). This structure is just an interpretation of the [locate angular style guide](https://angular.io/guide/styleguide#locate) and should not be understood as a mandatory rule defined by Angular.

#### 4- Add routing

First in the new module router `src\app\hello-world\hello-world-routing.module.ts` add a route for the new component

```
import { HelloWorldComponent } from './pages/hello-world/hello-world.component'

const routes: Routes = [
  {
    path: '',
    component: HelloWorldComponent,
  },
]
...

```

And on the application router `src\app\app-routing.module.ts` add the new module

```
const routes: Routes = [
  {
    path: 'hello-world',
    loadChildren: () => import('./hello-world/hello-world.module').then(m => m.HelloWorldModule)
  },
  ...
]
...

```

This method will lazy load the new features, for more information about the router please refer to the [Angular Docs](https://angular.io/guide/router)

#### 5- You can now navigate to the new module

Serve the application

```
npm run start
```

and navigate to `localhost:4200/hello-world`
