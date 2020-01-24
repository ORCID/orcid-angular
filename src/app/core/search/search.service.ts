import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { Params } from '@angular/router'
import { delay, startWith, switchMap } from 'rxjs/operators'
import searchResults from '../../../../.mockData/mock-search.json'
@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor() {}

  search(querryParam: Observable<Params>) {
    return querryParam.pipe(
      switchMap(val => {
        console.log('PARAMS ', val)
        return of(searchResults).pipe(
          delay(4000),
          startWith(<string>null)
        )
      })
    )
  }
}
