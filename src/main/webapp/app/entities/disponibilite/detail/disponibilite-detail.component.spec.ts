import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DisponibiliteDetailComponent } from './disponibilite-detail.component';

describe('Disponibilite Management Detail Component', () => {
  let comp: DisponibiliteDetailComponent;
  let fixture: ComponentFixture<DisponibiliteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisponibiliteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ disponibilite: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DisponibiliteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DisponibiliteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load disponibilite on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.disponibilite).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
