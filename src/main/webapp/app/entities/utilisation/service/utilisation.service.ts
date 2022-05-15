import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUtilisation, getUtilisationIdentifier } from '../utilisation.model';

export type EntityResponseType = HttpResponse<IUtilisation>;
export type EntityArrayResponseType = HttpResponse<IUtilisation[]>;

@Injectable({ providedIn: 'root' })
export class UtilisationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/utilisations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(utilisation: IUtilisation): Observable<EntityResponseType> {
    return this.http.post<IUtilisation>(this.resourceUrl, utilisation, { observe: 'response' });
  }

  update(utilisation: IUtilisation): Observable<EntityResponseType> {
    return this.http.put<IUtilisation>(`${this.resourceUrl}/${getUtilisationIdentifier(utilisation) as number}`, utilisation, {
      observe: 'response',
    });
  }

  partialUpdate(utilisation: IUtilisation): Observable<EntityResponseType> {
    return this.http.patch<IUtilisation>(`${this.resourceUrl}/${getUtilisationIdentifier(utilisation) as number}`, utilisation, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUtilisation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUtilisation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUtilisationToCollectionIfMissing(
    utilisationCollection: IUtilisation[],
    ...utilisationsToCheck: (IUtilisation | null | undefined)[]
  ): IUtilisation[] {
    const utilisations: IUtilisation[] = utilisationsToCheck.filter(isPresent);
    if (utilisations.length > 0) {
      const utilisationCollectionIdentifiers = utilisationCollection.map(utilisationItem => getUtilisationIdentifier(utilisationItem)!);
      const utilisationsToAdd = utilisations.filter(utilisationItem => {
        const utilisationIdentifier = getUtilisationIdentifier(utilisationItem);
        if (utilisationIdentifier == null || utilisationCollectionIdentifiers.includes(utilisationIdentifier)) {
          return false;
        }
        utilisationCollectionIdentifiers.push(utilisationIdentifier);
        return true;
      });
      return [...utilisationsToAdd, ...utilisationCollection];
    }
    return utilisationCollection;
  }
}
