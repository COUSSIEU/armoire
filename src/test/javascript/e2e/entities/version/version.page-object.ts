import { element, by, ElementFinder } from 'protractor';

export class VersionComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-version div table .btn-danger'));
  title = element.all(by.css('jhi-version div h2#page-heading span')).first();
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

export class VersionUpdatePage {
  pageTitle = element(by.id('jhi-version-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  appareilSelect = element(by.id('field_appareil'));
  versionInput = element(by.id('field_version'));
  nombreInput = element(by.id('field_nombre'));

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

  async setAppareilSelect(appareil: string): Promise<void> {
    await this.appareilSelect.sendKeys(appareil);
  }

  async getAppareilSelect(): Promise<string> {
    return await this.appareilSelect.element(by.css('option:checked')).getText();
  }

  async appareilSelectLastOption(): Promise<void> {
    await this.appareilSelect.all(by.tagName('option')).last().click();
  }

  async setVersionInput(version: string): Promise<void> {
    await this.versionInput.sendKeys(version);
  }

  async getVersionInput(): Promise<string> {
    return await this.versionInput.getAttribute('value');
  }

  async setNombreInput(nombre: string): Promise<void> {
    await this.nombreInput.sendKeys(nombre);
  }

  async getNombreInput(): Promise<string> {
    return await this.nombreInput.getAttribute('value');
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

export class VersionDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-version-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-version'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
