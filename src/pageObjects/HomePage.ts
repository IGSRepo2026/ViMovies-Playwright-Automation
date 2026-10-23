import { expect, Locator, Page } from '@playwright/test';
import { UICommands } from '@utils/CommonActions';

/**
 * HomePage — Page Object for the ViMovies home/landing page.
 * Handles header navigation elements and entry points to other pages.
 * @author ViMovies Automation
 */
export class HomePage {
  private page: Page;
  private headerLogo: Locator;
  private searchButton: Locator;
  private homeTab: Locator;
  readonly landingTabMenu: Locator;
  readonly featureCarousel: Locator;
  readonly featureCarouselSlides: Locator;
  readonly activeFeatureCarouselSlide: Locator;
  readonly contentSection: Locator;
  readonly contentThumbnails: Locator;
  readonly contentPartnerSection: Locator;
  readonly contentPartnerLogos: Locator;
  private subscribeLottie: Locator;
  private subscribeIcon: Locator;
  private bingeListTab: Locator;
  private contentCard: Locator;
  private contentCardTitle: Locator;
  private clickToExploreRail: Locator;
  private sonyLIVPartner: Locator;
  private zee5Partner: Locator;
  private hotstarPartner: Locator;
  private lionsgatePlayPartner: Locator;
  private fanCodePartner: Locator;
  private timesPlayPartner: Locator;
  private aaoNxtPartner: Locator;
  private manoramaMaxPartner: Locator;
  private addaTimesPartner: Locator;
  private chaupalPartner: Locator;
  private playFlixPartner: Locator;
  private klikkPartner: Locator;
  private shemarooPartner: Locator;
  private pocketFilmsPartner: Locator;
  private yuppTVPartner: Locator;
  private nextGTVPartner: Locator;
  private atrangiiPartner: Locator;
  private shemarooMarathiBanaPartner: Locator;
  private kancchaLannkaPartner: Locator;
  private shemarooGujaratiPartner: Locator;
  private ottLivePartner: Locator;
  private ascDigitalPartner: Locator;

  constructor(page: Page) {
    this.page = page;

    this.headerLogo = page.getByAltText('header_logo').first();
    this.searchButton = page.locator('a').filter({ hasText: 'SEARCH' });
    this.homeTab = page.getByRole('button', { name: 'Home' });
    this.landingTabMenu = page
      .getByRole('button', { name: 'Home', exact: true })
      .locator('xpath=ancestor::*[.//button[normalize-space()="Sports"] and .//button[normalize-space()="Movies"] and .//button[normalize-space()="FREE OTTs"] and .//button[normalize-space()="Web Series"]][1]');
    this.featureCarousel = page.locator('.slick-slider:visible').filter({ has: page.locator('.slider_image:visible') }).first();
    this.featureCarouselSlides = this.featureCarousel.locator('.slick-slide:not(.slick-cloned):visible').filter({ has: page.locator('.slider_image') });
    this.activeFeatureCarouselSlide = this.featureCarousel.locator('.slick-slide.slick-current:not(.slick-cloned):visible, .slick-slide.slick-active:not(.slick-cloned):visible').filter({ has: page.locator('.slider_image') }).first();
    this.contentSection = page
      .getByRole('heading', { name: 'Continue Watching', exact: true })
      .locator('xpath=ancestor::*[.//img[@alt="display_image"]][1]');
    this.contentThumbnails = this.contentSection.locator('img[alt="display_image"]:visible');
    this.contentPartnerSection = page
      .locator('div.common_carousel')
      .filter({
        has: page.locator('span.carousel_name', {
          hasText: 'Favourite OTTs',
        }),
      })
      .first();
    this.contentPartnerLogos = this.contentPartnerSection.locator(
      'img.circle-image',
    );
    this.subscribeLottie = this.page.getByAltText('subscribe_img');
    this.subscribeIcon = this.page.getByAltText('subscribe_img');
    this.bingeListTab = this.page.getByText('Bingelist').first();
    this.contentCard = this.page.locator('img[alt="img"]').nth(1);
    this.contentCardTitle = this.contentCardTitle = this.page.locator(
    '.movie_title h5'
).first();
    this.clickToExploreRail = page
      .locator('span.carousel_name')
      .filter({ hasText: /^Favourite OTTs$/i })
      .first();
    this.sonyLIVPartner = page
      .locator('img.circle-image[src*="sonyliv-network"]')
      .first();
    this.zee5Partner = page
      .locator('img.circle-image[src*="zee5-network"]')
      .first();
    this.hotstarPartner = page
      .locator('img.circle-image[src*="hotstar-network"]')
      .first();
    this.lionsgatePlayPartner = page
      .locator('img.circle-image[src*="lionsgateplay-network"]')
      .first();
    this.fanCodePartner = page
      .locator('img.circle-image[src*="fancode-network"]')
      .first();
    this.timesPlayPartner = page
      .locator('img.circle-image[src*="timesplay-network"]')
      .first();
    this.aaoNxtPartner = page
      .locator('img.circle-image[src*="aao-nxt-network"]')
      .first();
    this.manoramaMaxPartner = page
      .locator('img.circle-image[src*="defaulticonmanoramamax2026.png"]')
      .first();
    this.addaTimesPartner = page
      .locator('img.circle-image[src*="addatimes-network"]')
      .first();
    this.chaupalPartner = page
      .locator('img.circle-image[src*="chaupal-network"]')
      .first();
    this.playFlixPartner = page
      .locator('img.circle-image[src*="play-flix-network"]')
      .first();
    this.klikkPartner = page
      .locator('img.circle-image[src*="klikk-network"]')
      .first();
    this.shemarooPartner = page
      .locator('img.circle-image[src*="shemaroo-network"]')
      .first();
    this.pocketFilmsPartner = page
      .locator('img.circle-image[src*="pocketfilms-network"]')
      .first();
    this.yuppTVPartner = page
      .locator('img.circle-image[src*="yupptv-network"]')
      .first();
    this.nextGTVPartner = page
      .locator('img.circle-image[src*="nextg-tv-network"]')
      .first();
    this.atrangiiPartner = page
      .locator('img.circle-image[src*="Atrangii_white_sq_512.png"]')
      .first();
    this.shemarooMarathiBanaPartner = page
      .locator('img.circle-image[src*="shemaroo-marathibana-network"]')
      .first();
    this.kancchaLannkaPartner = page
      .locator('img.circle-image[src*="kanccha-lannka-network"]')
      .first();
    this.shemarooGujaratiPartner = page
      .locator('img.circle-image[src*="shemaroo-gujarati-network"]')
      .first();
    this.ottLivePartner = page
      .locator('img.circle-image[src*="ottlive-network"]')
      .first();
    this.ascDigitalPartner = page
      .locator('img.circle-image[src*="asc-digital-network"]')
      .first();
  }

  /**
   * Verifies the home page has loaded by checking header logo visibility.
   * @returns {Promise<boolean>} true if header logo is visible
   */
  async verifyHomePageLoaded(): Promise<boolean> {
    await UICommands.genericWaitForVisible(this.page, this.headerLogo, 30000, 'Header logo visible');
    return await UICommands.genericIsVisible(this.page, this.headerLogo, 'Header logo');
  }

 async verifyLandingTabMenu(): Promise<void> {
  const expectedTabs = [
    'Home',
    'Sports',
    'Movies',
    'FREE OTTs',
    'Web Series',
  ];

  const tabs = this.landingTabMenu.getByRole('button');

  await expect(
    this.landingTabMenu,
    'Landing screen tab menu is not visible'
  ).toBeVisible({ timeout: 15000 });

  await expect(
    tabs,
    'Landing screen tab count does not match the expected menu'
  ).toHaveCount(expectedTabs.length);

  await expect
    .poll(
      async () =>
        (await tabs.allTextContents()).map(label => label.trim()),
      {
        message: 'Landing screen tabs do not match the expected order',
        timeout: 10000,
      }
    )
    .toEqual(expectedTabs);

  const labels = (await tabs.allTextContents()).map(label => label.trim());

  expect(
    new Set(labels).size,
    'Landing screen tab menu contains duplicate labels'
  ).toBe(expectedTabs.length);

  for (const tab of expectedTabs) {
    await expect(
      this.landingTabMenu.getByRole('button', {
        name: tab,
        exact: true,
      }),
      `Landing tab is not visible: ${tab}`
    ).toBeVisible({ timeout: 10000 });
  }

  const selectedHome = this.landingTabMenu.getByRole('button', {
    name: 'Home',
    exact: true,
  });

  await expect(
    selectedHome,
    'Home is not the default selected landing tab'
  ).toHaveClass(/active-menu-title/);
}

  async verifyFeatureCarousel(): Promise<void> {
    await expect(this.featureCarousel, 'Feature Carousel is not attached and visible').toBeVisible({ timeout: 30000 });
    await expect.poll(
      () => this.featureCarouselSlides.count(),
      { message: 'Feature Carousel has no visible slides', timeout: 10000 },
    ).toBeGreaterThan(0);

    const hasValidContent = await this.featureCarousel.evaluate(slide => {
      const element = slide as HTMLElement;
      return Boolean(
        element.querySelector('img[src], [role="img"]') ||
        element.querySelector('h1, h2, h3, h4, h5, h6, p')?.textContent?.trim() ||
        element.querySelector('button, a')
      );
    });

    expect(hasValidContent, 'Displayed Feature Carousel slide has no image, title, or CTA').toBe(true);
  }

  async getFeatureCarouselSlideIds(): Promise<string[]> {
    await expect(this.featureCarousel, 'Feature Carousel is not visible').toBeVisible({ timeout: 30000 });
    await expect.poll(
      () => this.featureCarouselSlides.count(),
      { message: 'Feature Carousel has fewer than two configured banners', timeout: 15000 },
    ).toBeGreaterThan(1);

    return await this.featureCarouselSlides.evaluateAll(slides => slides.map((slide, index) => {
      const element = slide as HTMLElement;
      return element.getAttribute('data-index') || element.querySelector('img')?.getAttribute('src') || element.textContent?.trim() || `slide-${index}`;
    }));
  }

  async getActiveFeatureCarouselSlideId(): Promise<string> {
    await expect(this.activeFeatureCarouselSlide, 'No active Feature Carousel banner is visible').toBeVisible({ timeout: 15000 });
    return await this.activeFeatureCarouselSlide.evaluate((slide, index) => {
      const element = slide as HTMLElement;
      return element.getAttribute('data-index') || element.querySelector('img')?.getAttribute('src') || element.textContent?.trim() || `slide-${index}`;
    });
  }

  async swipeFeatureCarousel(direction: 'next' | 'previous'): Promise<void> {
    await expect(this.featureCarousel, 'Feature Carousel is not visible').toBeVisible({ timeout: 15000 });
    const box = await this.featureCarousel.boundingBox();
    if (!box) throw new Error('Feature Carousel position could not be determined for swipe');

    const y = box.y + box.height * 0.2;
    const startX = direction === 'next' ? box.x + box.width * 0.9 : box.x + box.width * 0.1;
    const endX = direction === 'next' ? box.x + box.width * 0.1 : box.x + box.width * 0.9;
    await this.page.mouse.move(startX, y);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, y, { steps: 12 });
    await this.page.mouse.up();
  }

  async verifyFeatureCarouselSwipe(direction: 'next' | 'previous', expectedId: string): Promise<void> {
    await expect.poll(
      () => this.getActiveFeatureCarouselSlideId(),
      { message: `Feature Carousel did not swipe to the ${direction} banner`, timeout: 15000, intervals: [250, 500, 1000] },
    ).toBe(expectedId);
  }

  async verifyContentPartnerLogos(): Promise<void> {
    await this.scrollToClickToExploreRail();
    await this.contentPartnerSection.scrollIntoViewIfNeeded();

    await expect(
      this.contentPartnerSection,
      'Click to Explore section is not visible',
    ).toBeVisible({ timeout: 30_000 });

    await expect
      .poll(
        async () => {
          const logos = this.contentPartnerLogos;
          const count = await logos.count();

          let visibleCount = 0;

          for (let index = 0; index < count; index++) {
            if (await logos.nth(index).isVisible()) {
              visibleCount++;
            }
          }

          return visibleCount;
        },
        {
          message:
            'No visible content partner logos were loaded in Click to Explore',
          timeout: 20_000,
        },
      )
      .toBeGreaterThan(0);
  }

  async scrollToClickToExploreRail(): Promise<void> {
    const viewportStep = await this.page.evaluate(() =>
      Math.max(Math.floor(window.innerHeight * 0.8), 1)
    );
    let previousScrollTop = -1;
    let stableBottomIterations = 0;

    while (true) {
      if (await this.clickToExploreRail.count() > 0) {
        await expect(
          this.clickToExploreRail,
          'Click to Explore rail should be visible on the Home page'
        ).toBeVisible({ timeout: 10000 });

        await this.clickToExploreRail.scrollIntoViewIfNeeded();
        return;
      }

      const position = await this.page.evaluate((step) => {
        const scrollingElement = document.scrollingElement;

        if (!scrollingElement) {
          return { scrollTop: 0, scrollHeight: 0, clientHeight: 0 };
        }

        scrollingElement.scrollTo({
          top: Math.min(
            scrollingElement.scrollTop + step,
            scrollingElement.scrollHeight - scrollingElement.clientHeight
          ),
          behavior: 'auto',
        });

        return {
          scrollTop: scrollingElement.scrollTop,
          scrollHeight: scrollingElement.scrollHeight,
          clientHeight: scrollingElement.clientHeight,
        };
      }, viewportStep);

      try {
        await expect
          .poll(() => this.clickToExploreRail.count(), {
            timeout: 1500,
            intervals: [100, 250, 500],
          })
          .toBeGreaterThan(0);
      } catch {
        // Continue scrolling while lazy-loaded rails are still being rendered.
      }

      const reachedBottom =
        position.scrollTop + position.clientHeight >=
        position.scrollHeight - 2;
      const cannotScrollFurther = position.scrollTop === previousScrollTop;

      if (reachedBottom && cannotScrollFurther) {
        stableBottomIterations += 1;
      } else {
        stableBottomIterations = 0;
      }

      if (stableBottomIterations >= 5) {
        break;
      }

      previousScrollTop = position.scrollTop;
    }

    await expect(
      this.clickToExploreRail,
      'Click to Explore rail should be available on the Home page'
    ).toBeVisible({ timeout: 10000 });
  }

  private getContentPartnerSource(partnerName: string): string {
    const sources: Record<string, string> = {
      SonyLIV: 'sonyliv-network',
      Zee5: 'zee5-network',
      Hotstar: 'hotstar-network',
      'Lionsgate Play': 'lionsgateplay-network',
      FanCode: 'fancode-network',
      'Times Play': 'timesplay-network',
      'Aao Nxt': 'aao-nxt-network',
      'Manorama Max': 'defaulticonmanoramamax2026.png',
      Addatimes: 'addatimes-network',
      Chaupal: 'chaupal-network',
      PlayFlix: 'play-flix-network',
      Klikk: 'klikk-network',
      Shemaroo: 'shemaroo-network',
      PocketFilms: 'pocketfilms-network',
      YuppTV: 'yupptv-network',
      'NEXTG TV': 'nextg-tv-network',
      Atrangii: 'Atrangii_white_sq_512.png',
      'Shemaroo Marathi Bana': 'shemaroo-marathibana-network',
      'Kanccha Lannka': 'kanccha-lannka-network',
      'Shemaroo Gujarati': 'shemaroo-gujarati-network',
      OTTLive: 'ottlive-network',
      'ASC Digital': 'asc-digital-network',
    };

    const source = sources[partnerName];
    if (!source) {
      throw new Error(`Unsupported content partner: ${partnerName}`);
    }

    return source;
  }

  private getContentPartnerSlug(partnerName: string): string {
    if (partnerName === 'NEXTG TV') {
      return 'nextg-tv';
    }

    return partnerName.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  async clickContentPartner(partnerName: string): Promise<void> {
    const slug = this.getContentPartnerSlug(partnerName);
    await this.scrollToClickToExploreRail();

    const partnerRail = this.page
      .locator('span.carousel_name')
      .filter({ hasText: /^Favourite OTTs$/i })
      .locator('xpath=ancestor::div[contains(@class,"common_carousel")][1]')
      .first();
    const partnerLink = partnerRail
      .locator(`a[href="/partner/${slug}"]:visible`)
      .first();
    const nextArrow = partnerRail.locator(
      'button.slick-next:not(.slick-disabled):visible',
    );

    for (
      let attempt = 0;
      attempt < 12 && !(await partnerLink.isVisible());
      attempt++
    ) {
      if (!(await nextArrow.isVisible().catch(() => false))) {
        break;
      }
      await nextArrow.evaluate((button: HTMLButtonElement) => button.click());
      await this.page.waitForTimeout(500);
    }

    await expect(
      partnerLink,
      `${partnerName} content partner should be visible in Favourite OTTs`,
    ).toBeVisible({ timeout: 20000 });

    const currentUrl = this.page.url();
    await partnerLink.click();

    await expect
      .poll(() => this.page.url(), {
        message: `${partnerName} content page should open after selection`,
        timeout: 20000,
        intervals: [250, 500, 1000],
      })
      .not.toBe(currentUrl);
  }

  async verifyContentPartnerPageOpened(partnerName: string): Promise<void> {
    const source = this.getContentPartnerSource(partnerName);

    await expect(
      this.page.locator(`img[src*="${source}"], h1, h2, h3`).first(),
      `${partnerName} content page should display content or partner information`
    ).toBeVisible({ timeout: 20000 });
  }

  
  /**
   * Clicks the Home tab in the navigation bar.
   */
  async clickHomeTab(): Promise<void> {
    await UICommands.genericClick(this.page, this.homeTab, false, 'Click Home tab');
  }

  /**
   * Identifies whether the current user is subscribed.
   * For subscribed users, the subscribe lottie is not shown.
   */
  async isSubscribedUser(): Promise<boolean> {
    return !(await this.subscribeLottie.isVisible().catch(() => false));
  }

  /**
   * Clicks the Search icon/button in the header to navigate to the search page.
   */
  async clickSearchIcon(): Promise<void> {
    await UICommands.genericClick(this.page, this.searchButton, false, 'Click Search icon');
  }

  async clickSubscribeIcon(): Promise<void> {
    await UICommands.genericClick(this.page, this.subscribeIcon, false, 'Click Subscribe icon');
  }

  async clickBingeListTab(): Promise<void> {
    await UICommands.genericClick(this.page, this.bingeListTab, false, 'Click Bingelist tab');
  }

  async openFirstAvailableContent(): Promise<void> {
    const contentImage = this.page
      .locator(
        '.carousel_inner:visible img[alt="img"], .carousel-image:visible img[alt="img"]'
      )
      .first();

    await expect(
      contentImage,
      'At least one visible Home page content card should be available'
    ).toBeVisible({ timeout: 20000 });

    await expect(
      contentImage,
      'The first available Home page content card image should be visible'
    ).toBeVisible({ timeout: 10000 });

    await contentImage.scrollIntoViewIfNeeded();
    await contentImage.click();
  }

  async returnToPreviousScreen(): Promise<void> {
    const backButton = this.page
      .getByRole('button', { name: /^back$/i })
      .filter({ visible: true })
      .first();

    if (await backButton.count() > 0) {
      await backButton.click();
    } else {
      await this.page.goBack({ waitUntil: 'domcontentloaded' });
    }
  }

  async clickAsset(): Promise<void> {
    await UICommands.genericForceClick(this.page, this.contentCard, false, 15000, 'Click content asset');
  }

 async getSelectedContentTitle(): Promise<string> {
    await this.contentCardTitle.waitFor({
        state: 'visible',
        timeout: 15000
    });

    return (await this.contentCardTitle.innerText()).trim();
}

   async isSubscribeLottieVisible(): Promise<boolean> {
    try {
        await this.subscribeLottie.waitFor({
            state: 'visible',
            timeout: 5000
        });

        return true;
    } catch {
        return false;
    }
}

private readonly expectedLandingTabs = [
  'Home',
  'Sports',
  'Movies',
  'FREE OTTs',
  'Web Series',
];

async verifyLandingTabMenuVisible(): Promise<void> {
  await expect(
    this.landingTabMenu,
    'Landing screen tab menu should be visible'
  ).toBeVisible({ timeout: 15000 });
}

async verifyLandingTabCount(): Promise<void> {
  await this.verifyLandingTabMenuVisible();

  const tabs = this.landingTabMenu.getByRole('button');

  await expect(
    tabs,
    `Landing screen should contain exactly ${this.expectedLandingTabs.length} tabs`
  ).toHaveCount(this.expectedLandingTabs.length);
}

async verifyLandingTabNamesAndOrder(): Promise<void> {
  await this.verifyLandingTabMenuVisible();

  const tabs = this.landingTabMenu.getByRole('button');

  await expect
    .poll(
      async () => {
        const labels = await tabs.allTextContents();

        return labels.map(label => label.trim());
      },
      {
        message: `Landing tabs should be displayed in this order: ${this.expectedLandingTabs.join(
          ', '
        )}`,
        timeout: 10000,
      }
    )
    .toEqual(this.expectedLandingTabs);
}

async verifyLandingTabsHaveNoDuplicates(): Promise<void> {
  await this.verifyLandingTabMenuVisible();

  const tabs = this.landingTabMenu.getByRole('button');
  const labels = (await tabs.allTextContents())
    .map(label => label.trim())
    .filter(Boolean);

  expect(
    new Set(labels).size,
    `Landing tabs should not contain duplicate names. Displayed tabs: ${labels.join(
      ', '
    )}`
  ).toBe(labels.length);
}

async verifyAllLandingTabsVisible(): Promise<void> {
  await this.verifyLandingTabMenuVisible();

  for (const tabName of this.expectedLandingTabs) {
    const tab = this.landingTabMenu.getByRole('button', {
      name: tabName,
      exact: true,
    });

    await expect(
      tab,
      `${tabName} landing tab should be visible`
    ).toBeVisible({ timeout: 10000 });
  }
}

async verifyHomeTabSelectedByDefault(): Promise<void> {
  await this.verifyLandingTabMenuVisible();

  const homeTab = this.landingTabMenu.getByRole('button', {
    name: 'Home',
    exact: true,
  });

  await expect(
    homeTab,
    'Home tab should be visible'
  ).toBeVisible({ timeout: 10000 });

  await expect(
    homeTab,
    'Home tab should be selected by default'
  ).toHaveClass(/active-menu-title/);
}
 
async verifyExpectedLandingTabsDisplayed(): Promise<void> {
  await this.verifyLandingTabMenuVisible();

  for (const tabName of this.expectedLandingTabs) {
    const tab = this.landingTabMenu.getByRole('button', {
      name: tabName,
      exact: true,
    });

    await expect(
      tab,
      `${tabName} landing tab should be displayed`
    ).toBeVisible({ timeout: 10000 });
  }
}

async verifyLandingTabSwitching(): Promise<void> {
  await this.verifyLandingTabMenuVisible();

  const tabsToSwitch = [
    'Sports',
    'Movies',
    'FREE OTTs',
    'Web Series',
  ];

  for (const tabName of tabsToSwitch) {
    const tab = this.landingTabMenu.getByRole('button', {
      name: tabName,
      exact: true,
    });

    await expect(
      tab,
      `${tabName} tab should be visible before clicking`
    ).toBeVisible({ timeout: 10000 });

    await tab.click();

    await expect(
      tab,
      `${tabName} tab should become active after clicking`
    ).toHaveClass(/active-menu-title/, {
      timeout: 15000,
    });
  }
}

async clickClickToExploreNextArrow(): Promise<void> {
  const clickToExploreRail = this.page
    .locator('div.common_carousel')
    .filter({
      has: this.page.locator('span.carousel_name', {
        hasText: 'Favourite OTTs',
      }),
    })
    .first();

  const nextArrow = clickToExploreRail.locator(
    'button.slick-next:not(.slick-disabled)',
  );

  await expect(
    nextArrow,
    'Next arrow should be visible in the Click to Explore rail',
  ).toBeVisible({ timeout: 15_000 });

  await nextArrow.click();

  const klikkPartner = clickToExploreRail
    .locator('img.circle-image[src*="klikk-network"]')
    .first();

  await expect(
    klikkPartner,
    'Klikk content partner should be visible after clicking the Next arrow',
  ).toBeVisible({ timeout: 15_000 });
}

async clickKlikkContentPartner(): Promise<void> {
  const clickToExploreHeading = this.page
    .locator('span.carousel_name', {
      hasText: /^Favourite OTTs$/,
    })
    .first();

  await expect(clickToExploreHeading).toBeVisible({
    timeout: 15_000,
  });

  const clickToExploreRail = clickToExploreHeading.locator(
    'xpath=ancestor::*[.//button[contains(@class,"slick-next")]][1]',
  );

  const nextArrow = clickToExploreRail
    .locator('button.slick-arrow.slick-next:visible')
    .first();

  await expect(
    nextArrow,
    'Click to Explore Next arrow should be visible',
  ).toBeVisible({ timeout: 15_000 });

  // First move the carousel.
  await nextArrow.evaluate((button: HTMLButtonElement) => {
    button.click();
  });
  await this.page.waitForTimeout(500);

  // Select only the visible Klikk image after moving the carousel.
  const klikkImage = clickToExploreRail
    .locator('img.circle-image[src*="klikk-network"]:visible')
    .first();

  await expect(
    klikkImage,
    'Klikk content partner should be visible after clicking Next',
  ).toBeVisible({ timeout: 15_000 });

  const currentUrl = this.page.url();

  // Click the actual clickable parent.
  await klikkImage.evaluate((image) => {
    const clickableParent = image.closest('.carousel_circle');

    if (!(clickableParent instanceof HTMLElement)) {
      throw new Error('Clickable parent for Klikk was not found');
    }

    clickableParent.click();
  });

  await expect
    .poll(() => this.page.url(), {
      message: 'Klikk content partner page should open',
      timeout: 20_000,
    })
    .not.toBe(currentUrl);
}
}
