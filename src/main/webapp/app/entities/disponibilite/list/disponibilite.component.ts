import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDisponibilite } from '../disponibilite.model';
import { DisponibiliteService } from '../service/disponibilite.service';
import { DisponibiliteDeleteDialogComponent } from '../delete/disponibilite-delete-dialog.component';

@Component({
  selector: 'jhi-disponibilite',
  templateUrl: './disponibilite.component.html',
})
export class DisponibiliteComponent implements OnInit {
  disponibilites?: IDisponibilite[];
  isLoading = false;

  constructor(protected disponibiliteService: DisponibiliteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.disponibiliteService.query().subscribe({
      next: (res: HttpResponse<IDisponibilite[]>) => {
        this.isLoading = false;
        this.disponibilites = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IDisponibilite): number {
    return item.id!;
  }

  delete(disponibilite: IDisponibilite): void {
    const modalRef = this.modalService.open(DisponibiliteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.disponibilite = disponibilite;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
