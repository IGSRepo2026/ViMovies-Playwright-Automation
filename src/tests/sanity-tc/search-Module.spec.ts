import { expect, test } from '@playwright/test';
import { HomePage } from '@ViMovies/pageObjects/HomePage';
import { SearchPage } from '@ViMovies/pageObjects/SearchPage';
import { SearchPlaybackHelper } from '../../pageObjects/SearchPlaybackHelper';
import { LoginPage } from '@ViMovies/pageObjects/loginPage';
import { PlayerPage } from '@ViMovies/pageObjects/PlayerPage';
import { ShowDetailPage } from '@ViMovies/pageObjects/ShowDetailPage';
import { DetailPage } from '@ViMovies/pageObjects/DetailPage';
import { executeNavigateToSearch, navigateToSearchAndVerify } from '@ViMovies/commonFunctions/NavigationFunction';
import { executeSearchAndVerifyHistory } from '@ViMovies/commonFunctions/SearchHistoryFunction';
import { assertToContain } from '@utils/Assertions';
import scenarios from '@ViMovies/data/search/search-history-scenarios.json';

const baseUrl = process.env.BASE_URL?.trim() ?? '';
const searchKeyword = process.env.Search_Character?.trim() ?? '';
const playableContentTitle =
  process.env.PLAYABLE_CONTENT_TITLE?.trim() ?? '';

test.afterEach(async ({ page }) => {
  await page.waitForTimeout(5000);
});

test(
  'Verify Search Results After Entering 2nd Character',
  {
    tag: ['@sanity', '@search', '@two-characters'],
  },
  async ({ page }) => {
    test.skip(!baseUrl, 'BASE_URL is missing from the .env file');
    test.skip(
      searchKeyword.length < 2,
      'Search_Character must contain at least two characters',
    );

    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const twoCharacterKeyword = searchKeyword.slice(0, 2);

    await test.step('Launch ViMTV and open the Search page', async () => {
      await page.goto(baseUrl, {
        waitUntil: 'domcontentloaded',
      });

      expect(
        await homePage.verifyHomePageLoaded(),
        'Home page did not load',
      ).toBe(true);

      await homePage.clickSearchIcon();

      expect(
        await searchPage.verifySearchPageLoaded(),
        'Search page did not load',
      ).toBe(true);
    });

    await test.step('Verify the Search field is ready', async () => {
      await searchPage.verifySearchInputReady();
    });

    await test.step('Enter the first character and verify results are not displayed', async () => {
      await searchPage.enterSearchPrefix(twoCharacterKeyword.charAt(0));
      await searchPage.verifySearchResultsNotDisplayed();
    });

    await test.step(`Enter "${twoCharacterKeyword}" and verify search results`, async () => {
      await searchPage.enterSearchPrefix(twoCharacterKeyword);
      await searchPage.pressEnterToSearch();

      await searchPage.verifySearchResultsDisplayedForQuery(
        twoCharacterKeyword,
      );
    });
  },
);

test(
  'Verify Search Filters',
  {
    tag: ['@sanity', '@search', '@filters'],
  },
  async ({ page }) => {
    test.skip(!baseUrl, 'BASE_URL is missing from the .env file');
    test.skip(
      !searchKeyword,
      'Search_Character is missing from the .env file',
    );

    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);

    await test.step('Launch ViMTV and open Search', async () => {
      await page.goto(baseUrl, {
        waitUntil: 'domcontentloaded',
      });

      expect(
        await homePage.verifyHomePageLoaded(),
        'Home page did not load',
      ).toBe(true);

      await homePage.clickSearchIcon();

      expect(
        await searchPage.verifySearchPageLoaded(),
        'Search page did not load',
      ).toBe(true);
    });

    await test.step('Search using the configured valid keyword', async () => {
      await searchPage.verifySearchInputReady();
      await searchPage.enterSearchText(searchKeyword);
      await searchPage.waitForResultsToSettle();
    });

    await test.step('Verify all search filter tabs are displayed', async () => {
      await searchPage.verifySearchFiltersDisplayed();
    });
  },
);

test(
  'Verify Error Message for Invalid Character',
  {
    tag: ['@sanity', '@search', '@invalid-character'],
  },
  async ({ page }) => {
    test.skip(!baseUrl, 'BASE_URL is missing from the .env file');

    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const invalidValue = searchPage.createInvalidSearchValue();

    await test.step('Open the Search page', async () => {
      await page.goto(baseUrl, {
        waitUntil: 'domcontentloaded',
      });

      await homePage.verifyHomePageLoaded();
      await homePage.clickSearchIcon();
      await searchPage.verifySearchPageLoaded();
    });

    await test.step('Search using an invalid value', async () => {
      await searchPage.searchInvalidValue(invalidValue);
    });

    await test.step('Verify the no-results response', async () => {
      await searchPage.verifyInvalidSearchResponse(invalidValue);
    });
  },
);

test(
  'Verify Navigation and Content Playback from Search Page',
  {
    tag: [
      '@sanity',
      '@search',
      '@logged-in',
      '@navigation',
      '@playback',
    ],
  },
  async ({ page }) => {
    test.skip(!baseUrl, 'BASE_URL is missing from the .env file');
    test.skip(
      !playableContentTitle,
      'PLAYABLE_CONTENT_TITLE is required for playback coverage',
    );

    test.setTimeout(180000);

    const searchPlayback = new SearchPlaybackHelper(page);

    await test.step('Launch ViMTV and log in', async () => {
      await searchPlayback.launchAndLogin(baseUrl);
    });

    await test.step(`Search and open content: ${playableContentTitle}`, async () => {
      await searchPlayback.searchAndOpenContent(
        playableContentTitle,
      );

      console.log(
        `Selected content title: ${playableContentTitle}`,
      );
    });

    await test.step('Start playback and verify the player is progressing', async () => {
      await searchPlayback.startAndVerifyPlayback();

      console.log(
        `Playback started successfully: ${playableContentTitle}`,
      );
    });
  },
);

test(
  'Verify You May Also Like Rail is Displayed',
  {
    tag: ['@sanity', '@player', '@you-may-also-like'],
  },
  async ({ page }) => {
    test.skip(!baseUrl, 'BASE_URL is missing from the .env file');
    test.skip(
      !playableContentTitle,
      'PLAYABLE_CONTENT_TITLE is required for You May Also Like coverage',
    );

    test.setTimeout(180000);

    const homePage = new HomePage(page);
    const searchPage = new SearchPage(page);
    const detailPage = new DetailPage(page);
    const showDetailPage = new ShowDetailPage(page);
    const playerPage = new PlayerPage(page);
    const loginPage = new LoginPage(page);

    await test.step('Launch ViMTV and log in', async () => {
      await page.goto(baseUrl, {
        waitUntil: 'domcontentloaded',
      });

      await homePage.verifyHomePageLoaded();
      await loginPage.login();
      await homePage.clickHomeTab();
    });

    await test.step(`Search and open content: ${playableContentTitle}`, async () => {
      await homePage.clickSearchIcon();
      await searchPage.verifySearchPageLoaded();

      await searchPage.searchAndOpenContent(
        playableContentTitle,
      );
    });

    await test.step('Start content playback', async () => {
      await detailPage.clickWatchNowButton();
      await playerPage.verifyPlaybackStarted();
    });

    await test.step('Verify You May Also Like rail is displayed with content', async () => {
      await playerPage.hoverPlayer();
      await showDetailPage.verifyYouMayAlsoLikeRail();
    });
  },
);


test.describe('Search — History Functionality', () => {
  for (const scenario of scenarios.scenarios) {
    test(`${scenario.id} — ${scenario.description}`, { tag: ['@search'] }, async ({
      page,
    }) => {
      const navResult = await executeNavigateToSearch(page, { baseUrl });
      await assertToContain( page, navResult.navigationStatus, '/search',  'Navigate to search page',
      );
      const historyResult = await executeSearchAndVerifyHistory(page, { searchText: scenario.searchText,});
      await assertToContain(  page,  historyResult.searchPerformedStatus,  scenario.searchText,  'Search was performed with given text', );

      await assertToContain(
        page,
        historyResult.historyVisibleStatus,
        '— displayed',
        'Search history section displayed after returning',
      );

      await assertToContain(
        page,
        historyResult.historyContainsSearchStatus,
        scenario.expectedHistoryKeyword,
        'Search history contains the searched term',
      );

      await assertToContain(
        page,
        historyResult.autofillStatus,
        'autofilled',
        'Search text box autofills after tapping history item',
      );
    });
  }
});

test.describe('Search — Clear History', () => {
  test(
    'TC_010 — Verify Clear History CTA',
    { tag: ['@sanity', '@search', '@history', '@clear-history'] },
    async ({ page }) => {
      const searchText =
        process.env.SEARCH_HISTORY_TEST_TITLE?.trim() ||
        scenarios.scenarios[0]?.searchText;

      if (!searchText) {
        throw new Error('A valid search title is required for TC_010');
      }

      const searchPage = await navigateToSearchAndVerify(page, { baseUrl });

      await test.step('Ensure Search History contains an item', async () => {
        await searchPage.ensureSearchHistoryItem(searchText);
      });

      const historyItemsBeforeClear = await searchPage.getSearchHistoryItems();
      expect(
        historyItemsBeforeClear.length,
        'Search History should contain at least one item before clearing',
      ).toBeGreaterThan(0);
      const previouslySearchedTitle = historyItemsBeforeClear[0];

      await test.step('Click Clear History CTA', async () => {
        expect(
          await searchPage.isClearHistoryVisible(),
          'Clear History CTA should be available when history is populated',
        ).toBe(true);
        await searchPage.clickClearHistory();
      });

      await test.step('Verify Search History is cleared', async () => {
        await searchPage.waitForSearchHistoryToBeEmpty();
        expect(
          await searchPage.getSearchHistoryItemCount(),
          'Search History item count should be zero after clearing',
        ).toBe(0);
        expect(
          await searchPage.isSearchHistoryEmptyOrHidden(),
          'Search History should be empty or hidden after clearing',
        ).toBe(true);
      });

      await test.step('Verify the previously searched title is removed', async () => {
        await expect
          .poll(() => searchPage.getSearchHistoryItems(), {
            message: `Previously searched title "${previouslySearchedTitle}" should no longer be present`,
            timeout: 10_000,
            intervals: [100, 250, 500],
          })
          .not.toContain(previouslySearchedTitle);
      });
    },
  );
});
