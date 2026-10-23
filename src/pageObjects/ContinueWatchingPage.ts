import { expect, type Locator, type Page } from '@playwright/test';

export class ContinueWatchingPage {
  readonly page: Page;
  readonly railHeading: Locator;
  readonly destinationDetailScreen: Locator;
  readonly destinationPlayerScreen: Locator;

  constructor(page: Page) {
    this.page = page;

    this.railHeading = page
      .locator('span.carousel_name')
      .filter({ hasText: /^Continue Watching$/ })
      .first();

    this.destinationDetailScreen = page
      .locator('h1[class*="main_title"]:visible')
      .first();

    this.destinationPlayerScreen = page
      .locator('#trailerplayer:visible, .jwplayer:visible, .video-js:visible')
      .filter({ has: page.locator('video') })
      .or(page.locator('video:visible').first())
      .first();
  }

  async findContinueWatchingRail(): Promise<Locator> {
    await expect(
      this.railHeading,
      'Continue Watching heading is missing from the home page'
    ).toBeVisible({ timeout: 30000 });

    await this.railHeading.scrollIntoViewIfNeeded();

    const rail = this.railHeading.locator(
      'xpath=ancestor::div[contains(@class, "carousel-slider")][1]'
    );

    await expect(
      rail,
      'Continue Watching rail container is not visible'
    ).toBeVisible({ timeout: 30000 });

    return rail;
  }

  async scrollRailIntoView(rail: Locator): Promise<void> {
    await rail.scrollIntoViewIfNeeded();

    await expect(
      rail,
      'Continue Watching rail is not visible after scrolling'
    ).toBeVisible({ timeout: 15000 });
  }

  async verifyRailVisible(rail: Locator): Promise<boolean> {
    try {
      await expect(
        rail,
        'Continue Watching rail should be visible'
      ).toBeVisible({ timeout: 15000 });

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Returns all visible asset containers specifically from the
   * Continue Watching rail.
   */
  async getContinueWatchingCards(rail: Locator): Promise<Locator[]> {
    const candidateCards = rail.locator(
      '.slick-slide:not(.slick-cloned)[aria-hidden="false"] .carousel-image'
    );

    const count = await candidateCards.count();
    const visibleCards: Locator[] = [];

    for (let index = 0; index < count; index += 1) {
      const card = candidateCards.nth(index);

      if (await card.isVisible().catch(() => false)) {
        visibleCards.push(card);
      }
    }

    return visibleCards;
  }

  async inspectCardProgress(
    card: Locator
  ): Promise<{
    progress: number | null;
    hasResumeAction: boolean;
    text: string;
  }> {
    try {
      const text = (
        (await card.textContent().catch(() => '')) ?? ''
      ).trim();

      const hasResumeAction =
        /resume|continue watching|\bleft\b/i.test(text);

      const progress = await card.evaluate((node: HTMLElement) => {
        const valueFromText = node.textContent ?? '';

        // Matches values such as 25% and 50.5%.
        const percentMatch = valueFromText.match(
          /(\d+(?:\.\d+)?)\s*%/
        );

        if (percentMatch) {
          const value = Number(percentMatch[1]);

          if (
            Number.isFinite(value) &&
            value >= 0 &&
            value <= 100
          ) {
            return value;
          }
        }

        const candidateAttributes = [
          'aria-valuenow',
          'data-progress',
          'data-percent',
          'value',
        ];

        const progressElements = [
          node,
          ...Array.from(
            node.querySelectorAll<HTMLElement>(
              [
                '[role="progressbar"]',
                '[aria-valuenow]',
                '[data-progress]',
                '[data-percent]',
                '[class*="progress"]',
                'progress',
              ].join(', ')
            )
          ),
        ];

        for (const progressElement of progressElements) {
          for (const attribute of candidateAttributes) {
            const attributeValue =
              progressElement.getAttribute(attribute);

            if (attributeValue === null) {
              continue;
            }

            const parsedValue = Number(attributeValue);

            if (
              Number.isFinite(parsedValue) &&
              parsedValue >= 0 &&
              parsedValue <= 100
            ) {
              return parsedValue;
            }
          }

          const inlineStyle =
            progressElement.getAttribute('style') ?? '';

          // Matches width: 50% and --progress: 50.5%.
          const widthMatch = inlineStyle.match(
            /(?:width|--progress)\s*:\s*(\d+(?:\.\d+)?)\s*%/i
          );

          if (widthMatch) {
            const parsedValue = Number(widthMatch[1]);

            if (
              Number.isFinite(parsedValue) &&
              parsedValue >= 0 &&
              parsedValue <= 100
            ) {
              return parsedValue;
            }
          }
        }

        return null;
      });

      const hasResumeActionAdditional =
        (await card
          .getByText(/resume|continue watching|\bleft\b/i)
          .count()) > 0;

      return {
        progress,
        hasResumeAction:
          hasResumeAction || hasResumeActionAdditional,
        text,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      console.warn(
        `Error inspecting card progress: ${errorMessage}`
      );

      return {
        progress: null,
        hasResumeAction: false,
        text: '',
      };
    }
  }

  async verifyProgressIsVisibleAndBetweenZeroAndOneHundred(
    cards: Locator[]
  ): Promise<boolean> {
    if (cards.length === 0) {
      return false;
    }

    for (const card of cards) {
      const { progress } =
        await this.inspectCardProgress(card);

      if (
        typeof progress === 'number' &&
        progress > 0 &&
        progress < 100
      ) {
        return true;
      }
    }

    return false;
  }

  async verifyContinueWatchingRailNotDisplayed(
    timeout = 5000
  ): Promise<void> {
    const continueWatchingHeading = this.page.locator(
      'span.carousel_name',
      { hasText: /^Continue Watching$/ }
    );

    await expect(
      continueWatchingHeading,
      'Continue Watching rail should not be displayed for a guest user'
    ).toHaveCount(0, { timeout });

    const rail = this.page
      .locator('div.carousel-slider')
      .filter({ has: continueWatchingHeading })
      .first();

    await expect(
      rail,
      'Continue Watching rail container should not be displayed for a guest user'
    ).toHaveCount(0, { timeout });
  }

  async scrollThroughHomePageToLoadAllRails(): Promise<void> {
  const continueWatchingHeading = this.page
    .locator('span.carousel_name')
    .filter({ hasText: /^Continue Watching$/i });

  const viewportStep = await this.page.evaluate(() =>
    Math.max(Math.floor(window.innerHeight * 0.8), 1)
  );

  let previousScrollTop = -1;

  while (true) {
    const visibleHeadingCount = await continueWatchingHeading.evaluateAll(
      headings =>
        headings.filter(heading => {
          const element = heading as HTMLElement;
          const style = window.getComputedStyle(element);

          return (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0' &&
            element.getBoundingClientRect().width > 0 &&
            element.getBoundingClientRect().height > 0
          );
        }).length
    );

    expect(
      visibleHeadingCount,
      'Continue Watching rail should not be visible for a guest user'
    ).toBe(0);

    const scrollPosition = await this.page.evaluate(step => {
      const scrollingElement = document.scrollingElement;

      if (!scrollingElement) {
        return {
          scrollTop: 0,
          scrollHeight: 0,
          clientHeight: 0,
        };
      }

      const currentScrollTop = scrollingElement.scrollTop;
      const maximumScrollTop =
        scrollingElement.scrollHeight - scrollingElement.clientHeight;

      scrollingElement.scrollTo({
        top: Math.min(currentScrollTop + step, maximumScrollTop),
        behavior: 'auto',
      });

      return {
        scrollTop: scrollingElement.scrollTop,
        scrollHeight: scrollingElement.scrollHeight,
        clientHeight: scrollingElement.clientHeight,
      };
    }, viewportStep);

    const reachedBottom =
      scrollPosition.scrollTop + scrollPosition.clientHeight >=
      scrollPosition.scrollHeight - 2;

    const cannotScrollFurther =
      scrollPosition.scrollTop === previousScrollTop;

    if (reachedBottom || cannotScrollFurther) {
      break;
    }

    previousScrollTop = scrollPosition.scrollTop;
  }

  // Final validation after every lazy-loaded rail has rendered.
  const visibleHeadingCount = await continueWatchingHeading.evaluateAll(
    headings =>
      headings.filter(heading => {
        const element = heading as HTMLElement;
        const style = window.getComputedStyle(element);

        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.opacity !== '0' &&
          element.getBoundingClientRect().width > 0 &&
          element.getBoundingClientRect().height > 0
        );
      }).length
  );

  expect(
    visibleHeadingCount,
    'Continue Watching rail should not be visible anywhere on the home page for a guest user'
  ).toBe(0);
}

  async verifyContinueWatchingRailAbsentWhileScrolling(): Promise<void> {
    const continueWatchingHeading = this.page
      .locator('span.carousel_name')
      .filter({ hasText: /^Continue Watching$/i });

    const assertRailAbsent = async (): Promise<void> => {
      await expect
        .poll(() => continueWatchingHeading.count(), {
          message:
            'Continue Watching rail should not appear for a guest user',
          timeout: 1000,
          intervals: [100, 250],
        })
        .toBe(0);
    };

    await assertRailAbsent();
    await this.scrollThroughHomePageToLoadAllRails();
    await assertRailAbsent();
    await expect(
      continueWatchingHeading,
      'Continue Watching rail should not be attached for a guest user'
    ).toHaveCount(0);
    await expect(
      continueWatchingHeading,
      'Continue Watching rail should not be visible for a guest user'
    ).not.toBeVisible();
  }

  async verifyCompletedContentAbsentAfterScrolling(
    completedTitle: string
  ): Promise<void> {
    const normalize = (value: string): string =>
      value.replace(/\s+/g, ' ').trim().toLocaleLowerCase();
    const expectedTitle = normalize(completedTitle);

    await this.scrollThroughHomePageToLoadAllRails();

    const rail = this.page
      .locator('div.carousel-slider')
      .filter({ has: this.railHeading })
      .first();

    if (await rail.count() === 0) {
      return;
    }

    const cards = rail.locator(
      '.slick-slide:not(.slick-cloned) .carousel-image'
    );
    const cardTitles = await cards.evaluateAll(cardElements =>
      cardElements.map(card => {
        const titleElement = card.querySelector(
          '.overlay .textsection > .text, .movie_title h5, h5, [class*="title"]'
        );

        return (titleElement?.textContent ?? card.textContent ?? '')
          .replace(/\s+/g, ' ')
          .trim()
          .toLocaleLowerCase();
      })
    );

    expect(
      cardTitles,
      `Completed content "${completedTitle}" must not remain in Continue Watching`
    ).not.toContain(expectedTitle);
  }

  async isContinueWatchingRailPresent(): Promise<boolean> {
    try {
      if (await this.railHeading.count() === 0) {
        return false;
      }

      return await this.railHeading.isVisible();
    } catch {
      return false;
    }
  }

  async getCardTitle(card: Locator): Promise<string> {
    const title = card
      .locator('.movie_title h5, h5, [class*="title"]')
      .filter({ visible: true })
      .first();

    if (await title.count()) {
      const text = (await title.textContent().catch(() => '') ?? '').trim();
      if (text) return text;
    }

    const ancestorTitle = card
      .locator('xpath=ancestor::*[.//h5 or contains(@class, "title")][1]')
      .locator('h5, [class*="title"]')
      .first();

    if (await ancestorTitle.count()) {
      const text = (await ancestorTitle.textContent().catch(() => '') ?? '').trim();
      if (text) return text;
    }

    return (await card.textContent().catch(() => '') ?? '').trim();
  }

  async findCardByTitle(rail: Locator, title: string): Promise<Locator> {
    const escapedTitle = title.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    const exactTitle = new RegExp(
      `^\\s*${escapedTitle}\\s*$`,
      'i'
    );

    const card = rail
      .locator('.carousel-image')
      .filter({
        has: this.page
          .locator('.overlay .textsection > .text')
          .filter({ hasText: exactTitle }),
      })
      .first();

    if ((await card.count()) === 0) {
      throw new Error(
        `Continue Watching rail did not contain an asset titled "${title}"`
      );
    }

    return card;
  }

  async verifyPartiallyWatchedContentDisplayed(
    contentTitle: string,
    timeout = 60000
  ): Promise<void> {
    await expect
      .poll(
        async () => {
          try {
            const rail =
              await this.findContinueWatchingRail();

            const card =
              await this.findCardByTitle(
                rail,
                contentTitle
              );

            return await card.count();
          } catch {
            return 0;
          }
        },
        {
          message:
            `Continue Watching did not synchronize ` +
            `the partially watched title "${contentTitle}"`,
          timeout,
          intervals: [1000, 2000, 5000],
        }
      )
      .toBeGreaterThan(0);

    const rail =
      await this.findContinueWatchingRail();

    const card =
      await this.findCardByTitle(
        rail,
        contentTitle
      );

    await expect(
      card,
      `Continue Watching should contain "${contentTitle}"`
    ).toBeAttached({ timeout: 10000 });

    const displayedTitle = card
      .locator('.overlay .textsection > .text')
      .first();

    await expect(
      displayedTitle,
      `Continue Watching card title should be "${contentTitle}"`
    ).toHaveText(contentTitle);
  }

  async getCardProgress(card: Locator): Promise<number> {
    const { progress } = await this.inspectCardProgress(card);

    if (progress === null) {
      const cardTitle = await this.getCardTitle(card);
      throw new Error(
        `No measurable progress value was found for Continue Watching card "${cardTitle}"`
      );
    }

    return progress;
  }

  async waitForCardProgressGreaterThan(
    title: string,
    initialProgress: number,
    timeout = 30000
  ): Promise<void> {
    await expect
      .poll(
        async () => {
          const currentRail = await this.findContinueWatchingRail();
          const card = await this.findCardByTitle(currentRail, title);
          return await this.getCardProgress(card);
        },
        {
          message: `Continue Watching progress for "${title}" did not increase`,
          timeout,
          intervals: [500, 1000, 2000],
        }
      )
      .toBeGreaterThan(initialProgress);
  }

  /**
   * Returns the first visible asset from the Continue Watching rail.
   */
  async getFirstVisibleCard(rail: Locator): Promise<Locator> {
    const cards = await this.getContinueWatchingCards(rail);

    if (cards.length === 0) {
      throw new Error(
        'No visible content cards found in Continue Watching rail'
      );
    }

    return cards[0];
  }

  /**
   * Clicks the first asset specifically inside the
   * Continue Watching rail.
   */
  async clickFirstContinueWatchingAsset(
    rail: Locator
  ): Promise<void> {
    await this.scrollRailIntoView(rail);

    const firstAsset = rail
      .locator(
        '.slick-slide[data-index="0"]:not(.slick-cloned) .carousel-image'
      )
      .first();

    await expect(
      firstAsset,
      'First Continue Watching asset should be visible'
    ).toBeVisible({ timeout: 15000 });

    await firstAsset.scrollIntoViewIfNeeded();

    const overlay = firstAsset.locator('.overlay').first();

    await expect(
      overlay,
      'First Continue Watching asset overlay should be visible'
    ).toBeVisible({ timeout: 10000 });

    // The overlay is above the image and receives pointer events.
    await overlay.click();
  }

  /**
   * Clicks the first currently visible Continue Watching card.
   */
  async clickFirstVisibleCard(rail: Locator): Promise<void> {
    await this.scrollRailIntoView(rail);

    const firstCard = await this.getFirstVisibleCard(rail);

    await expect(
      firstCard,
      'First card in Continue Watching rail should be visible before clicking'
    ).toBeVisible({ timeout: 10000 });

    const overlay = firstCard.locator('.overlay').first();

    if (await overlay.isVisible().catch(() => false)) {
      await overlay.click();
    } else {
      await firstCard.click();
    }
  }

  async waitForUrlChange(
    previousUrl: string,
    timeout = 30000
  ): Promise<string> {
    await this.page.waitForURL(
      url => {
        const currentUrl = url.toString();
        const normalizedCurrentUrl = currentUrl.replace(/\/$/, '');
        const normalizedPreviousUrl = previousUrl.replace(/\/$/, '');

        return (
          currentUrl !== previousUrl &&
          currentUrl !== previousUrl.replace(/\/$/, '') &&
          normalizedCurrentUrl !== normalizedPreviousUrl
        );
      },
      {
        timeout,
        waitUntil: 'domcontentloaded',
      }
    );

    return this.page.url();
  }

  async verifySupportedContentDestination(
    previousUrl: string
  ): Promise<void> {
    await expect
      .poll(
        () => this.page.url(),
        {
          message:
            'URL did not change after clicking the Continue Watching asset',
          timeout: 30000,
        }
      )
      .not.toBe(previousUrl);

    const destinationUrl = this.page.url();
    const destinationPath = new URL(destinationUrl).pathname;

    expect(
      destinationPath,
      `Unsupported Continue Watching destination: ${destinationUrl}`
    ).toMatch(
      /^\/(?:vod|tvshow|movie|show|series|episode|live|detail|player)(?:\/play)?(?:\/|$)/i
    );

    await expect
      .poll(
        async () =>
          (await this.destinationDetailScreen.isVisible().catch(() => false)) ||
          (await this.destinationPlayerScreen.isVisible().catch(() => false)),
        {
          message:
            `Neither the detail screen nor player screen appeared. Current URL: ${destinationUrl}`,
          timeout: 30000,
          intervals: [500, 1000, 2000],
        }
      )
      .toBe(true);

  }

}
