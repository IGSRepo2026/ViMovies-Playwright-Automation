/**
 * Search Navigation and Validation Test Suite
 * @author ViMovies Automation
 * @tags @navigation @search
 */

import { expect, test } from '@playwright/test';
import { assertToBe } from '@utils/Assertions';
import searchScenarioData from '@ViMovies/data/search/search-scenarios.json';
import navigationScenarioData from '@ViMovies/data/navigation/navigation-scenarios.json';
import { navigateToSearchAndVerify } from '@ViMovies/commonFunctions/NavigationFunction';

const baseUrl = process.env.BASE_URL;

test.beforeEach(async ({ page }) => {
  if (!baseUrl) {
    throw new Error('BASE_URL is not configured in the environment file');
  }

  page.on('response', (response) => {
    if (response.status() === 403) {
      console.error(
        `403 Forbidden: ${response.request().method()} ${response.url()}`,
      );
    }
  });
});

test.afterEach(async ({ page }) => {
  await page.waitForTimeout(5000);
});

function getSearchScenario(id: string) {
  const scenario = searchScenarioData.scenarios.find(
    (item: { id: string }) => item.id === id,
  );

  if (!scenario) {
    throw new Error(`Search scenario "${id}" was not found`);
  }

  return scenario;
}

function getNavigationScenario(id: string) {
  const scenario = navigationScenarioData.scenarios.find(
    (item: { id: string }) => item.id === id,
  );

  if (!scenario) {
    throw new Error(`Navigation scenario "${id}" was not found`);
  }

  return scenario;
}

test.describe('Navigation — Search Icon', () => {
  const scenario = getNavigationScenario('TC_01');

  test(
    `${scenario.id} — ${scenario.description}`,
    { tag: ['@navigation'] },
    async ({ page }) => {
      await navigateToSearchAndVerify(page, {
        baseUrl: baseUrl!,
        expectedUrl: scenario.expectedUrl,
      });
    },
  );
});

test.describe('Search Page — UI Validation', () => {
  const scenario = getNavigationScenario('TC_02');

  test(
    `${scenario.id} — ${scenario.description}`,
    { tag: ['@search', '@navigation'] },
    async ({ page }) => {
      const searchPage = await navigateToSearchAndVerify(page, {
        baseUrl: baseUrl!,
      });

      await assertToBe(
        page,
        await searchPage.isHeaderLogoVisible(),
        true,
        'ViMTV logo is displayed',
      );
      await assertToBe(
        page,
        await searchPage.isSearchInputVisible(),
        true,
        'Search text field is displayed',
      );
      await assertToBe(
        page,
        await searchPage.isExploreByAppsVisible(),
        true,
        'Explore by Apps rail is displayed',
      );
      await assertToBe(
        page,
        await searchPage.isExploreByLanguageVisible(),
        true,
        'Explore by Language rail is displayed',
      );
      await assertToBe(
        page,
        await searchPage.isExploreByGenresVisible(),
        true,
        'Explore by Genre rail is displayed',
      );

      const visibleRails = await searchPage.getVisibleContentRails();
      await assertToBe(
        page,
        visibleRails.length > 0,
        true,
        'Other configurable rails are displayed',
      );
    },
  );
});

test.describe('Search — Input Entry', () => {
  const scenario = getSearchScenario('T1001');

  test(
    `${scenario.id} — ${scenario.description}`,
    { tag: ['@search'] },
    async ({ page }) => {
      const searchPage = await navigateToSearchAndVerify(page, {
        baseUrl: baseUrl!,
      });
      const searchText = scenario.searchInput?.trim();

      if (!searchText) {
        throw new Error('searchInput is missing for scenario T1001');
      }

      await searchPage.focusSearchInput();
      await searchPage.enterSearchText(searchText);
      await searchPage.verifySearchInputValue(searchText);
      await searchPage.verifySearchInputState();
    },
  );
});

test.describe('Search — Results UI', () => {
  const scenario = getSearchScenario('T1003');

  test(
    `${scenario.id} — ${scenario.description}`,
    { tag: ['@search'] },
    async ({ page }) => {
      test.skip(true, 'Temporarily disabled at user request.');

      const searchPage = await navigateToSearchAndVerify(page, {
        baseUrl: baseUrl!,
      });
      const searchText = scenario.searchInput?.trim();

      if (!searchText) {
        throw new Error('searchInput is missing for scenario T1003');
      }
      await searchPage.enterAndSubmitSearch(searchText);
      await searchPage.verifySearchResultsLoaded(searchText);
      const actualFilters = await searchPage.getFilterOptions();
      expect(actualFilters).toEqual(
        expect.arrayContaining([
          'All',
          'Movies',
          'TV Shows',
          'Live',
          'Videos',
        ]),
      );

      await assertToBe(
        page,
        (await searchPage.getSearchResultsCount()) > 0,
        true,
        'Search results are displayed',
      );

      await assertToBe(
        page,
        await searchPage.verifySearchCardFields(),
        true,
        'Each result contains a thumbnail and title',
      );

      await assertToBe(
        page,
        await searchPage.verifyResultsMatchQuery(searchText),
        true,
        'Search results match the entered keyword',
      );

      await assertToBe(
        page,
        await searchPage.verifySearchResultsAlignment(),
        true,
        'Search results UI was properly aligned',
      );
    },
  );
});

test.describe('Search — No Results Validation', () => {
  const scenario = getSearchScenario('T1004');

  test(
    `${scenario.id} — ${scenario.description}`,
    { tag: ['@search'] },
    async ({ page }) => {
      const searchPage = await navigateToSearchAndVerify(page, {
        baseUrl: baseUrl!,
      });
      const searchText = scenario.searchContent?.trim();

      if (!searchText) {
        throw new Error('searchContent is missing for scenario T1004');
      }

      await searchPage.enterAndSubmitSearch(searchText);
      await searchPage.verifyNoSearchResultsFound();
    },
  );
});
