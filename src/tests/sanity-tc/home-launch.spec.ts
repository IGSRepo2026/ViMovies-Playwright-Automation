import { test } from '@playwright/test';
import { HomePage } from '@ViMovies/pageObjects/HomePage';
import { assertToBe } from '@utils/Assertions';
import { LoginPage } from '@ViMovies/pageObjects/loginPage';

const baseUrl = process.env.BASE_URL!;

test.afterEach(async ({ page }) => {
  await page.waitForTimeout(5000);
});

test(
  'Subscribed user is redirected to Home page after launching ViMTV',
  { tag: ['@sanity', '@navigation'] },
  async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    await page.goto(baseUrl);
    await assertToBe(page,
    await homePage.verifyHomePageLoaded(),true,'Home page is displayed after launch', );
    await loginPage.login();
    await assertToBe(page,
    await homePage.verifyHomePageLoaded(),true,'Home page is displayed after subscribed user login',
    );
  },
);

test('Non-subscribed user is redirected to Home page after launching ViMTV',{ tag: ['@sanity', '@navigation'] },
    async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    await page.goto(baseUrl);
    await assertToBe( page, await homePage.verifyHomePageLoaded(), true, 'Home page is displayed after launch' );
    await loginPage.loginAsNonSubscribedUser();
    await assertToBe(
      page,
      await homePage.verifyHomePageLoaded(),
      true,
      'Home page is displayed after non-subscribed user login',
    );
    }
);