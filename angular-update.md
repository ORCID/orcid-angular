________________________________________________________________________________


ng update @angular/core@15 @angular/cli@15
The installed Angular CLI version is outdated.
Installing a temporary Angular CLI versioned 15.2.10 to perform the update.
✔ Packages successfully installed.
Using package manager: yarn
Collecting installed dependencies...
Found 94 dependencies.
Fetching dependency metadata from registry...
    Updating package.json with dependency @angular-devkit/build-angular @ "15.2.10" (was "14.2.11")...
    Updating package.json with dependency @angular-devkit/schematics @ "15.2.10" (was "14.2.11")...
    Updating package.json with dependency @angular/cli @ "15.2.10" (was "14.2.11")...
    Updating package.json with dependency @angular/compiler-cli @ "15.2.10" (was "14.3.0")...
    Updating package.json with dependency @angular/language-service @ "15.2.10" (was "14.3.0")...
    Updating package.json with dependency @angular-devkit/core @ "15.2.10" (was "14.2.11")...
    Updating package.json with dependency @angular/animations @ "15.2.10" (was "14.3.0")...
    Updating package.json with dependency @angular/common @ "15.2.10" (was "14.3.0")...
    Updating package.json with dependency @angular/compiler @ "15.2.10" (was "14.3.0")...
    Updating package.json with dependency @angular/core @ "15.2.10" (was "14.3.0")...
    Updating package.json with dependency @angular/forms @ "15.2.10" (was "14.3.0")...
    Updating package.json with dependency @angular/localize @ "15.2.10" (was "14.3.0")...
    Updating package.json with dependency @angular/platform-browser @ "15.2.10" (was "14.3.0")...
    Updating package.json with dependency @angular/platform-browser-dynamic @ "15.2.10" (was "14.3.0")...
    Updating package.json with dependency @angular/router @ "15.2.10" (was "14.3.0")...
    Updating package.json with dependency @angular/service-worker @ "15.2.10" (was "14.3.0")...
UPDATE package.json (6129 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular/cli' **

❯ Remove Browserslist configuration files that matches the Angular CLI default configuration.
  Migration completed (No changes made).

❯ Remove exported `@angular/platform-server` `renderModule` method.
  The `renderModule` method is now exported by the Angular CLI.
  Migration completed (No changes made).

❯ Remove no longer needed require calls in Karma builder main file.
UPDATE src/test.ts (507 bytes)
  Migration completed (1 file modified).

❯ Update TypeScript compiler `target` and set `useDefineForClassFields`.
  These changes are for IDE purposes as TypeScript compiler options `target` and `useDefineForClassFields` are set to `ES2022` and `false` respectively by the Angular CLI.
  To control ECMA version and features use the Browerslist configuration.
UPDATE tsconfig.json (630 bytes)
  Migration completed (1 file modified).

❯ Remove options from 'angular.json' that are no longer supported by the official builders.
  Migration completed (No changes made).

** Executing migrations of package '@angular/core' **

❯ In Angular version 15, the deprecated `relativeLinkResolution` config parameter of the Router is removed.
  This migration removes all `relativeLinkResolution` fields from the Router config objects.
UPDATE src/app/app-routing.module.ts (5473 bytes)
  Migration completed (1 file modified).

❯ Since Angular v15, the `RouterLink` contains the logic of the `RouterLinkWithHref` directive.
  This migration replaces all `RouterLinkWithHref` references with `RouterLink`.
  Migration completed (No changes made).