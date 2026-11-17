import { expect, test } from '@playwright/test';
import { HomePage } from '@ViMovies/pageObjects/HomePage';
import { LoginPage } from '@ViMovies/pageObjects/loginPage';
import { DetailPage } from '@ViMovies/pageObjects/DetailPage';
 import { PlayerPage } from '@ViMovies/pageObjects/PlayerPage';
import { SearchPage } from '@ViMovies/pageObjects/SearchPage';
import { LiveDetailLocators } from '@ViMovies/pageObjects/LiveDetailLocators';




const baseUrl = process.env.BASE_URL!;
const playableContentTitle = process.env.PLAYABLE_CONTENT_TITLE!;

test.describe('Detail Screen Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(baseUrl);
        const homePage = new HomePage(page);
        await homePage.verifyHomePageLoaded();
    });

 test.afterEach(async ({ page }) => {
    await page.waitForTimeout(5000);
  });    

    test(
        'Verify Navigation to Detail Screen',
        {
            tag: ['@sanity', '@navigation', '@detail'],
        },
        async ({ page }) => {
            const homePage = new HomePage(page);
            const loginPage = new LoginPage(page);
            const detailPage = new DetailPage(page);
            await loginPage.login();
            await homePage.clickHomeTab();
            await homePage.verifyHomePageLoaded();
            await homePage.clickAsset();
            await detailPage.verifyDetailScreenLoaded();
            await expect(page).not.toHaveURL(baseUrl);
            await expect(detailPage.detailTitle).toBeVisible();
        }
    );

      test(
        'Validate 10-Second Forward/Backward Buttons @sanity @player @playback @seek-controls',
        {
          tag: ['@sanity', '@player', '@playback', '@seek-controls'],
        },
        async ({ page }) => {
          const homePage = new HomePage(page);
          const searchPage = new SearchPage(page);
          const detailPage = new DetailPage(page);
          const playerPage = new PlayerPage(page);
          const loginPage = new LoginPage(page);
          await loginPage.login();
          await homePage.clickHomeTab();
          await searchPage.searchAndOpenContent(playableContentTitle);
          await detailPage.verifyDetailScreenLoaded();
          await detailPage.clickWatchNowButton();
          await playerPage.verifyPlayerVisible();
          await playerPage.verifyPlaybackStarted();
          await playerPage.hoverPlayer();
          await expect(playerPage.tenSecondForwardButton).toBeVisible();
          await expect(playerPage.tenSecondBackwardButton).toBeVisible();
        }
      );
    
    
      test('Validate Play/Pause Functionality',
    {
      tag: ['@sanity', '@player', '@playback', '@play-pause'],
    },
    async ({ page }) => {
      const homePage = new HomePage(page);
      const loginPage = new LoginPage(page);
      const searchPage = new SearchPage(page);
      const detailPage = new DetailPage(page);
      const playerPage = new PlayerPage(page);
      await loginPage.login();
      await homePage.clickHomeTab();
      await searchPage.searchAndOpenContent(playableContentTitle);
      await detailPage.verifyDetailScreenLoaded();
      await detailPage.clickWatchNowButton();
      await playerPage.verifyPlayerVisible();
      await playerPage.ensurePlaying();
      await playerPage.verifyPlayPauseFunctionality();
    },
  );


     test(
  '@sanity @player @progressbar @seek Verify progress bar updates during playback and seeking moves playback to the selected position',
  async ({ page }) => {
    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const detailPage = new DetailPage(page);
    const playerPage = new PlayerPage(page);
    const loginPage = new LoginPage(page);
    await loginPage.login();
    await homePage.clickHomeTab();
    await searchPage.searchAndOpenContent(playableContentTitle);
    await detailPage.clickWatchNowButton();
    await playerPage.verifyPlayerVisible();
    await playerPage.verifyPlaybackStarted();
    await playerPage.verifyProgressBarUpdates();
    await playerPage.validateSeekFunctionality(50);
  }
);

    
      test(
        'Verify LIVE Detail Screen @sanity @live @detail',
        {
          tag: ['@sanity', '@live', '@detail'],
        },
        async ({ page }) => {
          const homePage = new HomePage(page);
          const loginPage = new LoginPage(page);
          await loginPage.login();
          await homePage.clickHomeTab();
          const liveDetailPage = new LiveDetailLocators(page);
          await liveDetailPage.navigateToLiveDetailScreen();
          await liveDetailPage.verifyLivePlayerDisplayed();
        }
      );
    
    test.describe('Validate Settings Option', () => {
      test(
        'Validate Settings Option @sanity @player @settings',
        async ({ page }) => {
          const homePage = new HomePage(page);
          const searchPage = new SearchPage(page);
          const detailPage = new DetailPage(page);
          const playerPage = new PlayerPage(page);
          const loginPage = new LoginPage(page);
          await loginPage.login();
          await homePage.clickHomeTab();
          await searchPage.searchAndOpenContent(playableContentTitle);
          await detailPage.clickWatchNowButton();
          await playerPage.verifyPlayerVisible();
          await playerPage.verifyPlaybackStarted();
          await playerPage.verifySettingsOption();
          });
        }
      );

    
  test('Validate Quality Option', { tag: ['@sanity', '@player', '@quality'] }, async ({ page }) => {
     const homePage = new HomePage(page);
     const searchPage = new SearchPage(page);
     const detailPage = new DetailPage(page);
     const playerPage = new PlayerPage(page);
     const loginPage = new LoginPage(page);
     await loginPage.login();
     await homePage.clickHomeTab();
    await searchPage.searchAndOpenContent(playableContentTitle);
    await detailPage.clickWatchNowButton();
    await playerPage.verifyPlaybackStarted();
    await playerPage.verifyQualityOption();
  });
});


