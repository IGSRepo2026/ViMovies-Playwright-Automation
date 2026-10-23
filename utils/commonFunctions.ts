import { Page } from '@playwright/test';
import { HomePage } from '@ViMovies/pageObjects/HomePage';
import { LoginPage } from '@ViMovies/pageObjects/loginPage';

export async function launchAndLogin(
  page: Page,
  baseUrl: string
): Promise<{ homePage: HomePage; loginPage: LoginPage }> {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await homePage.verifyHomePageLoaded();
  await loginPage.login();
  await homePage.verifyHomePageLoaded();

  return { homePage, loginPage };
}