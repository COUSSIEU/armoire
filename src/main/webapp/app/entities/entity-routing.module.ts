import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'situation',
        data: { pageTitle: 'armoireApp.situation.home.title' },
        loadChildren: () => import('./situation/situation.module').then(m => m.SituationModule),
      },
      {
        path: 'version',
        data: { pageTitle: 'armoireApp.version.home.title' },
        loadChildren: () => import('./version/version.module').then(m => m.VersionModule),
      },
      {
        path: 'utilisation',
        data: { pageTitle: 'armoireApp.utilisation.home.title' },
        loadChildren: () => import('./utilisation/utilisation.module').then(m => m.UtilisationModule),
      },
      {
        path: 'disponibilite',
        data: { pageTitle: 'armoireApp.disponibilite.home.title' },
        loadChildren: () => import('./disponibilite/disponibilite.module').then(m => m.DisponibiliteModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
