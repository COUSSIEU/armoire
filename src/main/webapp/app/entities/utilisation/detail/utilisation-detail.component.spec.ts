import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UtilisationDetailComponent } from './utilisation-detail.component';

describe('Utilisation Management Detail Component', () => {
  let comp: UtilisationDetailComponent;
  let fixture: ComponentFixture<UtilisationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UtilisationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ utilisation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UtilisationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UtilisationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load utilisation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.utilisation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
