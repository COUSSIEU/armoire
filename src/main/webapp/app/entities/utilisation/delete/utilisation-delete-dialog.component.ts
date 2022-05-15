import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUtilisation } from '../utilisation.model';
import { UtilisationService } from '../service/utilisation.service';

@Component({
  templateUrl: './utilisation-delete-dialog.component.html',
})
export class UtilisationDeleteDialogComponent {
  utilisation?: IUtilisation;

  constructor(protected utilisationService: UtilisationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.utilisationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
