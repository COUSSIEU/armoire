import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUtilisation, Utilisation } from '../utilisation.model';
import { UtilisationService } from '../service/utilisation.service';

@Injectable({ providedIn: 'root' })
export class UtilisationRoutingResolveService implements Resolve<IUtilisation> {
  constructor(protected service: UtilisationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUtilisation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((utilisation: HttpResponse<Utilisation>) => {
          if (utilisation.body) {
            return of(utilisation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Utilisation());
  }
}
