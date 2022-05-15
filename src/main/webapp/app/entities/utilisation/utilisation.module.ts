import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UtilisationComponent } from './list/utilisation.component';
import { UtilisationDetailComponent } from './detail/utilisation-detail.component';
import { UtilisationUpdateComponent } from './update/utilisation-update.component';
import { UtilisationDeleteDialogComponent } from './delete/utilisation-delete-dialog.component';
import { UtilisationRoutingModule } from './route/utilisation-routing.module';

@NgModule({
  imports: [SharedModule, UtilisationRoutingModule],
  declarations: [UtilisationComponent, UtilisationDetailComponent, UtilisationUpdateComponent, UtilisationDeleteDialogComponent],
  entryComponents: [UtilisationDeleteDialogComponent],
})
export class UtilisationModule {}
