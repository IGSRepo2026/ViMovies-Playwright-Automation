import { Locator, Page } from '@playwright/test';
import { SearchPage } from '@ViMovies/pageObjects/SearchPage';

export type SearchHistoryInput = {
  searchText: string;
};

export type SearchHistoryOutput = {
  searchPerformedStatus: string;
  historyVisibleStatus: string;
  historyContainsSearchStatus: string;
  autofillStatus: string;
  autofillValue: string;
};

/**
 * Returns the first visible locator from the provided search-result candidates.
 */
async function findVisibleSearchResult(
  page: Page,
  timeout = 20_000,
): Promise<Locator> {
  const candidates = page.locator(
    [
      // Stable portion of the previous CSS-module class
      '[class*="search_search_header"]',

      // Search-result cards containing content thumbnails
      'a:has(img[alt="display_image"])',
      '[role="link"]:has(img[alt="display_image"])',
      '[class*="card"]:has(img[alt="display_image"])',

      // Final fallback
      'img[alt="display_image"]',
    ].join(', '),
  );

  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    const count = await candidates.count();

    for (let index = 0; index < count; index++) {
      const candidate = candidates.nth(index);

      if (await candidate.isVisible().catch(() => false)) {
        return candidate;
      }
    }

    await page.waitForTimeout(500);
  }

  throw new Error(
    'No visible search-result card was found after entering the search text',
  );
}

/**
 * Performs a search, opens a result, returns to the Search page,
 * verifies search history, and validates history-item autofill.
 */
export async function executeSearchAndVerifyHistory(
  page: Page,
  input: SearchHistoryInput,
): Promise<SearchHistoryOutput> {
  const searchPage = new SearchPage(page);
  const normalizedSearchText = input.searchText.trim();

  if (!normalizedSearchText) {
    throw new Error('Search text must not be empty');
  }

  // Step 1: Enter and submit the search text
  await searchPage.enterSearchText(normalizedSearchText);

  const searchInput = page.getByPlaceholder(
    'Search channels, movies & TV shows',
  );

  await searchInput.press('Enter');

  // Step 2: Wait for and open the first visible search result
  const searchResultCard = await findVisibleSearchResult(page);

  await searchResultCard.scrollIntoViewIfNeeded();

  const searchPageUrl = page.url();

  await searchResultCard.click({
    timeout: 10_000,
  });

  await page.waitForURL(
    url => url.toString() !== searchPageUrl,
    { timeout: 20_000 },
  );

  const searchPerformedStatus =
    `Search performed — entered "${normalizedSearchText}", ` +
    `clicked result, navigated to: ${page.url()}`;

  // Step 3: Return to the Search page
  await page.goBack({
    waitUntil: 'domcontentloaded',
  });

  await page.waitForURL('**/search**', {
    timeout: 15_000,
  });

  await searchInput.waitFor({
    state: 'visible',
    timeout: 10_000,
  });

  // Clear the restored search query so Search History becomes visible
  await searchPage.clearSearchInput();

  // Step 4: Verify Search History is displayed
  const historyVisible = await searchPage.isSearchHistoryVisible();

  const historyVisibleStatus = historyVisible
    ? 'Search History section — displayed after searching content and returning back'
    : 'Search History section — NOT displayed after returning';

  // Step 5: Verify the searched term is present in history
  const historyItems = await searchPage.getSearchHistoryItems();

  const searchTermInHistory = historyItems.some(item =>
    item.toLowerCase().includes(normalizedSearchText.toLowerCase()),
  );

  const historyContainsSearchStatus = searchTermInHistory
    ? `Search history contains "${normalizedSearchText}" — items: [${historyItems.join(', ')}]`
    : `Search history does NOT contain "${normalizedSearchText}" — items: [${historyItems.join(', ')}]`;

  // Step 6: Click the corresponding history item and verify autofill
  const targetHistoryItem =
    historyItems.find(item =>
      item.toLowerCase().includes(normalizedSearchText.toLowerCase()),
    ) ?? historyItems[0];

  if (!targetHistoryItem) {
    return {
      searchPerformedStatus,
      historyVisibleStatus,
      historyContainsSearchStatus,
      autofillStatus:
        'Autofill could not be tested — no history item was available',
      autofillValue: '',
    };
  }

  await searchPage.clickSearchHistoryItem(targetHistoryItem);

  await page.waitForFunction(
    ({ placeholder, expectedValue }) => {
      const inputElement = document.querySelector<HTMLInputElement>(
        `input[placeholder="${placeholder}"]`,
      );

      return inputElement?.value
        .toLowerCase()
        .includes(expectedValue.toLowerCase());
    },
    {
      placeholder: 'Search channels, movies & TV shows',
      expectedValue: normalizedSearchText,
    },
    {
      timeout: 10_000,
    },
  );

  const autofillValue =
    (await searchPage.getSearchInputValue()) || '';

  const autofillStatus = autofillValue
    .toLowerCase()
    .includes(normalizedSearchText.toLowerCase())
    ? `Search text box autofilled — value: "${autofillValue}" after tapping "${targetHistoryItem}"`
    : `Search text box NOT autofilled correctly — value: "${autofillValue}" after tapping "${targetHistoryItem}"`;

  return {
    searchPerformedStatus,
    historyVisibleStatus,
    historyContainsSearchStatus,
    autofillStatus,
    autofillValue,
  };
}