import { test } from '@playwright/test';
import { HomePage } from '@ViMovies/pageObjects/HomePage';
import { LoginPage } from '@ViMovies/pageObjects/loginPage';
import { SubscriptionPage } from '@ViMovies/pageObjects/SubscriptionPage';

const baseUrl = process.env.BASE_URL!;

test.describe('Subscription Plans', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(baseUrl);

        const homePage = new HomePage(page);
        await homePage.verifyHomePageLoaded();
    });

    test.afterEach(async ({ page }) => {
        await page.waitForTimeout(5000);
    });

    test(
        'Verify ₹599 Subscription Plan',
        {
            tag: ['@sanity', '@subscription', '@price'],
        },
        async ({ page }) => {
            process.env.MOBILE_NUMBER =
                process.env.MOBILE_NUMBER_599_PLAN!;

            const homePage = new HomePage(page);
            const subscriptionPage = new SubscriptionPage(page);
            const loginPage = new LoginPage(page);
            await homePage.clickSubscribeIcon();
            await loginPage.Sublogin();
            await subscriptionPage.verifySubscriptionPageDisplayed();
            await subscriptionPage.verifyPlanPrice(   'ViMTV Plus',   '₹599',   '90 Days'   );
        }
    );

    test(
        'Verify ₹248 Subscription Plan',
        {
            tag: ['@sanity', '@subscription', '@price'],
        },
        async ({ page }) => {
            process.env.MOBILE_NUMBER =
                process.env.MOBILE_NUMBER_248_PLAN!;

            const loginPage = new LoginPage(page);
            const homePage = new HomePage(page);
            const subscriptionPage = new SubscriptionPage(page);
            await homePage.clickSubscribeIcon();
            await loginPage.Sublogin();
            await subscriptionPage.verifySubscriptionPageDisplayed();
            await subscriptionPage.verifyPlanPrice( 'ViMTV Plus',    '₹248');
        }
    );

    test(
        'Verify ₹798 Subscription Plan',
        {
            tag: ['@sanity', '@subscription', '@price'],
        },
        async ({ page }) => {
            process.env.MOBILE_NUMBER =
                process.env.MOBILE_NUMBER_798_PLAN!;

            const loginPage = new LoginPage(page);
            const homePage = new HomePage(page);
            const subscriptionPage = new SubscriptionPage(page);

            await homePage.clickSubscribeIcon();
            await loginPage.Sublogin();
            await subscriptionPage.verifySubscriptionPageDisplayed();
            await subscriptionPage.verifyPlanPrice( 'FIFA WC ‘26 + Z5 All Access',  '₹798',  '90 Days'  );
        }
    );

    test(
        'Verify ViMTV Plus Plan Option is Displayed',
        {
            tag: ['@sanity', '@subscription', '@plan-option'],
        },
        async ({ page }) => {
            process.env.MOBILE_NUMBER =
                process.env.MOBILE_NUMBER_599_PLAN!;

            const loginPage = new LoginPage(page);
            const homePage = new HomePage(page);
            const subscriptionPage = new SubscriptionPage(page);
            await homePage.clickSubscribeIcon();
            await loginPage.Sublogin();
            await subscriptionPage.verifySubscriptionPageDisplayed();
            await subscriptionPage.verifyPlanOptionsDisplayed();
        }
    );

    test(
        'Verify ViMTV Active Plan Option is Displayed',
        {
            tag: ['@sanity', '@subscription', '@plan-option'],
        },
        async ({ page }) => {
            process.env.MOBILE_NUMBER =
                process.env.MOBILE_NUMBER_599_PLAN!;

            const loginPage = new LoginPage(page);
            const homePage = new HomePage(page);
            const subscriptionPage = new SubscriptionPage(page);
            await homePage.clickSubscribeIcon();
            await loginPage.Sublogin();
            await subscriptionPage.verifySubscriptionPageDisplayed();
            await subscriptionPage.verifyActivePlanDisplayed();
        }
    );


     test(
        'Verify Subscription Page is Displayed',
        {
            tag: ['@sanity', '@subscription', '@page'],
        },
        async ({ page }) => {
            const homePage = new HomePage(page);
            const loginPage = new LoginPage(page);
            const subscriptionPage = new SubscriptionPage(page);
            await homePage.clickSubscribeIcon();
            await loginPage.Sublogin();
            await subscriptionPage.verifySubscriptionPageDisplayed();
        }
    );


    test(
        'Verify Subscription Page Details',
        {
            tag: ['@sanity', '@subscription', '@details'],
        },
        async ({ page }) => {
            process.env.MOBILE_NUMBER =
                process.env.NON_SUBSCRIBED_MOBILE_NUMBER!;

            const loginPage = new LoginPage(page);
            const homePage = new HomePage(page);
            const subscriptionPage = new SubscriptionPage(page);
            await homePage.clickSubscribeIcon();
            await loginPage.Sublogin();
            await subscriptionPage.verifySubscriptionPageDisplayed();
           // await subscriptionPage.verifySubscriptionPageDetails();
        }
    );
});