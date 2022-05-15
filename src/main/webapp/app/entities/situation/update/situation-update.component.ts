import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISituation, Situation } from '../situation.model';
import { SituationService } from '../service/situation.service';

@Component({
  selector: 'jhi-situation-update',
  templateUrl: './situation-update.component.html',
})
export class SituationUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    creation: [null, [Validators.required]],
    emission: [],
    secondDate: [],
  });

  constructor(protected situationService: SituationService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ situation }) => {
      this.updateForm(situation);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const situation = this.createFromForm();
    if (situation.id !== undefined) {
      this.subscribeToSaveResponse(this.situationService.update(situation));
    } else {
      this.subscribeToSaveResponse(this.situationService.create(situation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISituation>>): void {
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

  protected updateForm(situation: ISituation): void {
    this.editForm.patchValue({
      id: situation.id,
      creation: situation.creation,
      emission: situation.emission,
      secondDate: situation.secondDate,
    });
  }

  protected createFromForm(): ISituation {
    return {
      ...new Situation(),
      id: this.editForm.get(['id'])!.value,
      creation: this.editForm.get(['creation'])!.value,
      emission: this.editForm.get(['emission'])!.value,
      secondDate: this.editForm.get(['secondDate'])!.value,
    };
  }
}
