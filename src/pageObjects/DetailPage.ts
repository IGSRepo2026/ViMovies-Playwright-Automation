import { expect, Locator, Page } from '@playwright/test';

export class DetailPage {
  readonly page: Page;
  readonly detailTitle: Locator;
  readonly detailDescription: Locator;
  readonly watchNowButton: Locator;
  readonly bingelistButton: Locator;
  readonly partnerLogo: Locator;
  readonly shareButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.detailTitle = page
      .locator(
        'h1[class*="title"], h2[class*="title"], [class*="main_title"], [class*="detail"][class*="title"]'
      )
      .filter({
        hasNotText: /^(exit|close|back|done|watch now|play)$/i,
      })
      .first();
    this.detailDescription = page.locator('div[class*="description_text"]');
    this.watchNowButton = page
  .locator('button[class*="signin_btn"]')
  .filter({ hasText: /^\s*(Watch Now|Start Over)\s*$/i });
    this.bingelistButton = page.getByRole('button', { name: /My Bingelist/ });
    this.partnerLogo = page.getByAltText('partner_icon');
    this.shareButton = page.locator('button[class*="share_icon"]');
    this.backButton = page
      .locator(
        'button[aria-label*="back" i], ' +
        'img[alt*="back" i], ' +
        '[class*="back_btn"], ' +
        '[class*="back-button"]'
      )
      .first();
  }

  async verifyDetailScreenLoaded(): Promise<void> {
    await expect(this.detailTitle).toBeVisible({ timeout: 20000 });
    await expect(this.detailDescription).toBeVisible({ timeout: 20000 });
    await expect(this.watchNowButton).toBeVisible({ timeout: 20000 });
    await expect(this.bingelistButton).toBeVisible({ timeout: 20000 });
    await expect(this.partnerLogo).toBeVisible({ timeout: 20000 });
    await expect(this.shareButton).toBeVisible({ timeout: 20000 });
  }

 async clickWatchNowButton(): Promise<void> {
  await expect(
    this.watchNowButton,
    'Expected one detail-page Watch Now or Start Over button'
  ).toHaveCount(1, { timeout: 20000 });

  await expect(this.watchNowButton).toBeVisible({ timeout: 20000 });
  await expect(this.watchNowButton).toBeEnabled();

  await this.watchNowButton.click();
}

  async clickBackButton(): Promise<void> {
    await expect(
      this.backButton,
      'Back button should be visible on the detail screen'
    ).toBeVisible({ timeout: 15000 });

    await this.backButton.click();
  }

  async getDetailScreenTitle(): Promise<string> {
    await expect(
      this.detailTitle,
      'Content title should be visible on the detail screen'
    ).toBeVisible({ timeout: 15000 });

    const title = (await this.detailTitle.innerText()).trim();

    expect(
      title,
      'Detail screen returned an invalid content title'
    ).not.toMatch(/^(close|back|watch now|play)$/i);

    return title;
  }

  async addToBingeList(): Promise<void> {
    await expect(
      this.bingelistButton,
      'Add to BingeList button should be visible on the detail screen'
    ).toBeVisible({ timeout: 15000 });

    await this.bingelistButton.click();

    const modalHeading = this.page.getByRole('heading', {
      name: /add this title to bingelist/i,
    });
    await expect(
      modalHeading,
      'BingeList selection dialog should open after clicking Add to BingeList'
    ).toBeVisible({ timeout: 10000 });

    const modal = modalHeading.locator('..');
    const listButton = modal
      .locator('button')
      .filter({ hasNotText: /create new bingelist|done/i })
      .first();

    await expect(
      listButton,
      'At least one existing BingeList should be available for the content'
    ).toBeVisible({ timeout: 10000 });
    await listButton.click();

    const doneButton = modal.getByRole('button', { name: 'Done', exact: true });
    await expect(doneButton, 'BingeList dialog should provide a Done action').toBeEnabled();
    await doneButton.click();

    await expect(
      modalHeading,
      'BingeList selection dialog should close after adding the content'
    ).toBeHidden({ timeout: 10000 });
  }

}
