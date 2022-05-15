import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUtilisation } from '../utilisation.model';

@Component({
  selector: 'jhi-utilisation-detail',
  templateUrl: './utilisation-detail.component.html',
})
export class UtilisationDetailComponent implements OnInit {
  utilisation: IUtilisation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ utilisation }) => {
      this.utilisation = utilisation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
