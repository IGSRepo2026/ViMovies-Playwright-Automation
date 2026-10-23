import { expect, type Locator, type Page } from '@playwright/test';

export class ActiveDevicesPage {
  readonly page: Page;
  readonly accountSettingsEntry: Locator;
  readonly activeDevicesHeading: Locator;
  readonly activeDevicesEntry: Locator;
  readonly activeDevicesSection: Locator;
  readonly deviceCards: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.accountSettingsEntry = page.getByRole('link', {
      name: /account settings/i,
    });

    this.activeDevicesEntry = page
      .getByRole('button', {
        name: 'Active Devices',
        exact: true,
      })
      .first();

    this.activeDevicesSection = page.getByRole('region', {
      name: 'Active Devices',
    });

    this.activeDevicesHeading = this.activeDevicesSection.getByRole(
      'heading'
    ).first();

    this.deviceCards = this.activeDevicesSection.getByRole('heading');

    this.closeButton = page
      .getByRole('button', { name: /^close$/i })
      .or(page.getByText(/^close$/i))
      .or(this.activeDevicesEntry)
      .first();
  }

  async openFromProfile(): Promise<void> {
    await expect(
      this.accountSettingsEntry,
      'Account Settings should be available in the profile menu'
    ).toBeVisible({ timeout: 15000 });

    await this.accountSettingsEntry.click();

    await expect(
      this.activeDevicesEntry,
      'Active Devices should be available in the profile/account menu'
    ).toBeVisible({ timeout: 15000 });

    await this.activeDevicesEntry.click();
  }

  async verifyScreenLoaded(): Promise<void> {
    await expect(
      this.activeDevicesHeading,
      'Active Devices screen heading should be visible'
    ).toBeVisible({ timeout: 20000 });
  }

  async verifyDevicesDisplayed(): Promise<void> {
    await expect
      .poll(() => this.deviceCards.count(), {
        message: 'At least one currently logged-in device should be displayed',
        timeout: 15000,
        intervals: [250, 500, 1000],
      })
      .toBeGreaterThan(0);

    const deviceCount = await this.deviceCards.count();
    for (let index = 0; index < deviceCount; index += 1) {
      const device = this.deviceCards.nth(index);
      await expect(
        device,
        `Displayed device ${index + 1} should be visible`
      ).toBeVisible();
      const text = (await device.innerText()).replace(/\s+/g, ' ').trim();

      expect(
        text,
        `Displayed device ${index + 1} should have a name or device type`
      ).not.toBe('');

    }

    const optionalDetails = this.activeDevicesSection.getByText(
      /android|ios|windows|mac|web|mobile|tablet|last active|current device/i
    );

    if (await optionalDetails.count() > 0) {
      await expect(
        optionalDetails.first(),
        'Available device platform or status details should be visible'
      ).toBeVisible();
    }
  }

  async clickClose(): Promise<void> {
    await expect(
      this.closeButton,
      'Close option or the expanded Active Devices control should be visible'
    ).toBeVisible({ timeout: 15000 });

    await this.closeButton.click();
  }

  async verifyClosed(): Promise<void> {
    await expect(
      this.activeDevicesSection,
      'Active Screen should close successfully'
    ).toBeHidden({ timeout: 15000 });
  }
}
