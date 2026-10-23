import { test } from '@playwright/test';
import { HomePage } from '@ViMovies/pageObjects/HomePage';

const baseUrl = process.env.BASE_URL!;

test.afterEach(async ({ page }) => {
  await page.waitForTimeout(5000);
});

type ContentPartner = {
  name: string;
  tag: string;
  clickNextArrowBeforeOpen: boolean;
  open: (homePage: HomePage) => Promise<void>;
  verify: (homePage: HomePage) => Promise<void>;
};

const contentPartners: ContentPartner[] = [
  'SonyLIV',
  'Zee5',
  'Hotstar',
  'Lionsgate Play',
  'FanCode',
  'Times Play',
  'Aao Nxt',
  'Manorama Max',
  'Addatimes',
  'Chaupal',
  'PlayFlix',
  'Klikk',
  'Shemaroo',
  'PocketFilms',
  'YuppTV',
  'NEXTG TV',
  'Atrangii',
  'Shemaroo Marathi Bana',
  'Kanccha Lannka',
  'Shemaroo Gujarati',
  'OTTLive',
  'ASC Digital',
].map((name) => ({
  name,
  tag: `@${name.toLowerCase().replace(/\s+/g, '-')}`,
  clickNextArrowBeforeOpen: name === 'Klikk',

  open: (homePage: HomePage) => homePage.clickContentPartner(name),

  verify: (homePage: HomePage) =>
    homePage.verifyContentPartnerPageOpened(name),
}));

for (const partner of contentPartners) {
  test(
    `Verify Configured ${partner.name} Content Partner Opens Successfully`,
    {
      tag: ['@sanity', '@partners', partner.tag],
    },
    async ({ page }) => {
      const homePage = new HomePage(page);

      await test.step(
        'Launch ViMTV and verify the Home page loads',
        async () => {
          await page.goto(baseUrl, {
            waitUntil: 'domcontentloaded',
          });

          await homePage.verifyHomePageLoaded();
        },
      );

      await test.step('Scroll to the Favourite OTTs rail', async () => {
        await homePage.scrollToClickToExploreRail();
      });

      await test.step(
        `Open and verify the ${partner.name} content partner page`,
        async () => {
          if (partner.name === 'Klikk') {
            await homePage.clickKlikkContentPartner();
          } else {
            await partner.open(homePage);
          }

          await partner.verify(homePage);
        },
      );
    },
  );
}