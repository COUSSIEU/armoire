import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDisponibilite } from '../disponibilite.model';
import { DisponibiliteService } from '../service/disponibilite.service';

@Component({
  templateUrl: './disponibilite-delete-dialog.component.html',
})
export class DisponibiliteDeleteDialogComponent {
  disponibilite?: IDisponibilite;

  constructor(protected disponibiliteService: DisponibiliteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.disponibiliteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
