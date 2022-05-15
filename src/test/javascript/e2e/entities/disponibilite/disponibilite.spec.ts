import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { DisponibiliteComponentsPage, DisponibiliteDeleteDialog, DisponibiliteUpdatePage } from './disponibilite.page-object';

const expect = chai.expect;

describe('Disponibilite e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let disponibiliteComponentsPage: DisponibiliteComponentsPage;
  let disponibiliteUpdatePage: DisponibiliteUpdatePage;
  let disponibiliteDeleteDialog: DisponibiliteDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Disponibilites', async () => {
    await navBarPage.goToEntity('disponibilite');
    disponibiliteComponentsPage = new DisponibiliteComponentsPage();
    await browser.wait(ec.visibilityOf(disponibiliteComponentsPage.title), 5000);
    expect(await disponibiliteComponentsPage.getTitle()).to.eq('armoireApp.disponibilite.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(disponibiliteComponentsPage.entities), ec.visibilityOf(disponibiliteComponentsPage.noResult)),
      1000
    );
  });

  it('should load create Disponibilite page', async () => {
    await disponibiliteComponentsPage.clickOnCreateButton();
    disponibiliteUpdatePage = new DisponibiliteUpdatePage();
    expect(await disponibiliteUpdatePage.getPageTitle()).to.eq('armoireApp.disponibilite.home.createOrEditLabel');
    await disponibiliteUpdatePage.cancel();
  });

  it('should create and save Disponibilites', async () => {
    const nbButtonsBeforeCreate = await disponibiliteComponentsPage.countDeleteButtons();

    await disponibiliteComponentsPage.clickOnCreateButton();

    await promise.all([
      disponibiliteUpdatePage.setNomInput('nom'),
      disponibiliteUpdatePage.setObservableInput('observable'),
      disponibiliteUpdatePage.etatSelectLastOption(),
      disponibiliteUpdatePage.setRemarquesInput('remarques'),
      disponibiliteUpdatePage.situationSelectLastOption(),
    ]);

    await disponibiliteUpdatePage.save();
    expect(await disponibiliteUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await disponibiliteComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Disponibilite', async () => {
    const nbButtonsBeforeDelete = await disponibiliteComponentsPage.countDeleteButtons();
    await disponibiliteComponentsPage.clickOnLastDeleteButton();

    disponibiliteDeleteDialog = new DisponibiliteDeleteDialog();
    expect(await disponibiliteDeleteDialog.getDialogTitle()).to.eq('armoireApp.disponibilite.delete.question');
    await disponibiliteDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(disponibiliteComponentsPage.title), 5000);

    expect(await disponibiliteComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
