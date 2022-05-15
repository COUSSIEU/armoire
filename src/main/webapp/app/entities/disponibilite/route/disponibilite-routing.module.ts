import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DisponibiliteComponent } from '../list/disponibilite.component';
import { DisponibiliteDetailComponent } from '../detail/disponibilite-detail.component';
import { DisponibiliteUpdateComponent } from '../update/disponibilite-update.component';
import { DisponibiliteRoutingResolveService } from './disponibilite-routing-resolve.service';

const disponibiliteRoute: Routes = [
  {
    path: '',
    component: DisponibiliteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DisponibiliteDetailComponent,
    resolve: {
      disponibilite: DisponibiliteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DisponibiliteUpdateComponent,
    resolve: {
      disponibilite: DisponibiliteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DisponibiliteUpdateComponent,
    resolve: {
      disponibilite: DisponibiliteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(disponibiliteRoute)],
  exports: [RouterModule],
})
export class DisponibiliteRoutingModule {}
