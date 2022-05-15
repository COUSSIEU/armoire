import { element, by, ElementFinder } from 'protractor';

export class SituationComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-situation div table .btn-danger'));
  title = element.all(by.css('jhi-situation div h2#page-heading span')).first();
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

export class SituationUpdatePage {
  pageTitle = element(by.id('jhi-situation-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  creationInput = element(by.id('field_creation'));
  emissionInput = element(by.id('field_emission'));
  secondDateInput = element(by.id('field_secondDate'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setCreationInput(creation: string): Promise<void> {
    await this.creationInput.sendKeys(creation);
  }

  async getCreationInput(): Promise<string> {
    return await this.creationInput.getAttribute('value');
  }

  async setEmissionInput(emission: string): Promise<void> {
    await this.emissionInput.sendKeys(emission);
  }

  async getEmissionInput(): Promise<string> {
    return await this.emissionInput.getAttribute('value');
  }

  async setSecondDateInput(secondDate: string): Promise<void> {
    await this.secondDateInput.sendKeys(secondDate);
  }

  async getSecondDateInput(): Promise<string> {
    return await this.secondDateInput.getAttribute('value');
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

export class SituationDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-situation-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-situation'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
