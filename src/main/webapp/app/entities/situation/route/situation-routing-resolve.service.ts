import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISituation, Situation } from '../situation.model';
import { SituationService } from '../service/situation.service';

@Injectable({ providedIn: 'root' })
export class SituationRoutingResolveService implements Resolve<ISituation> {
  constructor(protected service: SituationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISituation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((situation: HttpResponse<Situation>) => {
          if (situation.body) {
            return of(situation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Situation());
  }
}
