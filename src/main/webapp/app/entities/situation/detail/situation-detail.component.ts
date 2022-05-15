import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISituation } from '../situation.model';

@Component({
  selector: 'jhi-situation-detail',
  templateUrl: './situation-detail.component.html',
})
export class SituationDetailComponent implements OnInit {
  situation: ISituation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ situation }) => {
      this.situation = situation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
