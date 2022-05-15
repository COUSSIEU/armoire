import { ISituation } from 'app/entities/situation/situation.model';
import { Appareil } from 'app/entities/enumerations/appareil.model';

export interface IVersion {
  id?: number;
  appareil?: Appareil;
  version?: string;
  nombre?: number;
  situation?: ISituation | null;
}

export class Version implements IVersion {
  constructor(
    public id?: number,
    public appareil?: Appareil,
    public version?: string,
    public nombre?: number,
    public situation?: ISituation | null
  ) {}
}

export function getVersionIdentifier(version: IVersion): number | undefined {
  return version.id;
}
