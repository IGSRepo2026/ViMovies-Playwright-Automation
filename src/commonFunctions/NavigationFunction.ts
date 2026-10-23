import { expect, Page } from '@playwright/test';
import { HomePage } from '@ViMovies/pageObjects/HomePage';
import { SearchPage } from '@ViMovies/pageObjects/SearchPage';
import { assertToBe, assertUrlContains } from '@utils/Assertions';

export type NavigateToSearchOptions = {
  baseUrl: string;
  expectedUrl?: string;
};

export async function navigateToSearchAndVerify(
  page: Page,
  options: NavigateToSearchOptions,
): Promise<SearchPage> {
  const homePage = new HomePage(page);
  const searchPage = new SearchPage(page);

  await page.goto(options.baseUrl, {
    waitUntil: 'domcontentloaded',
  });

  await assertToBe(
    page,
    await homePage.verifyHomePageLoaded(),
    true,
    'Home page is displayed',
  );

  await homePage.clickSearchIcon();

  if (options.expectedUrl) {
    await assertUrlContains(
      page,
      options.expectedUrl,
      'Verify search page URL after clicking search icon',
    );
  } else {
    await expect(page).toHaveURL(/\/search/i);
  }

  await assertToBe(
    page,
    await searchPage.verifySearchPageLoaded(),
    true,
    'Search page search input is visible',
  );

  return searchPage;
}

export async function enterAndSubmitSearch(
  searchPage: SearchPage,
  searchText: string,
): Promise<void> {
  if (!searchText.trim()) {
    throw new Error('Search text cannot be empty');
  }

  await searchPage.enterAndSubmitSearch(searchText);
}

/**
 * Input type for executeNavigateToSearch function.
 * @property {string} baseUrl - The application base URL to navigate to
 */
export type NavigateToSearchInput = {
  baseUrl: string;
};

/**
 * Output type for executeNavigateToSearch function.
 * All fields are descriptive strings for Allure report clarity.
 * @property {string} homePageStatus - Describes whether home page loaded successfully
 * @property {string} navigationStatus - Describes whether navigation to search page succeeded
 * @property {string} searchPageStatus - Describes whether search page elements are visible
 * @property {string} currentUrl - The current page URL after navigation
 */
export type NavigateToSearchOutput = {
  homePageStatus: string;
  navigationStatus: string;
  searchPageStatus: string;
  currentUrl: string;
};

/**
 * Navigates to the ViMovies home page, clicks the search icon,
 * and verifies successful navigation to the search page.
 * @author ViMovies Automation
 * @param {Page} page - Playwright page instance
 * @param {NavigateToSearchInput} input - Input containing the base URL
 * @returns {Promise<NavigateToSearchOutput>} Descriptive status of each validation step
 */
export async function executeNavigateToSearch(
  page: Page,
  input: NavigateToSearchInput,
): Promise<NavigateToSearchOutput> {
  const homePage = new HomePage(page);
  const searchPage = new SearchPage(page);

  // Step 1: Navigate to the app and verify home page loads
  await page.goto(input.baseUrl);
  const homePageVisible = await homePage.verifyHomePageLoaded();
  const homePageStatus = homePageVisible
    ? 'Home page loaded — header logo visible'
    : 'Home page FAILED to load — header logo not visible';

  // Step 2: Click search icon on home page
  await homePage.clickSearchIcon();

  // Step 3: Verify navigation to search page
  await page.waitForURL('**/search**', { timeout: 15000 });
  const currentUrl = page.url();
  const navigationStatus = currentUrl.includes('/search')
    ? `Navigated to search page — URL: ${currentUrl}`
    : `Navigation FAILED — URL still at: ${currentUrl}`;

  const searchInputVisible = await searchPage.verifySearchPageLoaded();
  const searchPageStatus = searchInputVisible
    ? 'Search page loaded — search input field visible'
    : 'Search page FAILED — search input field not visible';

  return {
    homePageStatus,
    navigationStatus,
    searchPageStatus,
    currentUrl,
  };
}
