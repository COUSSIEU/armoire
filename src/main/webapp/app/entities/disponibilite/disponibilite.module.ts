import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DisponibiliteComponent } from './list/disponibilite.component';
import { DisponibiliteDetailComponent } from './detail/disponibilite-detail.component';
import { DisponibiliteUpdateComponent } from './update/disponibilite-update.component';
import { DisponibiliteDeleteDialogComponent } from './delete/disponibilite-delete-dialog.component';
import { DisponibiliteRoutingModule } from './route/disponibilite-routing.module';

@NgModule({
  imports: [SharedModule, DisponibiliteRoutingModule],
  declarations: [DisponibiliteComponent, DisponibiliteDetailComponent, DisponibiliteUpdateComponent, DisponibiliteDeleteDialogComponent],
  entryComponents: [DisponibiliteDeleteDialogComponent],
})
export class DisponibiliteModule {}
