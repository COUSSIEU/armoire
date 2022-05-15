import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISituation } from '../situation.model';
import { SituationService } from '../service/situation.service';

@Component({
  templateUrl: './situation-delete-dialog.component.html',
})
export class SituationDeleteDialogComponent {
  situation?: ISituation;

  constructor(protected situationService: SituationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.situationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
