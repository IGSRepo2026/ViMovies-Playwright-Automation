import { expect, test } from '@playwright/test';
import { BingeListPage } from '@ViMovies/pageObjects/MyBingelistPage';
import { DetailPage } from '@ViMovies/pageObjects/DetailPage';
import { HomePage } from '@ViMovies/pageObjects/HomePage';
import { LoginPage } from '@ViMovies/pageObjects/loginPage';
import { SearchPage } from '@ViMovies/pageObjects/SearchPage';
import { PlayerPage } from '@ViMovies/pageObjects/PlayerPage';

const baseUrl = process.env.BASE_URL!;
const contentTitle = process.env.PLAYABLE_CONTENT_TITLE?.trim();

test.afterEach(async ({ page }) => {
  await page.waitForTimeout(5000);
});

test(
  'Verify Content Is Added to a New BingeList and Removed from the BingeList',
  {
    tag: ['@sanity', '@bingelist', '@logged-in', '@add-content'],
  },
  async ({ page }) => {
    test.skip(
      !contentTitle,
      'PLAYABLE_CONTENT_TITLE is required for BingeList coverage'
    );

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const searchPage = new SearchPage(page);
    const detailPage = new DetailPage(page);
    const bingeListPage = new BingeListPage(page);

    await test.step('Log in and load the home page', async () => {
      await page.goto(baseUrl);
      await homePage.verifyHomePageLoaded();
      await loginPage.login();
      await homePage.verifyHomePageLoaded();
    });

    await test.step('Search and open the content', async () => {
      await searchPage.clickSearchIcon();
      await searchPage.searchAndOpenContent(contentTitle!);
      await detailPage.verifyDetailScreenLoaded();

      const title = (
        await detailPage.getDetailScreenTitle()
      ).trim();

      expect(
        title,
        'Detail screen should display a valid content title'
      ).not.toMatch(/^(exit|close|back|done|watch now|play)$/i);
    });

    await test.step(
      'Remove the content if it is already present in a BingeList',
      async () => {
        await bingeListPage.removeContentIfAlreadyAdded();
      }
    );

    const createdBingeListName = await test.step(
      'Create a uniquely named BingeList and add the content',
      async () => {
        return await bingeListPage.createNewBingeList();
      }
    );

    await test.step(
      'Reopen BingeList and verify the added list name',
      async () => {
        await bingeListPage.verifyContentAddedToCreatedBingeList(
          createdBingeListName
        );
      }
    );
  }
);

test(
  'Verify Playback from BingeList',
  {
    tag: ['@sanity', '@bingelist', '@logged-in', '@playback'],
  },
  async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const detailPage = new DetailPage(page);
    const bingeListPage = new BingeListPage(page);
    const playerPage = new PlayerPage(page);

    await test.step('Log in and open My BingeList', async () => {
      await page.goto(baseUrl);
      await homePage.verifyHomePageLoaded();
      await loginPage.login();
      await homePage.verifyHomePageLoaded();
      await homePage.clickBingeListTab();
      await bingeListPage.verifyBingeListPageLoaded();
      await bingeListPage.openFirstContentFromBingeList();
      await bingeListPage.clickBingeListWatchNowButton();
      await detailPage.clickWatchNowButton();
      await playerPage.verifyPlayerVisible();
      await playerPage.verifyPlaybackStarted()
    });
      await expect(
        playerPage.video,
        'The BingeList video should remain unpaused after playback starts'
      ).toHaveJSProperty('paused', false);
    });
  

test(
  'TC_064 — Verify BingeListed Content is Displayed',
  { tag: ['@sanity', '@bingelist', '@logged-in', '@display'] },
  async ({ page }) => {
    test.skip(!baseUrl, 'BASE_URL is required');

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const bingeListPage = new BingeListPage(page);

    await test.step('Launch Vi Movies & TV and log in', async () => {
      await page.goto(baseUrl!, { waitUntil: 'domcontentloaded' });
      await homePage.verifyHomePageLoaded();

      await loginPage.login();
      await homePage.verifyHomePageLoaded();
    });

    await test.step('Navigate to the BingeList tab', async () => {
      await homePage.clickBingeListTab();
      await bingeListPage.verifyBingeListPageLoaded();
    });

    await test.step(
      'Verify content is displayed on the BingeList tab',
      async () => {
        await bingeListPage.verifyBingeListContentIsDisplayed();
      },
    );
  },
);