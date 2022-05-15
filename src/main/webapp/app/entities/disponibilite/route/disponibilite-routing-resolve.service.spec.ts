import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IDisponibilite, Disponibilite } from '../disponibilite.model';
import { DisponibiliteService } from '../service/disponibilite.service';

import { DisponibiliteRoutingResolveService } from './disponibilite-routing-resolve.service';

describe('Disponibilite routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: DisponibiliteRoutingResolveService;
  let service: DisponibiliteService;
  let resultDisponibilite: IDisponibilite | undefined;

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
    routingResolveService = TestBed.inject(DisponibiliteRoutingResolveService);
    service = TestBed.inject(DisponibiliteService);
    resultDisponibilite = undefined;
  });

  describe('resolve', () => {
    it('should return IDisponibilite returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDisponibilite = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDisponibilite).toEqual({ id: 123 });
    });

    it('should return new IDisponibilite if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDisponibilite = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultDisponibilite).toEqual(new Disponibilite());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Disponibilite })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDisponibilite = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDisponibilite).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
