import { ISituation } from 'app/entities/situation/situation.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IDisponibilite {
  id?: number;
  nom?: string;
  observable?: string;
  etat?: Status;
  remarques?: string | null;
  situation?: ISituation | null;
}

export class Disponibilite implements IDisponibilite {
  constructor(
    public id?: number,
    public nom?: string,
    public observable?: string,
    public etat?: Status,
    public remarques?: string | null,
    public situation?: ISituation | null
  ) {}
}

export function getDisponibiliteIdentifier(disponibilite: IDisponibilite): number | undefined {
  return disponibilite.id;
}
