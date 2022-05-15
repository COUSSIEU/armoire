import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Status } from 'app/entities/enumerations/status.model';
import { IDisponibilite, Disponibilite } from '../disponibilite.model';

import { DisponibiliteService } from './disponibilite.service';

describe('Disponibilite Service', () => {
  let service: DisponibiliteService;
  let httpMock: HttpTestingController;
  let elemDefault: IDisponibilite;
  let expectedResult: IDisponibilite | IDisponibilite[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DisponibiliteService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nom: 'AAAAAAA',
      observable: 'AAAAAAA',
      etat: Status.OK,
      remarques: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Disponibilite', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Disponibilite()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Disponibilite', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          observable: 'BBBBBB',
          etat: 'BBBBBB',
          remarques: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Disponibilite', () => {
      const patchObject = Object.assign(
        {
          observable: 'BBBBBB',
          remarques: 'BBBBBB',
        },
        new Disponibilite()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Disponibilite', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          observable: 'BBBBBB',
          etat: 'BBBBBB',
          remarques: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Disponibilite', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDisponibiliteToCollectionIfMissing', () => {
      it('should add a Disponibilite to an empty array', () => {
        const disponibilite: IDisponibilite = { id: 123 };
        expectedResult = service.addDisponibiliteToCollectionIfMissing([], disponibilite);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(disponibilite);
      });

      it('should not add a Disponibilite to an array that contains it', () => {
        const disponibilite: IDisponibilite = { id: 123 };
        const disponibiliteCollection: IDisponibilite[] = [
          {
            ...disponibilite,
          },
          { id: 456 },
        ];
        expectedResult = service.addDisponibiliteToCollectionIfMissing(disponibiliteCollection, disponibilite);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Disponibilite to an array that doesn't contain it", () => {
        const disponibilite: IDisponibilite = { id: 123 };
        const disponibiliteCollection: IDisponibilite[] = [{ id: 456 }];
        expectedResult = service.addDisponibiliteToCollectionIfMissing(disponibiliteCollection, disponibilite);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(disponibilite);
      });

      it('should add only unique Disponibilite to an array', () => {
        const disponibiliteArray: IDisponibilite[] = [{ id: 123 }, { id: 456 }, { id: 14017 }];
        const disponibiliteCollection: IDisponibilite[] = [{ id: 123 }];
        expectedResult = service.addDisponibiliteToCollectionIfMissing(disponibiliteCollection, ...disponibiliteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const disponibilite: IDisponibilite = { id: 123 };
        const disponibilite2: IDisponibilite = { id: 456 };
        expectedResult = service.addDisponibiliteToCollectionIfMissing([], disponibilite, disponibilite2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(disponibilite);
        expect(expectedResult).toContain(disponibilite2);
      });

      it('should accept null and undefined values', () => {
        const disponibilite: IDisponibilite = { id: 123 };
        expectedResult = service.addDisponibiliteToCollectionIfMissing([], null, disponibilite, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(disponibilite);
      });

      it('should return initial array if no Disponibilite is added', () => {
        const disponibiliteCollection: IDisponibilite[] = [{ id: 123 }];
        expectedResult = service.addDisponibiliteToCollectionIfMissing(disponibiliteCollection, undefined, null);
        expect(expectedResult).toEqual(disponibiliteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
