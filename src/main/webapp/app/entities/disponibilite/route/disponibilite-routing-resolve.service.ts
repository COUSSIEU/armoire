import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDisponibilite, Disponibilite } from '../disponibilite.model';
import { DisponibiliteService } from '../service/disponibilite.service';

@Injectable({ providedIn: 'root' })
export class DisponibiliteRoutingResolveService implements Resolve<IDisponibilite> {
  constructor(protected service: DisponibiliteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDisponibilite> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((disponibilite: HttpResponse<Disponibilite>) => {
          if (disponibilite.body) {
            return of(disponibilite.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Disponibilite());
  }
}
