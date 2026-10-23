import { test } from '@playwright/test';
import { LoginPage } from '../../pageObjects/loginPage';

test.afterEach(async ({ page }) => {
    await page.waitForTimeout(5000);
});

test('Login', async ({ page }) => {
    await page.goto('https://moviesandtv.myvi.in/');
    const loginPage = new LoginPage(page);
    await loginPage.login();

});
