import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SituationService } from '../service/situation.service';
import { ISituation, Situation } from '../situation.model';

import { SituationUpdateComponent } from './situation-update.component';

describe('Situation Management Update Component', () => {
  let comp: SituationUpdateComponent;
  let fixture: ComponentFixture<SituationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let situationService: SituationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SituationUpdateComponent],
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
      .overrideTemplate(SituationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SituationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    situationService = TestBed.inject(SituationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const situation: ISituation = { id: 456 };

      activatedRoute.data = of({ situation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(situation));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Situation>>();
      const situation = { id: 123 };
      jest.spyOn(situationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ situation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: situation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(situationService.update).toHaveBeenCalledWith(situation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Situation>>();
      const situation = new Situation();
      jest.spyOn(situationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ situation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: situation }));
      saveSubject.complete();

      // THEN
      expect(situationService.create).toHaveBeenCalledWith(situation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Situation>>();
      const situation = { id: 123 };
      jest.spyOn(situationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ situation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(situationService.update).toHaveBeenCalledWith(situation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
