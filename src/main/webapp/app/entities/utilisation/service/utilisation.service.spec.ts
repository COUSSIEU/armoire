import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUtilisation, Utilisation } from '../utilisation.model';

import { UtilisationService } from './utilisation.service';

describe('Utilisation Service', () => {
  let service: UtilisationService;
  let httpMock: HttpTestingController;
  let elemDefault: IUtilisation;
  let expectedResult: IUtilisation | IUtilisation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UtilisationService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      element: 'AAAAAAA',
      etat: 'AAAAAAA',
      nombre: 0,
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

    it('should create a Utilisation', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Utilisation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Utilisation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          element: 'BBBBBB',
          etat: 'BBBBBB',
          nombre: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Utilisation', () => {
      const patchObject = Object.assign(
        {
          element: 'BBBBBB',
          etat: 'BBBBBB',
        },
        new Utilisation()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Utilisation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          element: 'BBBBBB',
          etat: 'BBBBBB',
          nombre: 1,
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

    it('should delete a Utilisation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addUtilisationToCollectionIfMissing', () => {
      it('should add a Utilisation to an empty array', () => {
        const utilisation: IUtilisation = { id: 123 };
        expectedResult = service.addUtilisationToCollectionIfMissing([], utilisation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(utilisation);
      });

      it('should not add a Utilisation to an array that contains it', () => {
        const utilisation: IUtilisation = { id: 123 };
        const utilisationCollection: IUtilisation[] = [
          {
            ...utilisation,
          },
          { id: 456 },
        ];
        expectedResult = service.addUtilisationToCollectionIfMissing(utilisationCollection, utilisation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Utilisation to an array that doesn't contain it", () => {
        const utilisation: IUtilisation = { id: 123 };
        const utilisationCollection: IUtilisation[] = [{ id: 456 }];
        expectedResult = service.addUtilisationToCollectionIfMissing(utilisationCollection, utilisation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(utilisation);
      });

      it('should add only unique Utilisation to an array', () => {
        const utilisationArray: IUtilisation[] = [{ id: 123 }, { id: 456 }, { id: 16768 }];
        const utilisationCollection: IUtilisation[] = [{ id: 123 }];
        expectedResult = service.addUtilisationToCollectionIfMissing(utilisationCollection, ...utilisationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const utilisation: IUtilisation = { id: 123 };
        const utilisation2: IUtilisation = { id: 456 };
        expectedResult = service.addUtilisationToCollectionIfMissing([], utilisation, utilisation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(utilisation);
        expect(expectedResult).toContain(utilisation2);
      });

      it('should accept null and undefined values', () => {
        const utilisation: IUtilisation = { id: 123 };
        expectedResult = service.addUtilisationToCollectionIfMissing([], null, utilisation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(utilisation);
      });

      it('should return initial array if no Utilisation is added', () => {
        const utilisationCollection: IUtilisation[] = [{ id: 123 }];
        expectedResult = service.addUtilisationToCollectionIfMissing(utilisationCollection, undefined, null);
        expect(expectedResult).toEqual(utilisationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
