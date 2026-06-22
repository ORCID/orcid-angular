import { enableProdMode, provideZoneChangeDetection } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app/app.module'
import { EnvironmentInterface } from './environments/interface'
import { defineGlobalSetQAflag } from './app/local-flags.help'

if (runtimeEnvironment.production) {
  enableProdMode()
}

defineGlobalSetQAflag()

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    applicationProviders: [provideZoneChangeDetection()],
  })
  .catch((err) => console.error(err))
