import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { VersionComponentsPage, VersionDeleteDialog, VersionUpdatePage } from './version.page-object';

const expect = chai.expect;

describe('Version e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let versionComponentsPage: VersionComponentsPage;
  let versionUpdatePage: VersionUpdatePage;
  let versionDeleteDialog: VersionDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Versions', async () => {
    await navBarPage.goToEntity('version');
    versionComponentsPage = new VersionComponentsPage();
    await browser.wait(ec.visibilityOf(versionComponentsPage.title), 5000);
    expect(await versionComponentsPage.getTitle()).to.eq('armoireApp.version.home.title');
    await browser.wait(ec.or(ec.visibilityOf(versionComponentsPage.entities), ec.visibilityOf(versionComponentsPage.noResult)), 1000);
  });

  it('should load create Version page', async () => {
    await versionComponentsPage.clickOnCreateButton();
    versionUpdatePage = new VersionUpdatePage();
    expect(await versionUpdatePage.getPageTitle()).to.eq('armoireApp.version.home.createOrEditLabel');
    await versionUpdatePage.cancel();
  });

  it('should create and save Versions', async () => {
    const nbButtonsBeforeCreate = await versionComponentsPage.countDeleteButtons();

    await versionComponentsPage.clickOnCreateButton();

    await promise.all([
      versionUpdatePage.appareilSelectLastOption(),
      versionUpdatePage.setVersionInput('version'),
      versionUpdatePage.setNombreInput('5'),
      versionUpdatePage.situationSelectLastOption(),
    ]);

    await versionUpdatePage.save();
    expect(await versionUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await versionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Version', async () => {
    const nbButtonsBeforeDelete = await versionComponentsPage.countDeleteButtons();
    await versionComponentsPage.clickOnLastDeleteButton();

    versionDeleteDialog = new VersionDeleteDialog();
    expect(await versionDeleteDialog.getDialogTitle()).to.eq('armoireApp.version.delete.question');
    await versionDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(versionComponentsPage.title), 5000);

    expect(await versionComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
