import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DisponibiliteService } from '../service/disponibilite.service';
import { IDisponibilite, Disponibilite } from '../disponibilite.model';
import { ISituation } from 'app/entities/situation/situation.model';
import { SituationService } from 'app/entities/situation/service/situation.service';

import { DisponibiliteUpdateComponent } from './disponibilite-update.component';

describe('Disponibilite Management Update Component', () => {
  let comp: DisponibiliteUpdateComponent;
  let fixture: ComponentFixture<DisponibiliteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let disponibiliteService: DisponibiliteService;
  let situationService: SituationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DisponibiliteUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DisponibiliteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DisponibiliteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    disponibiliteService = TestBed.inject(DisponibiliteService);
    situationService = TestBed.inject(SituationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Situation query and add missing value', () => {
      const disponibilite: IDisponibilite = { id: 456 };
      const situation: ISituation = { id: 39307 };
      disponibilite.situation = situation;

      const situationCollection: ISituation[] = [{ id: 94522 }];
      jest.spyOn(situationService, 'query').mockReturnValue(of(new HttpResponse({ body: situationCollection })));
      const additionalSituations = [situation];
      const expectedCollection: ISituation[] = [...additionalSituations, ...situationCollection];
      jest.spyOn(situationService, 'addSituationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ disponibilite });
      comp.ngOnInit();

      expect(situationService.query).toHaveBeenCalled();
      expect(situationService.addSituationToCollectionIfMissing).toHaveBeenCalledWith(situationCollection, ...additionalSituations);
      expect(comp.situationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const disponibilite: IDisponibilite = { id: 456 };
      const situation: ISituation = { id: 30468 };
      disponibilite.situation = situation;

      activatedRoute.data = of({ disponibilite });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(disponibilite));
      expect(comp.situationsSharedCollection).toContain(situation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Disponibilite>>();
      const disponibilite = { id: 123 };
      jest.spyOn(disponibiliteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ disponibilite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: disponibilite }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(disponibiliteService.update).toHaveBeenCalledWith(disponibilite);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Disponibilite>>();
      const disponibilite = new Disponibilite();
      jest.spyOn(disponibiliteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ disponibilite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: disponibilite }));
      saveSubject.complete();

      // THEN
      expect(disponibiliteService.create).toHaveBeenCalledWith(disponibilite);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Disponibilite>>();
      const disponibilite = { id: 123 };
      jest.spyOn(disponibiliteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ disponibilite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(disponibiliteService.update).toHaveBeenCalledWith(disponibilite);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSituationById', () => {
      it('Should return tracked Situation primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSituationById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
