import { test } from '@playwright/test';
import { HomePage } from '@ViMovies/pageObjects/HomePage';
import { LoginPage } from '@ViMovies/pageObjects/loginPage';
import { GridViewPage } from '@ViMovies/pageObjects/GridViewPage';
import { assertToBe } from '@utils/Assertions';

const baseUrl = process.env.BASE_URL!;

test.describe('Login - Different Entry Points', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(baseUrl);
        const homePage = new HomePage(page);
        await homePage.verifyHomePageLoaded();
    });

     test.afterEach(async ({ page }) => {
    await page.waitForTimeout(3000);
  });    


    test('Verify mobile number login from Home Subscribe icon', {
        tag: ['@sanity', '@login', '@navigation']
    }, async ({ page }) => {
        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);
        await homePage.clickSubscribeIcon();
        await loginPage.Sublogin();
    });

    test('Verify login prompt from Carousel Watch Now', {
        tag: ['@sanity', '@login', '@navigation']
    }, async ({ page }) => {

        const loginPage = new LoginPage(page);
        await loginPage.clickOnWatchNowButton();
        await loginPage.clickSignInButton();
    });

    

    test('Verify login prompt from Landing Grid asset', {
        tag: ['@sanity', '@login', '@navigation']
    }, async ({ page }) => {

        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);
        await homePage.clickAsset();
        await loginPage.clickSignInButton();
        await loginPage.login();
    });

    test('Verify login prompt from BingeList tab', {
        tag: ['@sanity', '@login', '@navigation']
    }, async ({ page }) => {

        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);
        await homePage.clickBingeListTab();
        await loginPage.login();
    });

    test('Verify BingeList login toast after opening content', {
        tag: ['@sanity', '@login', '@bingelist'],
    }, async ({ page }) => {

        const loginPage = new LoginPage(page);
        await loginPage.clickOnWatchNowButton();
        await loginPage.clickMyBingeList();
        await loginPage.verifyBingeListPopup();
    });


test.describe('Verify Feature Carousel on Home', () => {
  test('Verify Feature Carousel on Home @sanity @home @carousel', {
    tag: ['@sanity', '@home', '@carousel'],
  }, async ({ page }) => {
    const homePage = new HomePage(page);

    await page.goto(baseUrl);
    await homePage.verifyHomePageLoaded();
    await homePage.verifyHomePageLoaded();
    await homePage.verifyFeatureCarousel();
  });
});

  
  test.describe('Grid View / View All Page', () => {
    test(
      'Verify Grid View/View All Page',
      {
        tag: ['@sanity', '@grid-view', '@view-all'],
      },
      async ({ page }) => {
        const gridViewPage = new GridViewPage(page);
        await gridViewPage.clickFirstVisibleViewAll();
         await assertToBe( page, await gridViewPage.verifyGridViewPageLoaded(), true,
         'Grid View page should load after clicking View All',
        );
      },
    );
  });

});