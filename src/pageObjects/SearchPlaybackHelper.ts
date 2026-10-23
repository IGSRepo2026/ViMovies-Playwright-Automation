import { expect, Page } from '@playwright/test';
import { DetailPage } from '@ViMovies/pageObjects/DetailPage';
import { HomePage } from '@ViMovies/pageObjects/HomePage';
import { LoginPage } from '@ViMovies/pageObjects/loginPage';
import { PlayerPage } from '@ViMovies/pageObjects/PlayerPage';
import { SearchPage } from '@ViMovies/pageObjects/SearchPage';

export class SearchPlaybackHelper {
  private readonly homePage: HomePage;
  private readonly loginPage: LoginPage;
  private readonly searchPage: SearchPage;
  private readonly detailPage: DetailPage;
  private readonly playerPage: PlayerPage;

  constructor(private readonly page: Page) {
    this.homePage = new HomePage(page);
    this.loginPage = new LoginPage(page);
    this.searchPage = new SearchPage(page);
    this.detailPage = new DetailPage(page);
    this.playerPage = new PlayerPage(page);
  }

  async launchAndLogin(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    expect(await this.homePage.verifyHomePageLoaded(), 'Home page did not load').toBe(true);

    await this.loginPage.login();
    expect(
      await this.homePage.verifyHomePageLoaded(),
      'Home page was not displayed after login',
    ).toBe(true);
  }

  async searchAndOpenContent(contentTitle: string): Promise<void> {
    await this.homePage.clickSearchIcon();
    expect(
      await this.searchPage.verifySearchPageLoaded(),
      'Search page did not load',
    ).toBe(true);

    await this.searchPage.verifySearchInputReady();
    await this.searchPage.enterSearchText(contentTitle);
    await this.searchPage.verifySearchResultsLoaded(contentTitle);
    expect(
      await this.searchPage.verifyResultsMatchQuery(contentTitle),
      `Search results were not relevant to "${contentTitle}"`,
    ).toBe(true);

    await this.searchPage.selectSearchResultByTitle(contentTitle);
    await this.detailPage.verifyDetailScreenLoaded();
    expect(
      await this.detailPage.getDetailScreenTitle(),
      'Detail screen title did not match the selected search result',
    ).toBe(contentTitle);
  }

  async startAndVerifyPlayback(): Promise<void> {
    await this.detailPage.clickWatchNowButton();
    await this.playerPage.verifyPlayerVisible();
    await this.playerPage.verifyPlaybackStarted();
  }
}