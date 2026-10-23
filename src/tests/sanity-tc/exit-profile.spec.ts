import { test } from '@playwright/test';
import { launchAndLogin } from '@utils/commonFunctions';

const baseUrl = process.env.BASE_URL!;

test(
  'Verify Who’s Watching Screen After Exiting Profile',
  {
    tag: ['@sanity', '@profile', '@exit-profile'],
  },
  async ({ page }) => {
    const { loginPage } = await launchAndLogin(page, baseUrl);

    await test.step('Exit profile', async () => {
      await loginPage.clickProfileIcon();
      await loginPage.verifyExitProfileOptionVisible();
      await loginPage.clickExitProfile();
    });

    await test.step('Verify Who’s Watching screen', async () => {
      await loginPage.verifyWhosWatchingScreen();
      await loginPage.verifyProfilesAreVisible();
      await loginPage.verifyAllProfilesHaveNames();
    });
  }
);