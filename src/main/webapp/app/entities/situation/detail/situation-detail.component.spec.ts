import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SituationDetailComponent } from './situation-detail.component';

describe('Situation Management Detail Component', () => {
  let comp: SituationDetailComponent;
  let fixture: ComponentFixture<SituationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SituationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ situation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SituationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SituationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load situation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.situation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
