import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISituation, getSituationIdentifier } from '../situation.model';

export type EntityResponseType = HttpResponse<ISituation>;
export type EntityArrayResponseType = HttpResponse<ISituation[]>;

@Injectable({ providedIn: 'root' })
export class SituationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/situations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(situation: ISituation): Observable<EntityResponseType> {
    return this.http.post<ISituation>(this.resourceUrl, situation, { observe: 'response' });
  }

  update(situation: ISituation): Observable<EntityResponseType> {
    return this.http.put<ISituation>(`${this.resourceUrl}/${getSituationIdentifier(situation) as number}`, situation, {
      observe: 'response',
    });
  }

  partialUpdate(situation: ISituation): Observable<EntityResponseType> {
    return this.http.patch<ISituation>(`${this.resourceUrl}/${getSituationIdentifier(situation) as number}`, situation, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISituation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISituation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSituationToCollectionIfMissing(
    situationCollection: ISituation[],
    ...situationsToCheck: (ISituation | null | undefined)[]
  ): ISituation[] {
    const situations: ISituation[] = situationsToCheck.filter(isPresent);
    if (situations.length > 0) {
      const situationCollectionIdentifiers = situationCollection.map(situationItem => getSituationIdentifier(situationItem)!);
      const situationsToAdd = situations.filter(situationItem => {
        const situationIdentifier = getSituationIdentifier(situationItem);
        if (situationIdentifier == null || situationCollectionIdentifiers.includes(situationIdentifier)) {
          return false;
        }
        situationCollectionIdentifiers.push(situationIdentifier);
        return true;
      });
      return [...situationsToAdd, ...situationCollection];
    }
    return situationCollection;
  }
}
