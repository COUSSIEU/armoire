import { element, by, ElementFinder } from 'protractor';

export class UtilisationComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-utilisation div table .btn-danger'));
  title = element.all(by.css('jhi-utilisation div h2#page-heading span')).first();
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

export class UtilisationUpdatePage {
  pageTitle = element(by.id('jhi-utilisation-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  elementInput = element(by.id('field_element'));
  etatInput = element(by.id('field_etat'));
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

  async setElementInput(element: string): Promise<void> {
    await this.elementInput.sendKeys(element);
  }

  async getElementInput(): Promise<string> {
    return await this.elementInput.getAttribute('value');
  }

  async setEtatInput(etat: string): Promise<void> {
    await this.etatInput.sendKeys(etat);
  }

  async getEtatInput(): Promise<string> {
    return await this.etatInput.getAttribute('value');
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

export class UtilisationDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-utilisation-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-utilisation'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
