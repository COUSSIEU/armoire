import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVersion, Version } from '../version.model';
import { VersionService } from '../service/version.service';
import { ISituation } from 'app/entities/situation/situation.model';
import { SituationService } from 'app/entities/situation/service/situation.service';
import { Appareil } from 'app/entities/enumerations/appareil.model';

@Component({
  selector: 'jhi-version-update',
  templateUrl: './version-update.component.html',
})
export class VersionUpdateComponent implements OnInit {
  isSaving = false;
  appareilValues = Object.keys(Appareil);

  situationsSharedCollection: ISituation[] = [];

  editForm = this.fb.group({
    id: [],
    appareil: [null, [Validators.required]],
    version: [null, [Validators.required]],
    nombre: [null, [Validators.required]],
    situation: [],
  });

  constructor(
    protected versionService: VersionService,
    protected situationService: SituationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ version }) => {
      this.updateForm(version);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const version = this.createFromForm();
    if (version.id !== undefined) {
      this.subscribeToSaveResponse(this.versionService.update(version));
    } else {
      this.subscribeToSaveResponse(this.versionService.create(version));
    }
  }

  trackSituationById(_index: number, item: ISituation): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVersion>>): void {
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

  protected updateForm(version: IVersion): void {
    this.editForm.patchValue({
      id: version.id,
      appareil: version.appareil,
      version: version.version,
      nombre: version.nombre,
      situation: version.situation,
    });

    this.situationsSharedCollection = this.situationService.addSituationToCollectionIfMissing(
      this.situationsSharedCollection,
      version.situation
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

  protected createFromForm(): IVersion {
    return {
      ...new Version(),
      id: this.editForm.get(['id'])!.value,
      appareil: this.editForm.get(['appareil'])!.value,
      version: this.editForm.get(['version'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      situation: this.editForm.get(['situation'])!.value,
    };
  }
}
