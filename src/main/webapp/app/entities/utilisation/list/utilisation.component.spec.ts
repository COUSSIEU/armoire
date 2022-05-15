import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UtilisationService } from '../service/utilisation.service';

import { UtilisationComponent } from './utilisation.component';

describe('Utilisation Management Component', () => {
  let comp: UtilisationComponent;
  let fixture: ComponentFixture<UtilisationComponent>;
  let service: UtilisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UtilisationComponent],
    })
      .overrideTemplate(UtilisationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UtilisationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UtilisationService);

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
    expect(comp.utilisations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
