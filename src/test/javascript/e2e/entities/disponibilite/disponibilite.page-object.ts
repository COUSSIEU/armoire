import { element, by, ElementFinder } from 'protractor';

export class DisponibiliteComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-disponibilite div table .btn-danger'));
  title = element.all(by.css('jhi-disponibilite div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class DisponibiliteUpdatePage {
  pageTitle = element(by.id('jhi-disponibilite-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nomInput = element(by.id('field_nom'));
  observableInput = element(by.id('field_observable'));
  etatSelect = element(by.id('field_etat'));
  remarquesInput = element(by.id('field_remarques'));

  situationSelect = element(by.id('field_situation'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNomInput(nom: string): Promise<void> {
    await this.nomInput.sendKeys(nom);
  }

  async getNomInput(): Promise<string> {
    return await this.nomInput.getAttribute('value');
  }

  async setObservableInput(observable: string): Promise<void> {
    await this.observableInput.sendKeys(observable);
  }

  async getObservableInput(): Promise<string> {
    return await this.observableInput.getAttribute('value');
  }

  async setEtatSelect(etat: string): Promise<void> {
    await this.etatSelect.sendKeys(etat);
  }

  async getEtatSelect(): Promise<string> {
    return await this.etatSelect.element(by.css('option:checked')).getText();
  }

  async etatSelectLastOption(): Promise<void> {
    await this.etatSelect.all(by.tagName('option')).last().click();
  }

  async setRemarquesInput(remarques: string): Promise<void> {
    await this.remarquesInput.sendKeys(remarques);
  }

  async getRemarquesInput(): Promise<string> {
    return await this.remarquesInput.getAttribute('value');
  }

  async situationSelectLastOption(): Promise<void> {
    await this.situationSelect.all(by.tagName('option')).last().click();
  }

  async situationSelectOption(option: string): Promise<void> {
    await this.situationSelect.sendKeys(option);
  }

  getSituationSelect(): ElementFinder {
    return this.situationSelect;
  }

  async getSituationSelectedOption(): Promise<string> {
    return await this.situationSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class DisponibiliteDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-disponibilite-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-disponibilite'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
