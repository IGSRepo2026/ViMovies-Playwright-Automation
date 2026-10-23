import { expect, Locator, Page } from '@playwright/test';
import { UICommands } from '@utils/CommonActions';

export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  private searchIconHeader: Locator;
  private headerLogo: Locator;
  private exploreByAppsRail: Locator;
  private exploreByLanguageRail: Locator;
  private exploreByGenresRail: Locator;
  private mostSearchedContentRail: Locator;
  private topFilmsSearchedRail: Locator;
  private trendingShowsRail: Locator;
  private searchResults: Locator;
  private searchResultCards: Locator;
  readonly searchFilters: Locator;
  readonly noSearchResultsMessage: Locator;
  private filterTabs: Locator;
  private searchResultCount: Locator;
  private resultThumbnail: Locator;
  private partnerLogo: Locator;
  private resultTitle: Locator;
  private resultMetadata: Locator;
  private searchResult: Locator;
  private searchHistorySection: Locator;
  private searchHistoryItems: Locator;
  private clearHistoryCta: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search channels, movies & TV shows');
    this.noSearchResultsMessage = page
      .getByText(/no search results found/i)
      .first();
    this.searchIconHeader = page.locator('a').filter({ hasText: 'SEARCH' });
    this.headerLogo = page.getByAltText('header_logo').first();
    this.exploreByAppsRail = page.getByRole('heading', { name: 'Explore by Apps' });
    this.exploreByLanguageRail = page.getByRole('heading', { name: 'Explore by Language' });
    this.exploreByGenresRail = page.getByRole('heading', { name: 'Explore by Genres' });
    this.mostSearchedContentRail = page.getByRole('heading', { name: 'Most Searched Content' });
    this.topFilmsSearchedRail = page.getByRole('heading', { name: 'Top Films Searched' });
    this.trendingShowsRail = page.getByRole('heading', { name: 'Trending Shows' });
    this.searchResults = page.locator('[class*="search_results"]');
    this.searchResultCards = this.searchResults.locator(
      'div[class*="search_header"]'
    );
    this.searchFilters = page.locator('li:visible').filter({
      hasText: /^(All|Movies|TV Shows|Live|Videos)$/i,
    });
    this.filterTabs = this.searchFilters;
    this.resultThumbnail = page.locator('[class*="search_header"] img[alt="display_image"]');
    this.partnerLogo = page.locator('.search_partner_logo');
    this.resultTitle = page.locator('[class*="card_data"] h3');
    this.resultMetadata = page.locator('[class*="card_data"] h5');
    this.searchResultCount = page.locator('h4[class*="search_count"]');
    this.searchResult = page.locator('[class*="search_header"]').first();
    this.searchHistorySection = page.getByText('Search History', { exact: true }).first();
    this.searchHistoryItems = this.searchHistorySection.locator('xpath=following::ul[1]/li');
    this.clearHistoryCta = page.getByText('Clear History', { exact: true }).first();
  }

  async verifySearchPageLoaded(): Promise<boolean> {
    await UICommands.genericWaitForVisible(this.page, this.searchInput, 15000, 'Search input visible');
    return await UICommands.genericIsVisible(this.page, this.searchInput, 'Search input field');
  }

  async isHeaderLogoVisible(): Promise<boolean> {
    return await UICommands.genericIsVisible(this.page, this.headerLogo, 'Vi MTV Logo with top banner');
  }

  async isSearchInputVisible(): Promise<boolean> {
    return await UICommands.genericIsVisible(this.page, this.searchInput, 'Search text box with placeholder');
  }

  async focusSearchInput(): Promise<void> {
    await this.searchInput.click();
    await expect(
      this.searchInput,
      'Search input should be focused',
    ).toBeFocused();
  }

  async verifySearchInputValue(searchText: string): Promise<void> {
    await expect(
      this.searchInput,
      `Search input should contain "${searchText}"`,
    ).toHaveValue(searchText);
  }

  async submitSearch(): Promise<void> {
    await this.searchInput.press('Enter');
  }

  async enterAndSubmitSearch(searchText: string): Promise<void> {
    if (!searchText.trim()) {
      throw new Error('Search text cannot be empty');
    }

    await this.focusSearchInput();
    await this.enterSearchText(searchText);
    await this.verifySearchInputValue(searchText);
    await this.submitSearch();
  }

  async verifySearchInputState(): Promise<void> {
    await expect(
      this.searchInput,
      'Search input should be visible',
    ).toBeVisible();

    await expect(
      this.searchInput,
      'Search input should be enabled',
    ).toBeEnabled();
  }

  async verifySearchInputReady(): Promise<void> {
    await expect(
      this.searchInput,
      'Search field should be visible and enabled'
    ).toBeVisible({ timeout: 15000 });
    await expect(
      this.searchInput,
      'Search field should be enabled'
    ).toBeEnabled();
  }

  async enterSearchPrefix(prefix: string): Promise<void> {
    await this.searchInput.fill(prefix);
    await expect(
      this.searchInput,
      `Search field should contain "${prefix}"`
    ).toHaveValue(prefix);
  }
  async pressEnterToSearch(): Promise<void> {
  await expect(
    this.searchInput,
    'Search input should be focused before pressing Enter'
  ).toBeFocused();

  await this.searchInput.press('Enter');
}

  async verifySearchResultsNotDisplayed(): Promise<void> {
    await expect
      .poll(() => this.getVisibleSearchResultTexts().then((texts) => texts.length), {
        message: 'Search results should not be displayed after one character',
        timeout: 5000,
        intervals: [100, 250, 500],
      })
      .toBe(0);
  }

  async verifySearchResultsDisplayedForQuery(query: string): Promise<void> {
    await expect
      .poll(() => this.getVisibleSearchResultTexts().then((texts) => texts.length), {
        message: `Search results should be displayed for "${query}"`,
        timeout: 15000,
        intervals: [250, 500, 1000],
      })
      .toBeGreaterThan(0);

    await this.verifySearchResultsContainQuery(query);
  }

  async isExploreByAppsVisible(): Promise<boolean> {
    await UICommands.genericScrollIntoView(this.page, this.exploreByAppsRail, false, 'Scroll to Explore by Apps rail');
    return await UICommands.genericIsVisible(this.page, this.exploreByAppsRail, 'Explore by Apps rail');
  }

  async isExploreByLanguageVisible(): Promise<boolean> {
    await UICommands.genericScrollIntoView(this.page, this.exploreByLanguageRail, false, 'Scroll to Explore by Language rail');
    return await UICommands.genericIsVisible(this.page, this.exploreByLanguageRail, 'Explore by Language rail');
  }

  async isExploreByGenresVisible(): Promise<boolean> {
    await UICommands.genericScrollIntoView(this.page, this.exploreByGenresRail, false, 'Scroll to Explore by Genres rail');
    return await UICommands.genericIsVisible(this.page, this.exploreByGenresRail, 'Explore by Genres rail');
  }

  async getVisibleContentRails(): Promise<string[]> {
    const rails: string[] = [];
    await UICommands.genericScrollIntoView(this.page, this.mostSearchedContentRail, false, 'Scroll to Most Searched Content rail');
    if (await UICommands.genericIsVisible(this.page, this.mostSearchedContentRail, 'Most Searched Content rail')) rails.push('Most Searched Content');
    await UICommands.genericScrollIntoView(this.page, this.topFilmsSearchedRail, false, 'Scroll to Top Films Searched rail');
    if (await UICommands.genericIsVisible(this.page, this.topFilmsSearchedRail, 'Top Films Searched rail')) rails.push('Top Films Searched');
    await UICommands.genericScrollIntoView(this.page, this.trendingShowsRail, false, 'Scroll to Trending Shows rail');
    if (await UICommands.genericIsVisible(this.page, this.trendingShowsRail, 'Trending Shows rail')) rails.push('Trending Shows');
    return rails;
  }

  async clickSearchIcon(): Promise<void> {
    await UICommands.genericClick(this.page, this.searchIconHeader, false, 'Click Search icon');
  }

  async enterSearchText(text: string): Promise<void> {
    await UICommands.genericTypeSequentially(this.page, this.searchInput, text, 100, 'Enter search text');
  }

  async verifySearchResultsLoaded(query: string): Promise<void> {
    await expect
      .poll(
        async () => (await this.getVisibleSearchResultTexts()).length,
        {
          message: `No search results loaded for "${query}"`,
          timeout: 15000,
          intervals: [250, 500, 1000],
        },
      )
      .toBeGreaterThan(0);
  }

  async selectSearchResultByTitle(title: string): Promise<void> {
    const resultCard = this.searchResultCards.filter({
      has: this.page.locator('h3').filter({
        hasText: new RegExp(`^\\s*${this.escapeRegExp(title)}\\s*$`, 'i'),
      }),
    }).first();

    await expect(
      resultCard,
      `Search result matching "${title}" was not displayed`,
    ).toBeVisible({ timeout: 15000 });

    await resultCard.click();
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  createInvalidSearchValue(): string {
    return `invalid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}_@#$`;
  }

  async searchInvalidValue(value: string): Promise<void> {
    await expect(this.searchInput, 'Search field should be visible for invalid search').toBeVisible();
    await expect(this.searchInput, 'Search field should be enabled for invalid search').toBeEnabled();
    await this.searchInput.fill(value);
    await expect(this.searchInput, `Invalid search value was not entered: ${value}`).toHaveValue(value);
  }

  async verifyInvalidSearchResponse(value: string): Promise<void> {
    const message = await this.waitForNoResultsMessage();
    await this.verifyNoResultsMessageMatchesSearch(value, message);
    await this.verifyNoSearchResultsDisplayed();
  }

  async verifyNoSearchResultsFound(): Promise<void> {
    await expect(
      this.noSearchResultsMessage,
      'No search results found message should be displayed',
    ).toBeVisible({ timeout: 20_000 });
  }

  async verifyNumericSearchOutcome(query: string): Promise<void> {
    const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');

    await expect
      .poll(
        async () => {
          const resultCount = (await this.getVisibleSearchResultTexts()).length;
          const noResultsVisible = await this.noSearchResultsMessage
            .isVisible()
            .catch(() => false);

          return resultCount > 0 || noResultsVisible;
        },
        {
          message: `Search response did not produce results or a no-results message for "${query}"`,
          timeout: 20_000,
          intervals: [250, 500, 1000],
        },
      )
      .toBe(true);

    const resultTexts = await this.getVisibleSearchResultTexts();

    if (resultTexts.length > 0) {
      expect(
        resultTexts.length,
        `At least one search-result card should be visible for "${query}"`,
      ).toBeGreaterThan(0);

      const hasRelevantResult = resultTexts.some((text) =>
        text.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normalizedQuery),
      );

      expect(
        hasRelevantResult,
        `At least one search result should be relevant to numeric query "${query}"`,
      ).toBe(true);
      return;
    }

    await this.verifyNoSearchResultsFound();
  }

  async getSearchInputValue(): Promise<string | null> {
    return await UICommands.genericGetValue(this.page, this.searchInput, 'Get search input value');
  }

  async searchContent(content: string): Promise<void> {
    await this.searchInput.fill(content);
    await expect(this.searchResultCount).toBeVisible({ timeout: 15000 });
  }

  async clickOnSearchResult(): Promise<void> {
    await expect(this.searchResult).toBeVisible({ timeout: 10000 });
    await this.searchResult.click();
  }

  async searchAndOpenContent(content: string): Promise<void> {
    await this.clickSearchIcon();
    await this.verifySearchPageLoaded();
    await this.searchContent(content);
    await this.clickOnSearchResult();
  }


    
  async getFilterOptions(): Promise<string[]> {
  const expectedOrder = ['All', 'Movies', 'TV Shows', 'Live', 'Videos'];

  await expect
    .poll(
      async () => {
        const visibleFilters = this.page.locator('li:visible');
        let count = 0;

        for (const filterName of expectedOrder) {
          const filter = visibleFilters.filter({
            hasText: new RegExp(`^${filterName}$`, 'i'),
          });

          if ((await filter.count()) > 0) {
            count++;
          }
        }

        return count;
      },
      {
        message: 'All search filters did not render',
        timeout: 20_000,
        intervals: [250, 500, 1000],
      },
    )
    .toBe(expectedOrder.length);

  const visibleFilters = this.page.locator('li:visible');
  const actualFilters: string[] = [];

  for (const filterName of expectedOrder) {
    const filter = visibleFilters.filter({
      hasText: new RegExp(`^${filterName}$`, 'i'),
    });

    if ((await filter.count()) > 0) {
      actualFilters.push(filterName);
    }
  }

  return actualFilters;
}

  async verifySearchFiltersDisplayed(): Promise<void> {
    const expectedFilters = ['Live', 'Videos', 'TV Shows', 'Movies', 'All'];
    const visibleFilterItems = this.page.locator('li:visible');

    await expect(
      visibleFilterItems.first(),
      'Search filter tabs are not displayed',
    ).toBeVisible({ timeout: 15000 });

    for (const filterName of expectedFilters) {
      const filter = visibleFilterItems.filter({ hasText: filterName }).first();

      await expect(
        filter,
        `Search filter tab is not displayed: ${filterName}`,
      ).toBeVisible();
      await expect(
        filter,
        `Search filter tab text is incorrect: ${filterName}`,
      ).toHaveText(filterName);
    }

  }

  async verifyFilterOptionsVisibleAndEnabled(): Promise<string[]> {
    const filterNames = await this.getFilterOptions();
    expect(filterNames, 'No search filters were rendered').not.toHaveLength(0);

    for (const filterName of filterNames) {
      const filter = this.filterTabs.filter({ hasText: filterName }).first();
      await expect(filter, `Search filter is not visible: ${filterName}`).toBeVisible();
      await expect(filter, `Search filter is not enabled: ${filterName}`).toBeEnabled();
    }

    return filterNames;
  }

  async selectFilter(filterName: string): Promise<void> {
    const filter = this.filterTabs.filter({ hasText: filterName }).first();
    await expect(filter, `Search filter was not found: ${filterName}`).toBeVisible();
    await expect(filter, `Search filter is disabled: ${filterName}`).toBeEnabled();
    await filter.click();
  }

  async verifyFilterSelected(filterName: string): Promise<void> {
    const filter = this.filterTabs.filter({ hasText: filterName }).first();
    await expect
      .poll(
        async () => await filter.evaluate((element) => {
          const state = element.getAttribute('aria-selected') || element.getAttribute('data-state');
          return state === 'true' || state === 'active' || /active|selected/i.test(element.className);
        }),
        { message: `Search filter was not marked active: ${filterName}`, timeout: 10000 },
      )
      .toBe(true);
  }

  async getDisplayedResultState(): Promise<{ results: string[]; noResults: boolean }> {
    const results = await this.getVisibleSearchResultTexts();
    const hasEmptyStateMessage = await this.page
      .getByText(/no results? found|no matching results/i)
      .filter({ visible: true })
      .count()
      .then((count) => count > 0)
      .catch(() => false);
    const noResults = hasEmptyStateMessage || (results.length === 0 && (await this.filterTabs.count()) > 0);

    return { results, noResults };
  }

  async waitForNoResultsMessage(): Promise<string> {
    const noResultsMessage = this.page
      .getByText('No search results found', { exact: true })
      .filter({ visible: true })
      .first();

    await expect(
      noResultsMessage,
      'Expected the exact message "No search results found" for the invalid search',
    ).toBeVisible({ timeout: 15000 });

    const message = (await noResultsMessage.textContent())?.trim() ?? '';
    expect(message, 'The no-results message is empty').toBe('No search results found');
    return message;
  }

  async verifyNoSearchResultsDisplayed(): Promise<void> {
    await expect
      .poll(
        async () => await this.page.getByAltText('display_image').filter({ visible: true }).count(),
        {
          message: 'Search-result cards are still displayed for the invalid search',
          timeout: 15000,
          intervals: [250, 500, 1000],
        },
      )
      .toBe(0);
  }

  async verifyNoResultsMessageMatchesSearch(searchText: string, message: string): Promise<void> {
    expect(
      message,
      `Unexpected no-results message for invalid search: ${searchText}`,
    ).toBe('No search results found');
    await expect(
      this.searchInput,
      `Search field no longer contains the invalid value: ${searchText}`,
    ).toHaveValue(searchText);
  }

  async waitForResultsToSettle(): Promise<void> {
    await expect(this.filterTabs.first(), 'Search filters did not render').toBeVisible({ timeout: 15000 });
    let previousState = '';
    let stableReads = 0;

    await expect
      .poll(
        async () => {
          const state = await this.getDisplayedResultState();
          const signature = JSON.stringify(state);
          stableReads = signature === previousState ? stableReads + 1 : 0;
          previousState = signature;
          return stableReads;
        },
        {
          message: 'Search results did not settle after applying the filter',
          timeout: 15000,
          intervals: [250, 500, 1000],
        },
      )
      .toBeGreaterThan(1);
  }

  async verifyResultsOrNoResults(): Promise<void> {
    const state = await this.getDisplayedResultState();
    expect(
      state.results.length > 0 || state.noResults,
      'Filtered search state contains neither result cards nor a valid "No results found" message',
    ).toBe(true);
  }

  async verifyNoApplicationError(): Promise<void> {
    const errorMessage = this.page
      .getByText(/application error|something went wrong|internal server error|unable to load/i)
      .filter({ visible: true });
    await expect(errorMessage, 'An application error is visible after applying a search filter').toHaveCount(0);
  }

  async clearSelectedFilters(): Promise<void> {
    const filterNames = await this.getFilterOptions();
    for (const filterName of filterNames) {
      const filter = this.filterTabs.filter({ hasText: filterName }).first();
      const selected = await filter.evaluate((element) => {
        const state = element.getAttribute('aria-selected') || element.getAttribute('data-state');
        return state === 'true' || state === 'active' || /active|selected/i.test(element.className);
      });

      if (selected) await filter.click();
    }
  }

  async getSearchResultsCount(): Promise<number> {
    const text = await this.searchResultCount.textContent();
    const match = text?.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  async verifySearchCardFields(): Promise<boolean> {
    const count = await this.searchResultCards.count();

    if (count === 0) {
      console.log('No search result cards found');
      return false;
    }

    for (let index = 0; index < count; index++) {
      const card = this.searchResultCards.nth(index);
      const hasThumbnail =
        (await card.locator('img[alt="display_image"]').count()) > 0;
      const hasTitle = (await card.locator('h3').count()) > 0;

      if (!hasThumbnail || !hasTitle) {
        console.log(
          `Card ${index + 1}: thumbnail=${hasThumbnail}, title=${hasTitle}`,
        );
        return false;
      }
    }

    return true;
  }

  async verifyResultsMatchQuery(query: string): Promise<boolean> {
    const texts = await this.getVisibleSearchResultTexts();
    const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    return texts.some((text) => text.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normalizedQuery));
  }

  async verifySearchResultsAlignment(): Promise<boolean> {
    const count = await this.searchResultCards.count();
    if (count === 0) return false;
    for (let index = 0; index < count; index++) {
      const box = await this.searchResultCards.nth(index).boundingBox();
      if (!box || box.width <= 0 || box.height <= 0) return false;
    }
    const containerBox = await this.searchResults.boundingBox();
    return Boolean(containerBox && containerBox.width > 0 && containerBox.height > 0);
  }

  async verifySearchResultsContainQuery(query: string): Promise<string[]> {
    const resultTexts = await this.getVisibleSearchResultTexts();
    if (resultTexts.length === 0) throw new Error(`No search results were found for query: ${query}`);
    const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    const relevant = resultTexts.filter((text) => text.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normalizedQuery));
    if (relevant.length === 0) throw new Error(`No search results matched query: ${query}`);
    return resultTexts;
  }

  async getVisibleSearchResultTexts(): Promise<string[]> {
    const resultTexts: string[] = [];
    const count = await this.searchResultCards.count();
    for (let index = 0; index < count; index++) {
      const card = this.searchResultCards.nth(index);
      if (await card.isVisible()) {
        const text = await card.textContent();
        if (text?.trim()) resultTexts.push(text.trim());
      }
    }
    return resultTexts;
  }

  async isSearchHistoryVisible(): Promise<boolean> {
    return await this.searchHistorySection.isVisible().catch(() => false);
  }

  async getSearchHistoryItems(): Promise<string[]> {
    const values: string[] = [];
    const count = await this.searchHistoryItems.count();
    for (let index = 0; index < count; index++) {
      const text = await this.searchHistoryItems.nth(index).textContent();
      if (text) values.push(text.trim());
    }
    return values;
  }

  async getSearchHistoryItemCount(): Promise<number> {
    return await this.searchHistoryItems.count();
  }

  async ensureSearchHistoryItem(searchText: string): Promise<void> {
    if (await this.getSearchHistoryItemCount() > 0) return;

    await this.enterAndSubmitSearch(searchText);
    await this.clickOnSearchResult();
    await this.page.waitForURL(url => !url.pathname.includes('/search'), {
      timeout: 15_000,
    });
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
    await this.page.waitForURL('**/search**', { timeout: 15_000 });
    await this.verifySearchPageLoaded();
    await this.clearSearchInput();
    await expect
      .poll(() => this.getSearchHistoryItemCount(), {
        message: `Search history should contain an item after searching for "${searchText}"`,
        timeout: 15_000,
        intervals: [250, 500, 1000],
      })
      .toBeGreaterThan(0);
  }

  async isClearHistoryVisible(): Promise<boolean> {
    return await this.clearHistoryCta.isVisible().catch(() => false);
  }

  async clickClearHistory(): Promise<void> {
    await expect(
      this.clearHistoryCta,
      'Clear History CTA should be visible when search history contains items',
    ).toBeVisible();
    await this.clearHistoryCta.click();
  }

  async waitForSearchHistoryToBeEmpty(): Promise<void> {
    await expect
      .poll(() => this.getSearchHistoryItemCount(), {
        message: 'Search history items should be removed after clicking Clear History',
        timeout: 10_000,
        intervals: [100, 250, 500],
      })
      .toBe(0);
  }

  async isSearchHistoryEmptyOrHidden(): Promise<boolean> {
    const itemCount = await this.getSearchHistoryItemCount();
    return itemCount === 0 || !(await this.isSearchHistoryVisible());
  }

  async clickSearchHistoryItem(historyText: string): Promise<void> {
    await UICommands.genericClick(this.page, this.searchHistoryItems.filter({ hasText: historyText }), false, `Click search history item: ${historyText}`);
  }

  async clearSearchInput(): Promise<void> {
    await this.searchInput.fill('');
  }
}
