// src/pageObjects/GridViewPage.ts

import { expect, type Locator, type Page } from '@playwright/test';

export class GridViewPage {
  private readonly page: Page;
  private readonly thumbnails: Locator;
  private readonly viewAllCTA: Locator;
  private readonly GridViewPage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.thumbnails = page.locator(
      'img.image[alt="img"]:visible, ' +
      'img[alt="display_image"]:visible, ' +
      'img[alt="img"]:visible',
    );

    this.viewAllCTA = page
      .getByRole('link', { name: /view\s*all/i })
      .or(page.getByRole('button', { name: /view\s*all/i }))
      .or(page.getByText(/view\s*all/i))
      .or(
        page.locator(
          '[class*="view-all" i], ' +
          '[class*="view_all" i], ' +
          '[class*="viewall" i], ' +
          '[data-testid*="view-all" i]',
        ),
      )
      .filter({ visible: true })
      .first();

     this.GridViewPage = page
    .locator('[class*="__wrapper_viewall"]')
    .first();
  }

  async prepareHomePageAfterLogin(): Promise<void> {
    const cancelButton = this.page
      .getByText(/^cancel$/i)
      .filter({ visible: true })
      .first();

    if (await cancelButton.isVisible().catch(() => false)) {
      await cancelButton.click();
    }

    const popup = this.page
      .locator('[role="dialog"]:visible, .modal:visible')
      .first();

    if (await popup.isVisible().catch(() => false)) {
      await this.page.keyboard.press('Escape');
    }

    await expect(this.page.locator('body')).toBeVisible();
  }

  async hoverThumbnailAndGetViewAllCTA(): Promise<Locator> {
    await expect(
      this.thumbnails.first(),
      'No thumbnail is displayed on the Home page',
    ).toBeVisible({ timeout: 30_000 });

    const thumbnailCount = await this.thumbnails.count();

    for (let index = 0; index < thumbnailCount; index++) {
      const thumbnail = this.thumbnails.nth(index);

      if (!(await thumbnail.isVisible().catch(() => false))) {
        continue;
      }

      try {
        await thumbnail.scrollIntoViewIfNeeded();
        await thumbnail.hover({ force: true });

        if (
          await this.viewAllCTA
            .isVisible({ timeout: 2_000 })
            .catch(() => false)
        ) {
          return this.viewAllCTA;
        }
      } catch {
        // Try the next thumbnail if the current card re-renders.
      }
    }

    throw new Error(
      `View All CTA did not appear after hovering over ${thumbnailCount} thumbnails`,
    );
  }

 
async clickFirstVisibleViewAll(): Promise<void> {
  const viewAll = this.page.locator('a.view_more', {
    hasText: 'View All',
  }).first();

  await viewAll.waitFor({ state: 'attached', timeout: 15000 });

  // Hover over the card/thumbnail that owns this View All CTA.
  const thumbnail = viewAll.locator('xpath=..');

  await thumbnail.scrollIntoViewIfNeeded();
  await thumbnail.hover();

  // The CTA should now be visible and clickable.
  await expect(viewAll).toBeVisible({ timeout: 10000 });
  await viewAll.click({ timeout: 10000 });

  await expect(this.page).toHaveURL(/\/section\//, { timeout: 15000 });
}

  


async verifyGridViewPageLoaded(): Promise<boolean> {
  try {
    const currentUrl = this.page.url();
    console.log(`Current URL: ${currentUrl}`);

    if (!/\/section\//.test(currentUrl)) {
      console.log('Grid View validation failed: unexpected URL');
      return false;
    }

    // Include the card image markup seen in the ViMTV UI.
    const gridCards = this.page.locator(
      'img.circle-image:visible, ' +
      'img[alt="card"]:visible, ' +
      '[class*="card"]:visible img:visible, ' +
      '[class*="item"]:visible img:visible, ' +
      '[class*="grid"]:visible img:visible, ' +
      'img[alt="square_img"]:visible, ' +
      'img[alt="img"]:visible, ' +
      'img[alt="display_image"]:visible'
    );

    // Wait for the first matching image instead of counting immediately.
    try {
      await gridCards.first().waitFor({
        state: 'visible',
        timeout: 15000,
      });
    } catch {
      console.log('No matching grid-card image appeared within 15 seconds.');

      // Diagnostic information to identify the actual rendered markup.
      const imageDetails = await this.page.locator('img:visible').evaluateAll(
        (images) =>
          images.slice(0, 20).map((img) => ({
            alt: img.getAttribute('alt'),
            className: img.getAttribute('class'),
            src: img.getAttribute('src'),
          }))
      );

      console.log(
        'Visible images on page:',
        JSON.stringify(imageDetails, null, 2)
      );

      return false;
    }

    const visibleCardCount = await gridCards.count();

    console.log(`Visible grid-card images: ${visibleCardCount}`);

    return visibleCardCount > 0;
  } catch (error) {
    console.error(
      'Error while verifying Grid View page:',
      error
    );

    return false;
  }
}


}