import { expect, test } from '@playwright/test';
import { ActiveDevicesPage } from '@ViMovies/pageObjects/ActiveDevicesPage';
import { HomePage } from '@ViMovies/pageObjects/HomePage';
import { LoginPage } from '@ViMovies/pageObjects/loginPage';

const baseUrl = process.env.BASE_URL!;

test.afterEach(async ({ page }) => {
  await page.waitForTimeout(6000);
});

test(
  'Verify Logged-In Devices on Active Screen',
  {
    tag: ['@sanity', '@active-devices', '@logged-in'],
  },
  async ({ page }, testInfo) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const activeDevicesPage = new ActiveDevicesPage(page);

    try {
      await test.step('Launch ViMTV and log in', async () => {
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await homePage.verifyHomePageLoaded();
        await loginPage.login();
        await homePage.verifyHomePageLoaded();
      });

      await test.step('Open the Active Devices screen from the profile menu', async () => {
        await loginPage.clickProfileIcon();
        await activeDevicesPage.openFromProfile();
      });

      await test.step('Verify Active Devices screen and logged-in devices', async () => {
        await activeDevicesPage.verifyScreenLoaded();
        await activeDevicesPage.verifyDevicesDisplayed();
      });
    } catch (error) {
      await testInfo.attach('active-devices-diagnostic', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
      throw error;
    }
  }
);

test(
  'Verify Close Screen Functionality',
  {
    tag: ['@sanity', '@active-devices', '@logged-in'],
  },
  async ({ page }, testInfo) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const activeDevicesPage = new ActiveDevicesPage(page);

    try {
      await test.step('Launch ViMTV and log in', async () => {
        await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        await homePage.verifyHomePageLoaded();
        await loginPage.login();
        await homePage.verifyHomePageLoaded();
      });

      await test.step('Navigate to the Active Screen', async () => {
        await loginPage.clickProfileIcon();
        await activeDevicesPage.openFromProfile();
        await activeDevicesPage.verifyScreenLoaded();
      });

      await test.step('Close the Active Screen', async () => {
        await activeDevicesPage.clickClose();
        await activeDevicesPage.verifyClosed();
      });

      await test.step('Verify return to the previous Account screen', async () => {
        await expect(
          page.getByRole('heading', { name: 'My Account', exact: true }),
          'Previous Account screen should be visible after closing Active Screen'
        ).toBeVisible({ timeout: 15000 });

        await expect(
          activeDevicesPage.activeDevicesHeading,
          'Active Screen should no longer be visible after closing'
        ).toHaveCount(0);
      });
    } catch (error) {
      await testInfo.attach('active-screen-close-diagnostic', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
      throw error;
    }
  }
);
