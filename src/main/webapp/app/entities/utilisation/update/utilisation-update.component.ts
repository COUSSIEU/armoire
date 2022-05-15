import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUtilisation, Utilisation } from '../utilisation.model';
import { UtilisationService } from '../service/utilisation.service';
import { ISituation } from 'app/entities/situation/situation.model';
import { SituationService } from 'app/entities/situation/service/situation.service';

@Component({
  selector: 'jhi-utilisation-update',
  templateUrl: './utilisation-update.component.html',
})
export class UtilisationUpdateComponent implements OnInit {
  isSaving = false;

  situationsSharedCollection: ISituation[] = [];

  editForm = this.fb.group({
    id: [],
    element: [null, [Validators.required]],
    etat: [null, [Validators.required]],
    nombre: [null, [Validators.required]],
    situation: [],
  });

  constructor(
    protected utilisationService: UtilisationService,
    protected situationService: SituationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ utilisation }) => {
      this.updateForm(utilisation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const utilisation = this.createFromForm();
    if (utilisation.id !== undefined) {
      this.subscribeToSaveResponse(this.utilisationService.update(utilisation));
    } else {
      this.subscribeToSaveResponse(this.utilisationService.create(utilisation));
    }
  }

  trackSituationById(_index: number, item: ISituation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUtilisation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(utilisation: IUtilisation): void {
    this.editForm.patchValue({
      id: utilisation.id,
      element: utilisation.element,
      etat: utilisation.etat,
      nombre: utilisation.nombre,
      situation: utilisation.situation,
    });

    this.situationsSharedCollection = this.situationService.addSituationToCollectionIfMissing(
      this.situationsSharedCollection,
      utilisation.situation
    );
  }

  protected loadRelationshipsOptions(): void {
    this.situationService
      .query()
      .pipe(map((res: HttpResponse<ISituation[]>) => res.body ?? []))
      .pipe(
        map((situations: ISituation[]) =>
          this.situationService.addSituationToCollectionIfMissing(situations, this.editForm.get('situation')!.value)
        )
      )
      .subscribe((situations: ISituation[]) => (this.situationsSharedCollection = situations));
  }

  protected createFromForm(): IUtilisation {
    return {
      ...new Utilisation(),
      id: this.editForm.get(['id'])!.value,
      element: this.editForm.get(['element'])!.value,
      etat: this.editForm.get(['etat'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      situation: this.editForm.get(['situation'])!.value,
    };
  }
}
