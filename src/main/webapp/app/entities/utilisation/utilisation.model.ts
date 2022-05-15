import { ISituation } from 'app/entities/situation/situation.model';

export interface IUtilisation {
  id?: number;
  element?: string;
  etat?: string;
  nombre?: number;
  situation?: ISituation | null;
}

export class Utilisation implements IUtilisation {
  constructor(
    public id?: number,
    public element?: string,
    public etat?: string,
    public nombre?: number,
    public situation?: ISituation | null
  ) {}
}

export function getUtilisationIdentifier(utilisation: IUtilisation): number | undefined {
  return utilisation.id;
}
