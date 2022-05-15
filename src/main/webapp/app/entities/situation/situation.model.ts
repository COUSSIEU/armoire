import { IVersion } from 'app/entities/version/version.model';
import { IUtilisation } from 'app/entities/utilisation/utilisation.model';
import { IDisponibilite } from 'app/entities/disponibilite/disponibilite.model';

export interface ISituation {
  id?: number;
  creation?: string;
  emission?: string | null;
  secondDate?: string | null;
  versions?: IVersion[] | null;
  utilisations?: IUtilisation[] | null;
  disponibilites?: IDisponibilite[] | null;
}

export class Situation implements ISituation {
  constructor(
    public id?: number,
    public creation?: string,
    public emission?: string | null,
    public secondDate?: string | null,
    public versions?: IVersion[] | null,
    public utilisations?: IUtilisation[] | null,
    public disponibilites?: IDisponibilite[] | null
  ) {}
}

export function getSituationIdentifier(situation: ISituation): number | undefined {
  return situation.id;
}
