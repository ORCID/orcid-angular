import { Injectable } from '@angular/core'
import { Observable, Observer } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  private scripts: ScriptModel[] = []

  constructor() {}

  public load(script: ScriptModel): Observable<ScriptModel> {
    return new Observable<ScriptModel>((observer: Observer<ScriptModel>) => {
      const existingScript = this.scripts.find((s) => s.name === script.name)

      if (existingScript && existingScript.loaded) {
        observer.next(existingScript)
        observer.complete()
      } else {
        this.scripts = [...this.scripts, script]

        const scriptElement = document.createElement('script')
        scriptElement.type = 'text/javascript'
        scriptElement.src = script.src

        scriptElement.onload = () => {
          script.loaded = true
          observer.next(script)
          observer.complete()
        }

        scriptElement.onerror = (error: any) => {
          observer.error("Couldn't load script " + script.src)
        }

        document.getElementsByTagName('head')[0].appendChild(scriptElement)
      }
    })
  }
}

export interface ScriptModel {
  name: string
  src: string
  loaded?: boolean
}
