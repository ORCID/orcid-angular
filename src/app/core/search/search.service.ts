import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Params } from '@angular/router'
import { map, delay } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor() {}

  search(querryParam: Observable<Params>) {
    return querryParam.pipe(
      map(params => {
        console.log(params)
        return params
      }),
      delay(2000),
      map(params => {
        return params
      })
    )
    // const searchString =
    // tslint:disable-next-line: max-line-length
    //   '{!edismax qf="given-and-family-names^50.0 family-name^10.0 given-names^5.0 credit-name^10.0 other-names^5.0 text^1.0" pf="given-and-family-names^50.0" mm=1}'
  }
}
