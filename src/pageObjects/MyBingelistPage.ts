import { expect, type Locator, type Page } from '@playwright/test';

export class BingeListPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly bingeListIcon: Locator;
  readonly addTitleHeading: Locator;
  readonly createNewBingeListButton: Locator;
  readonly listNameInput: Locator;
  readonly addButton: Locator;
  readonly removeTitleHeading: Locator;
  readonly myBingeListButton: Locator;
  readonly addedToBingeListButton: Locator;
  readonly selectedBingeLists: Locator;
  readonly doneButton: Locator;
    readonly bingeListPopupHeading: Locator;
    readonly firstBingeListItem: Locator;
    readonly firstContentThumbnail: Locator;
    readonly bingeListWatchNowButton: Locator;
    readonly selectedBingeListContentCards: Locator;
    private readonly bingeListedContentCards: Locator;
    private readonly bingeListContentCounts: Locator;




  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page
      .getByRole('heading', { name: /binge\s*list/i })
      .first();

    this.bingeListIcon = page
      .getByRole('button', {
        name: /binge\s*list|add to binge\s*list/i,
      })
      .or(
        page.locator(
          '[aria-label*="binge" i], [title*="binge" i]'
        )
      )
      .first();

     this.firstContentThumbnail = page
    .locator('div[class*="movie_card"]')
    .filter({
      has: page.locator('div[class*="image_section"] img'),
    })
    .first();  

    this.selectedBingeListContentCards = page
      .locator('div[class*="movie_card"]:visible')
      .filter({ has: page.locator('div[class*="image_section"] img') });
    this.bingeListedContentCards = page.locator(
      '[class*="bingelist"][class*="movie_card"]',
    );
    this.bingeListContentCounts = page
      .locator('p:visible')
      .filter({ hasText: /\b[1-9]\d* Titles?\b/ });

    this.addTitleHeading = page
      .getByRole('heading', {
        name: /^add this title to bingelist$/i,
      })
      .first();

    this.bingeListWatchNowButton = page
  .getByRole('button', {
    name: /^(Watch Now|Start Over|Resume|Play)$/i,
  })
  .or(
    page.getByRole('link', {
      name: /^(Watch Now|Start Over|Resume|Play)$/i,
    })
  )
  .filter({ visible: true })
  .first();  
    
    this.firstBingeListItem = page
    .locator('div[class*="list_item"]')
    .filter({
      has: page.getByRole('img', { name: 'rightArrow' }),
    })
    .first();  

    this.createNewBingeListButton = page.getByRole('button', {
      name: /^create new bingelist$/i,
    });

    this.listNameInput = page.getByPlaceholder('List Name');

    this.addButton = page
      .getByRole('button', { name: /^add$/i })
      .first();

   this.myBingeListButton = page
  .locator(
    [
      'img[alt="favrorite_icon"][src*="banner_added_to_watchlist-icon.svg"]:visible',
      'img[alt="like_icon"][src*="binglist_mobile.svg"]:visible',
    ].join(', ')
  )
  .locator('..')
  .filter({
    hasText: 'My Bingelist',
  });

    this.addedToBingeListButton = page
      .locator('div')
      .filter({
        has: page.locator(
          'img[alt="favrorite_icon"], img[src*="banner_added_to_watchlist-icon.svg"]'
        ),
      })
      .filter({
        has: page.getByText('My Bingelist', { exact: true }),
      })
      .first();

    this.addTitleHeading = page.getByText('Add Title', {
      exact: true,
    });

    this.removeTitleHeading = page.getByText('Remove Title', {
      exact: true,
    });

    this.selectedBingeLists = page
      .locator('div[class*="select_content"]')
      .filter({
        has: page.locator(
          'div[class*="selection"][class*="selected"]'
        ),
      });

    this.doneButton = page.getByRole('button', {
      name: 'Done',
      exact: true,
    });

    this.addTitleHeading = page.getByRole('heading', {
  name: 'Add this title to Bingelist',
  exact: true,
});

this.removeTitleHeading = page.getByRole('heading', {
  name: 'Remove Title',
  exact: true,
});

this.bingeListPopupHeading = page.getByRole('heading', {
  name: /^(Add this title to Bingelist|Remove Title)$/i,
});
  }

  private generateUniqueBingeListName(): string {
    const sixDigitNumber = Date.now()
      .toString()
      .slice(-6);

    return `AutoBL${sixDigitNumber}`;
  }

  async clickBingeListIcon(): Promise<void> {
    await expect(
      this.bingeListIcon,
      'BingeList icon should be visible on the detail screen'
    ).toBeVisible({ timeout: 15000 });

    await this.bingeListIcon.click();
  }

  async clickBingeListWatchNowButton(): Promise<void> {
  await expect(
    this.bingeListWatchNowButton,
    'A visible Watch Now, Start Over, Resume, or Play control should appear'
  ).toBeVisible({ timeout: 30_000 });

  await expect(
    this.bingeListWatchNowButton,
    'The BingeList playback control should be enabled'
  ).toBeEnabled();

  await this.bingeListWatchNowButton.click();
}

 async createNewBingeList(): Promise<string> {
  const bingeListName = this.generateUniqueBingeListName();

  expect(
    bingeListName.length,
    'BingeList name must not exceed 12 characters'
  ).toBeLessThanOrEqual(12);

  expect(
    bingeListName,
    'BingeList name should contain at least one number'
  ).toMatch(/\d/);

  console.log(`Generated BingeList name: "${bingeListName}"`);

  const addPopupAlreadyOpen = await this.addTitleHeading
    .isVisible()
    .catch(() => false);

  if (!addPopupAlreadyOpen) {
    await this.myBingeListButton.click();

    await expect(
      this.addTitleHeading,
      'Add this title to Bingelist popup should appear'
    ).toBeVisible({ timeout: 15000 });
  }

  const visibleCreateButton = this.page.getByRole('button', {
    name: 'Create New Bingelist',
    exact: true,
  }).filter({
    visible: true,
  });

  await expect(
    visibleCreateButton,
    'Create New Bingelist button should be visible'
  ).toBeVisible({ timeout: 10000 });

  await expect(
    visibleCreateButton,
    'Create New Bingelist button should be enabled'
  ).toBeEnabled();

  /*
   * The button is detached immediately when clicked.
   * dispatchEvent prevents Playwright from retrying the completed click.
   */
  await visibleCreateButton.dispatchEvent('click');

  await expect(
    this.listNameInput,
    'List Name input should appear after clicking Create New Bingelist'
  ).toBeVisible({ timeout: 15000 });

  await this.listNameInput.fill(bingeListName);

  await expect(
    this.listNameInput,
    'Generated BingeList name should be entered correctly'
  ).toHaveValue(bingeListName);

  console.log(`Entered BingeList name: "${bingeListName}"`);

  await expect(
    this.addButton,
    'Add button should be visible'
  ).toBeVisible({ timeout: 10000 });

  await expect(
    this.addButton,
    'Add button should be enabled'
  ).toBeEnabled();

  await this.addButton.click();

  await expect(
    this.listNameInput,
    'Create BingeList form should close after clicking Add'
  ).toBeHidden({ timeout: 15000 });

  console.log(
    `Created BingeList successfully: "${bingeListName}"`
  );

  return bingeListName;
}
  async verifyContentAddedToCreatedBingeList(
    bingeListName: string
  ): Promise<void> {
    await this.clickBingeListIcon();

    await expect(
      this.removeTitleHeading,
      '"Remove Title" popup should appear after reopening BingeList'
    ).toBeVisible({ timeout: 10000 });

    const createdListName = this.page
      .getByText(bingeListName, { exact: true })
      .first();

    await expect(
      createdListName,
      `The created BingeList name "${bingeListName}" should be displayed`
    ).toBeVisible({ timeout: 10000 });
  }

  async createAndVerifyNewBingeList(): Promise<string> {
    const bingeListName = await this.createNewBingeList();

    await this.verifyContentAddedToCreatedBingeList(
      bingeListName
    );

    return bingeListName;
  }

  async verifyBingeListPageLoaded(): Promise<void> {
    await expect(
      this.pageTitle,
      'BingeList page should be displayed'
    ).toBeVisible({ timeout: 20000 });
  }

  async verifyContentIsDisplayed(): Promise<void> {
    await expect(
      this.bingeListedContentCards.first(),
      'At least one content card should be displayed inside the selected BingeList',
    ).toBeVisible({ timeout: 20_000 });

    const contentCount = await this.bingeListedContentCards.count();

    expect(
      contentCount,
      'The selected BingeList should contain at least one content',
    ).toBeGreaterThan(0);
  }

  async verifyBingeListContentIsDisplayed(): Promise<void> {
    await expect
      .poll(() => this.bingeListContentCounts.count(), {
        message: 'At least one BingeList should show saved titles',
        timeout: 30_000,
        intervals: [250, 500, 1000],
      })
      .toBeGreaterThan(0);
  }

  async openBingeListByName(bingeListName: string): Promise<void> {
    const normalizedName = bingeListName.replace(/\s+/g, ' ').trim();
    if (!normalizedName) {
      throw new Error('BingeList name must not be empty');
    }

    const listHeading = this.page
      .getByRole('heading', { level: 4, name: normalizedName, exact: true })
      .first();

    await expect(
      listHeading,
      `BingeList "${normalizedName}" should be available before opening it`,
    ).toBeVisible({ timeout: 20_000 });

    await listHeading.locator('..').click();

    await expect
      .poll(() => this.selectedBingeListContentCards.count(), {
        message: `BingeList "${normalizedName}" should finish loading its content cards`,
        timeout: 20_000,
        intervals: [250, 500, 1000],
      })
      .toBeGreaterThan(0);
  }

  async expectContentVisibleInSelectedBingeList(contentTitle: string): Promise<void> {
    const normalizedTitle = contentTitle.replace(/\s+/g, ' ').trim();
    if (!normalizedTitle) {
      throw new Error('BingeList content title must not be empty');
    }

    const contentCard = this.selectedBingeListContentCards
      .filter({ hasText: normalizedTitle })
      .first();

    await expect(
      contentCard,
      `Selected BingeList should contain the content card "${normalizedTitle}"`,
    ).toBeVisible({ timeout: 20_000 });
  }

  async openPlayableContent(contentTitle?: string): Promise<string> {
    const normalizedTitle = contentTitle?.replace(/\s+/g, ' ').trim();

    const listHeadings = await this.page
      .getByRole('heading', { level: 4 })
      .all();

    for (const listHeading of listHeadings) {
      const listRow = listHeading.locator('..');
      const listSummary = await listRow.textContent().catch(() => '');

      if (!/\b[1-9]\d*\s+Titles?\b/i.test(listSummary ?? '')) {
        continue;
      }

      await listRow.click();

      const configuredContent = normalizedTitle
        ? this.page.getByText(normalizedTitle, { exact: true }).first()
        : undefined;

      if (
        configuredContent &&
        (await configuredContent.isVisible().catch(() => false))
      ) {
        await configuredContent.click();
        return normalizedTitle!;
      }

      const fallbackContent = this.page
        .locator(
          '.carousel-image:visible, img[alt="display_image"]:visible, img[alt*="content" i]:visible, img[alt*="poster" i]:visible, img[alt*="thumbnail" i]:visible'
        )
        .first();

      if (await fallbackContent.isVisible().catch(() => false)) {
        const fallbackTitle = (
          await fallbackContent
            .locator('..')
            .textContent()
            .catch(() => '')
        )?.replace(/\s+/g, ' ').trim();

        await fallbackContent.click();
        return fallbackTitle || 'first available BingeList content';
      }

      await this.page.goBack({ waitUntil: 'domcontentloaded' });
      await expect(
        this.page.getByRole('heading', { name: 'Bingelists', exact: true }),
        'BingeList overview should be restored before checking the next list'
      ).toBeVisible({ timeout: 10000 });
    }

    throw new Error(
      normalizedTitle
        ? `Configured BingeList content "${normalizedTitle}" was not found in any non-empty list`
        : 'No playable content was found in the non-empty BingeLists'
    );
  }

  async verifyContentVisible(contentTitle: string): Promise<void> {
    const normalizedTitle = contentTitle
      .replace(/\s+/g, ' ')
      .trim();

    const escapedTitle = normalizedTitle.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    const titlePattern = new RegExp(escapedTitle, 'i');

    const content = this.page
      .getByText(titlePattern)
      .or(this.page.getByAltText(titlePattern))
      .first();

    await expect(
      content,
      `BingeList should contain "${normalizedTitle}"`
    ).toBeVisible({ timeout: 20000 });
  }

  async removeContentIfAlreadyAdded(): Promise<void> {
  await expect(
    this.myBingeListButton,
    'A visible My Bingelist button should be displayed on the detail screen'
  ).toBeVisible({ timeout: 15000 });

  await this.myBingeListButton.click();

  await expect
    .poll(
      async () => {
        const addPopupVisible = await this.addTitleHeading
          .isVisible()
          .catch(() => false);

        const removePopupVisible = await this.removeTitleHeading
          .isVisible()
          .catch(() => false);

        return addPopupVisible || removePopupVisible;
      },
      {
        message:
          'Add this title to Bingelist or Remove Title popup should appear',
        timeout: 15000,
      }
    )
    .toBe(true);

  const removePopupVisible = await this.removeTitleHeading
    .isVisible()
    .catch(() => false);

  /*
   * The Add popup means the content is not currently added.
   * Keep this popup open so createNewBingeList() can use it.
   */
  if (!removePopupVisible) {
    await expect(
      this.addTitleHeading,
      'Add this title to Bingelist popup should be visible'
    ).toBeVisible();

    await expect(
      this.createNewBingeListButton,
      'Create New Bingelist button should be visible'
    ).toBeVisible({ timeout: 10000 });

    console.log(
      'Content is not currently added. Keeping the Add BingeList popup open.'
    );

    return;
  }

  /*
   * The Remove Title popup means that the content is
   * already present in one or more BingeLists.
   */
  console.log(
    'Content is already added. Removing it before running the add flow.'
  );

  await expect(
    this.removeTitleHeading,
    'Remove Title popup should be visible'
  ).toBeVisible();

  await expect(
    this.selectedBingeLists.first(),
    'At least one selected BingeList should be displayed'
  ).toBeVisible({ timeout: 10000 });

  /*
   * Keep clicking the first selected list until no selected
   * BingeLists remain.
   */
  while ((await this.selectedBingeLists.count()) > 0) {
    const selectedList = this.selectedBingeLists.first();

    const listName = (
      await selectedList.locator('h5').textContent()
    )?.trim();

    await selectedList.click();

    console.log(
      `Removed content from BingeList: ${listName || 'Unnamed list'}`
    );
  }

  await expect(
    this.selectedBingeLists,
    'No BingeList should remain selected'
  ).toHaveCount(0);

  await expect(
    this.doneButton,
    'Done button should be visible'
  ).toBeVisible({ timeout: 10000 });

  await expect(
    this.doneButton,
    'Done button should be enabled'
  ).toBeEnabled();

  await this.doneButton.click();

  await expect(
    this.removeTitleHeading,
    'Remove Title popup should close after clicking Done'
  ).toBeHidden({ timeout: 15000 });

  await expect(
    this.myBingeListButton,
    'My Bingelist button should remain visible after removal'
  ).toBeVisible({ timeout: 15000 });

  console.log(
    'Content was successfully removed from the BingeList.'
  );
}
async openFirstContentFromBingeList(): Promise<void> {
  await expect(
    this.firstBingeListItem,
    'At least one BingeList should be displayed'
  ).toBeVisible({ timeout: 15_000 });

  await this.firstBingeListItem.click();

  await expect(
    this.firstContentThumbnail,
    'At least one content thumbnail should be displayed inside the BingeList'
  ).toBeVisible({ timeout: 15_000 });

  await this.firstContentThumbnail.click();
}

}