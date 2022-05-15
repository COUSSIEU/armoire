import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UtilisationService } from '../service/utilisation.service';
import { IUtilisation, Utilisation } from '../utilisation.model';
import { ISituation } from 'app/entities/situation/situation.model';
import { SituationService } from 'app/entities/situation/service/situation.service';

import { UtilisationUpdateComponent } from './utilisation-update.component';

describe('Utilisation Management Update Component', () => {
  let comp: UtilisationUpdateComponent;
  let fixture: ComponentFixture<UtilisationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let utilisationService: UtilisationService;
  let situationService: SituationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UtilisationUpdateComponent],
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
      .overrideTemplate(UtilisationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UtilisationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    utilisationService = TestBed.inject(UtilisationService);
    situationService = TestBed.inject(SituationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Situation query and add missing value', () => {
      const utilisation: IUtilisation = { id: 456 };
      const situation: ISituation = { id: 66070 };
      utilisation.situation = situation;

      const situationCollection: ISituation[] = [{ id: 95487 }];
      jest.spyOn(situationService, 'query').mockReturnValue(of(new HttpResponse({ body: situationCollection })));
      const additionalSituations = [situation];
      const expectedCollection: ISituation[] = [...additionalSituations, ...situationCollection];
      jest.spyOn(situationService, 'addSituationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ utilisation });
      comp.ngOnInit();

      expect(situationService.query).toHaveBeenCalled();
      expect(situationService.addSituationToCollectionIfMissing).toHaveBeenCalledWith(situationCollection, ...additionalSituations);
      expect(comp.situationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const utilisation: IUtilisation = { id: 456 };
      const situation: ISituation = { id: 13809 };
      utilisation.situation = situation;

      activatedRoute.data = of({ utilisation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(utilisation));
      expect(comp.situationsSharedCollection).toContain(situation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Utilisation>>();
      const utilisation = { id: 123 };
      jest.spyOn(utilisationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ utilisation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: utilisation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(utilisationService.update).toHaveBeenCalledWith(utilisation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Utilisation>>();
      const utilisation = new Utilisation();
      jest.spyOn(utilisationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ utilisation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: utilisation }));
      saveSubject.complete();

      // THEN
      expect(utilisationService.create).toHaveBeenCalledWith(utilisation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Utilisation>>();
      const utilisation = { id: 123 };
      jest.spyOn(utilisationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ utilisation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(utilisationService.update).toHaveBeenCalledWith(utilisation);
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
