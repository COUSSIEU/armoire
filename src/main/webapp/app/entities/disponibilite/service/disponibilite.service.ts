import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDisponibilite, getDisponibiliteIdentifier } from '../disponibilite.model';

export type EntityResponseType = HttpResponse<IDisponibilite>;
export type EntityArrayResponseType = HttpResponse<IDisponibilite[]>;

@Injectable({ providedIn: 'root' })
export class DisponibiliteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/disponibilites');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(disponibilite: IDisponibilite): Observable<EntityResponseType> {
    return this.http.post<IDisponibilite>(this.resourceUrl, disponibilite, { observe: 'response' });
  }

  update(disponibilite: IDisponibilite): Observable<EntityResponseType> {
    return this.http.put<IDisponibilite>(`${this.resourceUrl}/${getDisponibiliteIdentifier(disponibilite) as number}`, disponibilite, {
      observe: 'response',
    });
  }

  partialUpdate(disponibilite: IDisponibilite): Observable<EntityResponseType> {
    return this.http.patch<IDisponibilite>(`${this.resourceUrl}/${getDisponibiliteIdentifier(disponibilite) as number}`, disponibilite, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDisponibilite>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDisponibilite[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDisponibiliteToCollectionIfMissing(
    disponibiliteCollection: IDisponibilite[],
    ...disponibilitesToCheck: (IDisponibilite | null | undefined)[]
  ): IDisponibilite[] {
    const disponibilites: IDisponibilite[] = disponibilitesToCheck.filter(isPresent);
    if (disponibilites.length > 0) {
      const disponibiliteCollectionIdentifiers = disponibiliteCollection.map(
        disponibiliteItem => getDisponibiliteIdentifier(disponibiliteItem)!
      );
      const disponibilitesToAdd = disponibilites.filter(disponibiliteItem => {
        const disponibiliteIdentifier = getDisponibiliteIdentifier(disponibiliteItem);
        if (disponibiliteIdentifier == null || disponibiliteCollectionIdentifiers.includes(disponibiliteIdentifier)) {
          return false;
        }
        disponibiliteCollectionIdentifiers.push(disponibiliteIdentifier);
        return true;
      });
      return [...disponibilitesToAdd, ...disponibiliteCollection];
    }
    return disponibiliteCollection;
  }
}
