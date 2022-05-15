import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDisponibilite } from '../disponibilite.model';

@Component({
  selector: 'jhi-disponibilite-detail',
  templateUrl: './disponibilite-detail.component.html',
})
export class DisponibiliteDetailComponent implements OnInit {
  disponibilite: IDisponibilite | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ disponibilite }) => {
      this.disponibilite = disponibilite;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
