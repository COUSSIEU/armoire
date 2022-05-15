import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DisponibiliteService } from '../service/disponibilite.service';

import { DisponibiliteComponent } from './disponibilite.component';

describe('Disponibilite Management Component', () => {
  let comp: DisponibiliteComponent;
  let fixture: ComponentFixture<DisponibiliteComponent>;
  let service: DisponibiliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DisponibiliteComponent],
    })
      .overrideTemplate(DisponibiliteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DisponibiliteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DisponibiliteService);

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
    expect(comp.disponibilites?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
