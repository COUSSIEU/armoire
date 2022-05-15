import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SituationComponent } from '../list/situation.component';
import { SituationDetailComponent } from '../detail/situation-detail.component';
import { SituationUpdateComponent } from '../update/situation-update.component';
import { SituationRoutingResolveService } from './situation-routing-resolve.service';

const situationRoute: Routes = [
  {
    path: '',
    component: SituationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SituationDetailComponent,
    resolve: {
      situation: SituationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SituationUpdateComponent,
    resolve: {
      situation: SituationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SituationUpdateComponent,
    resolve: {
      situation: SituationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(situationRoute)],
  exports: [RouterModule],
})
export class SituationRoutingModule {}
