import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SituationComponent } from './list/situation.component';
import { SituationDetailComponent } from './detail/situation-detail.component';
import { SituationUpdateComponent } from './update/situation-update.component';
import { SituationDeleteDialogComponent } from './delete/situation-delete-dialog.component';
import { SituationRoutingModule } from './route/situation-routing.module';

@NgModule({
  imports: [SharedModule, SituationRoutingModule],
  declarations: [SituationComponent, SituationDetailComponent, SituationUpdateComponent, SituationDeleteDialogComponent],
  entryComponents: [SituationDeleteDialogComponent],
})
export class SituationModule {}
