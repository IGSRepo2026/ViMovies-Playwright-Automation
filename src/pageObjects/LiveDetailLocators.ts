import { expect, type Locator, type Page } from '@playwright/test';

export class LiveDetailLocators {
  readonly page: Page;

  readonly clickToExplore: Locator;
  readonly exploreSection: Locator;
  readonly nextArrow: Locator;

  readonly nextGTV: Locator;
  readonly nextGTVCard: Locator;

  readonly firstThumbnailCard: Locator;
  readonly firstThumbnailImage: Locator;
  readonly liveBadge: Locator;
  readonly liveCardTitle: Locator;

  readonly watchNowButton: Locator;
  readonly player: Locator;
  readonly liveText: Locator;

  constructor(page: Page) {
    this.page = page;

    /*
     * Click to Explore carousel
     */
   this.clickToExplore = page.locator(
  "//span[normalize-space()='Favourite OTTs']"
);
    this.exploreSection = this.clickToExplore.locator(
      'xpath=ancestor::*[.//button[contains(@class,"slick-next")]][1]',
    );

    this.nextArrow = this.exploreSection
      .locator('button.slick-arrow.slick-next[data-role="none"]')
      .first();

    /*
     * NEXTG TV partner
     */
    this.nextGTV = page
      .locator('img.circle-image[src*="nextg-tv-network"]')
      .first();

    this.nextGTVCard = this.nextGTV.locator(
      'xpath=ancestor::*[self::a or self::button or @role="button"][1]',
    );

    /*
     * TV9 Kannada LIVE thumbnail
     *
     * HTML:
     * .slick-slide.slick-active.slick-current
     *   -> .carousel_inner
     *      -> img.squareImages
     *      -> .live_badge
     *      -> h5 "TV9 Kannada"
     */
    this.firstThumbnailCard = page
      .locator('.slick-slide.slick-active.slick-current .carousel_inner')
      .filter({
        has: page.getByRole('heading', {
          name: 'TV9 Kannada',
          exact: true,
        }),
      })
      .first();

    this.firstThumbnailImage = this.firstThumbnailCard
      .locator('img.squareImages')
      .first();

    this.liveBadge = this.firstThumbnailCard
      .locator('.live_badge')
      .first();

    this.liveCardTitle = this.firstThumbnailCard
      .locator('.movie_title h5')
      .first();

    /*
     * LIVE player
     */
    this.watchNowButton = page
      .getByRole('button', {
        name: /watch now|watch live|play now/i,
      })
      .first();

    // Supports JW Player and native HTML video.
    this.player = page
      .locator('.jwplayer:visible, video:visible')
      .first();

    this.liveText = page
      .locator(
        '.jw-text-live:visible, .jwplayer [class*="live"]:visible, [class*="player"] [class*="live"]:visible',
      )
      .filter({
        hasText: /^LIVE$/i,
      })
      .first();
  }

 async scrollToClickToExplore(): Promise<void> {
  // Scroll down gradually until Click to Explore appears
  for (let i = 0; i < 10; i++) {
    if (await this.clickToExplore.count() > 0) {
      const isVisible = await this.clickToExplore.first().isVisible();

      if (isVisible) {
        await this.clickToExplore.first().scrollIntoViewIfNeeded();
        console.log('✅ Click to Explore found');
        return;
      }
    }

    await this.page.mouse.wheel(0, 700);
    await this.page.waitForTimeout(500);
  }

  throw new Error('❌ Click to Explore section was not found after scrolling');
}
  

  async clickExploreNextArrow(): Promise<void> {
    await expect(
      this.nextArrow,
      'Right arrow should be visible in the Click to Explore carousel',
    ).toBeVisible({ timeout: 15000 });

    await this.nextArrow.scrollIntoViewIfNeeded();

    // JavaScript click avoids interception by the fixed header or carousel images.
    await this.nextArrow.evaluate((button: HTMLButtonElement) => {
      button.click();
    });

    // Wait for the Slick carousel animation to complete.
    await this.page.waitForTimeout(1000);
  }

  async clickNextGTV(): Promise<void> {
    await expect(
      this.nextGTV,
      'NEXTG TV logo should be visible',
    ).toBeVisible({ timeout: 30000 });

    await this.nextGTV.scrollIntoViewIfNeeded();

    const clickableParentExists = (await this.nextGTVCard.count()) > 0;

    if (clickableParentExists) {
      await expect(
        this.nextGTVCard,
        'NEXTG TV card should be visible',
      ).toBeVisible({ timeout: 10000 });

      await this.nextGTVCard.click({ force: true });
    } else {
      await this.nextGTV.click({ force: true });
    }

    // Wait for the NEXTG TV content rail to update.
    await this.page.waitForTimeout(1500);
  }

  async verifyFirstCardIsLive(): Promise<void> {
    await expect(
      this.firstThumbnailCard,
      'TV9 Kannada LIVE thumbnail should be displayed',
    ).toBeVisible({ timeout: 30000 });

    await expect(
      this.firstThumbnailImage,
      'TV9 Kannada thumbnail image should be displayed',
    ).toBeVisible({ timeout: 10000 });

    await expect(
      this.liveBadge,
      'TV9 Kannada card should contain a LIVE badge',
    ).toBeVisible({ timeout: 10000 });

    await expect(
      this.liveBadge,
      'TV9 Kannada card should be LIVE',
    ).toContainText(/LIVE/i, { timeout: 10000 });

    await expect(
      this.liveCardTitle,
      'The LIVE card title should be TV9 Kannada',
    ).toHaveText('TV9 Kannada', { timeout: 10000 });
  }

  async clickFirstLiveCard(): Promise<void> {
    await this.verifyFirstCardIsLive();

    await this.firstThumbnailCard.scrollIntoViewIfNeeded();

    /*
     * The application click handler is attached to carousel_inner,
     * so click the full thumbnail card instead of only its image.
     */
    await this.firstThumbnailCard.click({
      force: true,
      position: {
        x: 143,
        y: 76,
      },
    });

    // Wait for the LIVE detail screen to load.
    await this.page.waitForTimeout(2000);
  }

  async startLivePlaybackIfRequired(): Promise<void> {
    const playerAlreadyVisible = await this.player
      .isVisible()
      .catch(() => false);

    if (playerAlreadyVisible) {
      return;
    }

    const watchNowVisible = await this.watchNowButton
      .isVisible()
      .catch(() => false);

    if (watchNowVisible) {
      await this.watchNowButton.scrollIntoViewIfNeeded();
      await this.watchNowButton.click();

      await this.page.waitForTimeout(1000);
    }
  }

  async hoverOverPlayer(): Promise<void> {
    await expect(
      this.player,
      'LIVE video player should be visible',
    ).toBeVisible({ timeout: 30000 });

    await this.player.scrollIntoViewIfNeeded();
    await this.player.hover({ force: true });
  }

  async verifyLivePlayerDisplayed(): Promise<void> {
    await this.startLivePlaybackIfRequired();

    await expect(
      this.player,
      'LIVE video player should be displayed',
    ).toBeVisible({ timeout: 30000 });

    await this.hoverOverPlayer();

    await expect(
      this.liveText,
      'LIVE indicator should be displayed inside the player',
    ).toBeVisible({ timeout: 15000 });
  }

  async navigateToLiveDetailScreen(): Promise<void> {
    await this.scrollToClickToExplore();
    await this.clickExploreNextArrow();
    await this.clickNextGTV();
    await this.clickFirstLiveCard();
  }
}