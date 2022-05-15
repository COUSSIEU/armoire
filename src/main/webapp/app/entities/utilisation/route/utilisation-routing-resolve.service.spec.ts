import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IUtilisation, Utilisation } from '../utilisation.model';
import { UtilisationService } from '../service/utilisation.service';

import { UtilisationRoutingResolveService } from './utilisation-routing-resolve.service';

describe('Utilisation routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: UtilisationRoutingResolveService;
  let service: UtilisationService;
  let resultUtilisation: IUtilisation | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(UtilisationRoutingResolveService);
    service = TestBed.inject(UtilisationService);
    resultUtilisation = undefined;
  });

  describe('resolve', () => {
    it('should return IUtilisation returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUtilisation = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultUtilisation).toEqual({ id: 123 });
    });

    it('should return new IUtilisation if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUtilisation = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultUtilisation).toEqual(new Utilisation());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Utilisation })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultUtilisation = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultUtilisation).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
