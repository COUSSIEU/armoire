import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VersionService } from '../service/version.service';
import { IVersion, Version } from '../version.model';
import { ISituation } from 'app/entities/situation/situation.model';
import { SituationService } from 'app/entities/situation/service/situation.service';

import { VersionUpdateComponent } from './version-update.component';

describe('Version Management Update Component', () => {
  let comp: VersionUpdateComponent;
  let fixture: ComponentFixture<VersionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let versionService: VersionService;
  let situationService: SituationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VersionUpdateComponent],
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
      .overrideTemplate(VersionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VersionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    versionService = TestBed.inject(VersionService);
    situationService = TestBed.inject(SituationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Situation query and add missing value', () => {
      const version: IVersion = { id: 456 };
      const situation: ISituation = { id: 38284 };
      version.situation = situation;

      const situationCollection: ISituation[] = [{ id: 93657 }];
      jest.spyOn(situationService, 'query').mockReturnValue(of(new HttpResponse({ body: situationCollection })));
      const additionalSituations = [situation];
      const expectedCollection: ISituation[] = [...additionalSituations, ...situationCollection];
      jest.spyOn(situationService, 'addSituationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ version });
      comp.ngOnInit();

      expect(situationService.query).toHaveBeenCalled();
      expect(situationService.addSituationToCollectionIfMissing).toHaveBeenCalledWith(situationCollection, ...additionalSituations);
      expect(comp.situationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const version: IVersion = { id: 456 };
      const situation: ISituation = { id: 58995 };
      version.situation = situation;

      activatedRoute.data = of({ version });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(version));
      expect(comp.situationsSharedCollection).toContain(situation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Version>>();
      const version = { id: 123 };
      jest.spyOn(versionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ version });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: version }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(versionService.update).toHaveBeenCalledWith(version);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Version>>();
      const version = new Version();
      jest.spyOn(versionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ version });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: version }));
      saveSubject.complete();

      // THEN
      expect(versionService.create).toHaveBeenCalledWith(version);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Version>>();
      const version = { id: 123 };
      jest.spyOn(versionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ version });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(versionService.update).toHaveBeenCalledWith(version);
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
