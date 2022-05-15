import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { UtilisationComponentsPage, UtilisationDeleteDialog, UtilisationUpdatePage } from './utilisation.page-object';

const expect = chai.expect;

describe('Utilisation e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let utilisationComponentsPage: UtilisationComponentsPage;
  let utilisationUpdatePage: UtilisationUpdatePage;
  let utilisationDeleteDialog: UtilisationDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Utilisations', async () => {
    await navBarPage.goToEntity('utilisation');
    utilisationComponentsPage = new UtilisationComponentsPage();
    await browser.wait(ec.visibilityOf(utilisationComponentsPage.title), 5000);
    expect(await utilisationComponentsPage.getTitle()).to.eq('armoireApp.utilisation.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(utilisationComponentsPage.entities), ec.visibilityOf(utilisationComponentsPage.noResult)),
      1000
    );
  });

  it('should load create Utilisation page', async () => {
    await utilisationComponentsPage.clickOnCreateButton();
    utilisationUpdatePage = new UtilisationUpdatePage();
    expect(await utilisationUpdatePage.getPageTitle()).to.eq('armoireApp.utilisation.home.createOrEditLabel');
    await utilisationUpdatePage.cancel();
  });

  it('should create and save Utilisations', async () => {
    const nbButtonsBeforeCreate = await utilisationComponentsPage.countDeleteButtons();

    await utilisationComponentsPage.clickOnCreateButton();

    await promise.all([
      utilisationUpdatePage.setElementInput('element'),
      utilisationUpdatePage.setEtatInput('etat'),
      utilisationUpdatePage.setNombreInput('5'),
      utilisationUpdatePage.situationSelectLastOption(),
    ]);

    await utilisationUpdatePage.save();
    expect(await utilisationUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await utilisationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Utilisation', async () => {
    const nbButtonsBeforeDelete = await utilisationComponentsPage.countDeleteButtons();
    await utilisationComponentsPage.clickOnLastDeleteButton();

    utilisationDeleteDialog = new UtilisationDeleteDialog();
    expect(await utilisationDeleteDialog.getDialogTitle()).to.eq('armoireApp.utilisation.delete.question');
    await utilisationDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(utilisationComponentsPage.title), 5000);

    expect(await utilisationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
