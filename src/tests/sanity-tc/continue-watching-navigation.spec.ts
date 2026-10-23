import { expect, test } from '@playwright/test';
import { ContinueWatchingPage } from '@ViMovies/pageObjects/ContinueWatchingPage';
import { DetailPage } from '@ViMovies/pageObjects/DetailPage';
import { HomePage } from '@ViMovies/pageObjects/HomePage';
import { LoginPage } from '@ViMovies/pageObjects/loginPage';
import { PlayerPage } from '@ViMovies/pageObjects/PlayerPage';
import { SearchPage } from '@ViMovies/pageObjects/SearchPage';

const baseUrl = process.env.BASE_URL!;
const playableContentTitle = process.env.PLAYABLE_CONTENT_TITLE?.trim();

test.describe('Continue Watching - Navigation', () => {
  let continueWatchingPage: ContinueWatchingPage;

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    await homePage.verifyHomePageLoaded();
    await loginPage.login();
    continueWatchingPage = new ContinueWatchingPage(page);
  });

  test.afterEach(async ({ page }) => {
    await page.waitForTimeout(5000);
  });

  test(
    'Verify Continue Watching Rail Is Visible',
    {
      tag: ['@sanity', '@continue-watching', '@navigation'],
    },
    async () => {
      const rail =
        await continueWatchingPage.findContinueWatchingRail();
        await expect( rail, 'Complete Continue Watching rail should be visible').toBeVisible();
    }
  );

  test(
    'Verify Continue Watching Rail Contains Assets',
    {
      tag: ['@sanity', '@continue-watching', '@navigation'],
    },
    async () => {
      const rail = await continueWatchingPage.findContinueWatchingRail();
      const cards = await continueWatchingPage.getContinueWatchingCards(rail);
      expect(cards.length,'Continue Watching rail should contain at least one visible asset' ).toBeGreaterThan(0);
      await expect(cards[0],'The first Continue Watching asset should be visible' ).toBeVisible();
    }
  );

  test(
    'Verify Continue Watching Asset Is Clickable',
    {
      tag: ['@sanity', '@continue-watching', '@navigation'],
    },
    async () => {
      const rail =
        await continueWatchingPage.findContinueWatchingRail();
      await continueWatchingPage.clickFirstContinueWatchingAsset(rail);
    }
  );

  test(
  'Verify Partially Watched Content Is Added to Continue Watching Rail',
  {
    tag: ['@sanity','@continue-watching','@logged-in','@progress', ],
  },
  async ({ page }) => {
    test.skip(
      !playableContentTitle,
      'PLAYABLE_CONTENT_TITLE is required for partial playback coverage'
    );

    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const detailPage = new DetailPage(page);
    const playerPage = new PlayerPage(page);

    const contentTitle = await test.step( 'Open the configured playable content',
      async () => {
        await searchPage.searchAndOpenContent(
          playableContentTitle!
        );
        await detailPage.verifyDetailScreenLoaded();
        const title = await detailPage.getDetailScreenTitle();
        expect( title, 'A valid content title should be captured' ).not.toMatch(
          /^(close|back|watch now|play)$/i);
        return title;
      }
    );

    await test.step(
      'Create measurable partial playback progress',
      async () => {
        await detailPage.clickWatchNowButton();
        await playerPage.verifyPlayerVisible();
        await playerPage.verifyPlaybackStarted();
        await playerPage.seekToPositionReliably(50, 60);
        await playerPage.video.evaluate((video: HTMLVideoElement) => {  video.pause();
          }
        );
      }
    );
    await test.step('Verify watched content appears in Continue Watching',
      async () => {
        await page.goto(baseUrl, {
          waitUntil: 'domcontentloaded',
        });
    await homePage.verifyHomePageLoaded();
    await continueWatchingPage.verifyPartiallyWatchedContentDisplayed(contentTitle,60000
          );
      }
    );
  }
);

test(
  'Verify Continue Watching Rail is Not Available for Guest',
  { tag: ['@sanity', '@guest', '@continue-watching'] },
  async ({ page }) => {
    const homePage = new HomePage(page);
    const continueWatchingPage = new ContinueWatchingPage(page);
    await expect(
      page.getByAltText('header_logo').first(),
      'Home page should load successfully for guest user'
    ).toBeVisible({ timeout: 30000 });
    await homePage.verifyHomePageLoaded();
    await continueWatchingPage.verifyContinueWatchingRailAbsentWhileScrolling();
  },
);

test(
  'Verify 100% Watched Content Is Removed from Continue Watching Rail',
  {
    tag: ['@sanity', '@continue-watching', '@logged-in', '@completion'],
  },
  async ({ page }) => {
    test.skip(
      !playableContentTitle,
      'PLAYABLE_CONTENT_TITLE is required for completion coverage'
    );

    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const detailPage = new DetailPage(page);
    const playerPage = new PlayerPage(page);
    const completedContentPage = new ContinueWatchingPage(page);

    const contentTitle = await test.step(
      'Search for and open the configured playable content',
      async () => {
        await searchPage.searchAndOpenContent(playableContentTitle!);
        await detailPage.verifyDetailScreenLoaded();
        return await detailPage.getDetailScreenTitle();
      }
    );

    await test.step('Play the content through natural completion', async () => {
      await detailPage.clickWatchNowButton();
      await playerPage.verifyPlayerVisible();
      await playerPage.verifyPlaybackStarted();
      await playerPage.seekNearEndAndWaitForCompletion();
    });

    await test.step(
      'Return home and verify the completed title is absent',
      async () => {
        await homePage.clickHomeTab();
        await homePage.verifyHomePageLoaded();
        await completedContentPage.verifyCompletedContentAbsentAfterScrolling(
          contentTitle
        );
      }
    );
  }
);

});