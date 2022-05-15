import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SituationService } from '../service/situation.service';

import { SituationComponent } from './situation.component';

describe('Situation Management Component', () => {
  let comp: SituationComponent;
  let fixture: ComponentFixture<SituationComponent>;
  let service: SituationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SituationComponent],
    })
      .overrideTemplate(SituationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SituationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SituationService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.situations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
