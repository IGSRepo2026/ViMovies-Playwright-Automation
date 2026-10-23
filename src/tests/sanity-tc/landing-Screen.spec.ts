import { test } from '@playwright/test';
import { HomePage } from '@ViMovies/pageObjects/HomePage';

const baseUrl = process.env.BASE_URL!;

test.describe('Landing Screen Tab Menu', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await page.goto(baseUrl);
    await homePage.verifyHomePageLoaded();
  });

test.afterEach(async ({ page }) => {
    await page.waitForTimeout(5000);
  }); 

  test(
    'Verify Landing Screen Tab Menu Is Visible',
    {
      tag: ['@sanity', '@landing', '@tabs'],
    },
    async () => {
      await homePage.verifyLandingTabMenuVisible();
    }
  );

  test(
    'Verify All Expected Landing Tabs Are Displayed',
    {
      tag: ['@sanity', '@landing', '@tabs'],
    },
    async () => {
      await homePage.verifyExpectedLandingTabsDisplayed();
    }
  );

  test(
    'Verify Landing Screen Tab Count',
    {
      tag: ['@sanity', '@landing', '@tabs'],
    },
    async () => {
      await homePage.verifyLandingTabCount();
    }
  );

  test(
    'Verify Landing Tab Names and Order',
    {
      tag: ['@sanity', '@landing', '@tabs'],
    },
    async () => {
      await homePage.verifyLandingTabNamesAndOrder();
    }
  );

  test(
    'Verify Home Tab Is Selected by Default',
    {
      tag: ['@sanity', '@landing', '@tabs', '@default-selection'],
    },
    async () => {
      await homePage.verifyHomeTabSelectedByDefault();
    }
  );

  test(
  'Verify Switching Between Landing Screen Tabs',
  {
    tag: ['@sanity', '@landing', '@tabs', '@tab-switching'],
  },
  async () => {
    await homePage.verifyLandingTabSwitching();
  }
);

test('Verify Landing Screen Tab Menu', { tag: ['@sanity', '@landing', '@tabs'] }, async ({ page }) => {
    const homePage = new HomePage(page);

    await page.goto(baseUrl);
    await homePage.verifyHomePageLoaded();
    await homePage.verifyLandingTabMenu();
  });
});
