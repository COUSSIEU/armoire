import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { SituationComponentsPage, SituationDeleteDialog, SituationUpdatePage } from './situation.page-object';

const expect = chai.expect;

describe('Situation e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let situationComponentsPage: SituationComponentsPage;
  let situationUpdatePage: SituationUpdatePage;
  let situationDeleteDialog: SituationDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Situations', async () => {
    await navBarPage.goToEntity('situation');
    situationComponentsPage = new SituationComponentsPage();
    await browser.wait(ec.visibilityOf(situationComponentsPage.title), 5000);
    expect(await situationComponentsPage.getTitle()).to.eq('armoireApp.situation.home.title');
    await browser.wait(ec.or(ec.visibilityOf(situationComponentsPage.entities), ec.visibilityOf(situationComponentsPage.noResult)), 1000);
  });

  it('should load create Situation page', async () => {
    await situationComponentsPage.clickOnCreateButton();
    situationUpdatePage = new SituationUpdatePage();
    expect(await situationUpdatePage.getPageTitle()).to.eq('armoireApp.situation.home.createOrEditLabel');
    await situationUpdatePage.cancel();
  });

  it('should create and save Situations', async () => {
    const nbButtonsBeforeCreate = await situationComponentsPage.countDeleteButtons();

    await situationComponentsPage.clickOnCreateButton();

    await promise.all([
      situationUpdatePage.setCreationInput('creation'),
      situationUpdatePage.setEmissionInput('emission'),
      situationUpdatePage.setSecondDateInput('secondDate'),
    ]);

    await situationUpdatePage.save();
    expect(await situationUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await situationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Situation', async () => {
    const nbButtonsBeforeDelete = await situationComponentsPage.countDeleteButtons();
    await situationComponentsPage.clickOnLastDeleteButton();

    situationDeleteDialog = new SituationDeleteDialog();
    expect(await situationDeleteDialog.getDialogTitle()).to.eq('armoireApp.situation.delete.question');
    await situationDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(situationComponentsPage.title), 5000);

    expect(await situationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
