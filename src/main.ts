import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app/app.module'
import { EnvironmentInterface } from './environments/interface'
import { defineGlobalSetQAflag } from './app/local-flags.help'

if (runtimeEnvironment.production) {
  enableProdMode()
}

defineGlobalSetQAflag()

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err))
