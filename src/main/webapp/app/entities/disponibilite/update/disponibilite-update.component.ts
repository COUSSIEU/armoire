import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDisponibilite, Disponibilite } from '../disponibilite.model';
import { DisponibiliteService } from '../service/disponibilite.service';
import { ISituation } from 'app/entities/situation/situation.model';
import { SituationService } from 'app/entities/situation/service/situation.service';
import { Status } from 'app/entities/enumerations/status.model';

@Component({
  selector: 'jhi-disponibilite-update',
  templateUrl: './disponibilite-update.component.html',
})
export class DisponibiliteUpdateComponent implements OnInit {
  isSaving = false;
  statusValues = Object.keys(Status);

  situationsSharedCollection: ISituation[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [null, [Validators.required]],
    observable: [null, [Validators.required]],
    etat: [null, [Validators.required]],
    remarques: [],
    situation: [],
  });

  constructor(
    protected disponibiliteService: DisponibiliteService,
    protected situationService: SituationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ disponibilite }) => {
      this.updateForm(disponibilite);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const disponibilite = this.createFromForm();
    if (disponibilite.id !== undefined) {
      this.subscribeToSaveResponse(this.disponibiliteService.update(disponibilite));
    } else {
      this.subscribeToSaveResponse(this.disponibiliteService.create(disponibilite));
    }
  }

  trackSituationById(_index: number, item: ISituation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDisponibilite>>): void {
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

  protected updateForm(disponibilite: IDisponibilite): void {
    this.editForm.patchValue({
      id: disponibilite.id,
      nom: disponibilite.nom,
      observable: disponibilite.observable,
      etat: disponibilite.etat,
      remarques: disponibilite.remarques,
      situation: disponibilite.situation,
    });

    this.situationsSharedCollection = this.situationService.addSituationToCollectionIfMissing(
      this.situationsSharedCollection,
      disponibilite.situation
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

  protected createFromForm(): IDisponibilite {
    return {
      ...new Disponibilite(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      observable: this.editForm.get(['observable'])!.value,
      etat: this.editForm.get(['etat'])!.value,
      remarques: this.editForm.get(['remarques'])!.value,
      situation: this.editForm.get(['situation'])!.value,
    };
  }
}
