import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUtilisation } from '../utilisation.model';
import { UtilisationService } from '../service/utilisation.service';
import { UtilisationDeleteDialogComponent } from '../delete/utilisation-delete-dialog.component';

@Component({
  selector: 'jhi-utilisation',
  templateUrl: './utilisation.component.html',
})
export class UtilisationComponent implements OnInit {
  utilisations?: IUtilisation[];
  isLoading = false;

  constructor(protected utilisationService: UtilisationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.utilisationService.query().subscribe({
      next: (res: HttpResponse<IUtilisation[]>) => {
        this.isLoading = false;
        this.utilisations = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IUtilisation): number {
    return item.id!;
  }

  delete(utilisation: IUtilisation): void {
    const modalRef = this.modalService.open(UtilisationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.utilisation = utilisation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
