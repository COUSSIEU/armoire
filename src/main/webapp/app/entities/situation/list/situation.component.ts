import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISituation } from '../situation.model';
import { SituationService } from '../service/situation.service';
import { SituationDeleteDialogComponent } from '../delete/situation-delete-dialog.component';

@Component({
  selector: 'jhi-situation',
  templateUrl: './situation.component.html',
})
export class SituationComponent implements OnInit {
  situations?: ISituation[];
  isLoading = false;

  constructor(protected situationService: SituationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.situationService.query().subscribe({
      next: (res: HttpResponse<ISituation[]>) => {
        this.isLoading = false;
        this.situations = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ISituation): number {
    return item.id!;
  }

  delete(situation: ISituation): void {
    const modalRef = this.modalService.open(SituationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.situation = situation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
