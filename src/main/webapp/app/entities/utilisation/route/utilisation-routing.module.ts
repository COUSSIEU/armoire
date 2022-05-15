import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UtilisationComponent } from '../list/utilisation.component';
import { UtilisationDetailComponent } from '../detail/utilisation-detail.component';
import { UtilisationUpdateComponent } from '../update/utilisation-update.component';
import { UtilisationRoutingResolveService } from './utilisation-routing-resolve.service';

const utilisationRoute: Routes = [
  {
    path: '',
    component: UtilisationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UtilisationDetailComponent,
    resolve: {
      utilisation: UtilisationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UtilisationUpdateComponent,
    resolve: {
      utilisation: UtilisationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UtilisationUpdateComponent,
    resolve: {
      utilisation: UtilisationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(utilisationRoute)],
  exports: [RouterModule],
})
export class UtilisationRoutingModule {}
