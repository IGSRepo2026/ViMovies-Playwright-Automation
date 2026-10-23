import { expect, type Locator, type Page } from '@playwright/test';

export class ShowDetailPage {
  readonly page: Page;
  readonly detailTitle: Locator;
  readonly detailMetadata: Locator;
  readonly groupingHeadings: Locator;
  readonly episodeSection: Locator;
  readonly episodesHeading: Locator;
  readonly episodeHeadings: Locator;
  readonly episodeCards: Locator;
  readonly youMayAlsoLikeHeading: Locator;
  readonly youMayAlsoLikeRail: Locator;
  readonly youMayAlsoLikeCards: Locator;

  constructor(page: Page) {
    this.page = page;

    this.detailTitle = page
      .locator('h1[class*="main_title"], [class*="main_title"]')
      .first();

    this.detailMetadata = page
      .locator('div[class*="main_subalign"]')
      .first();

    this.groupingHeadings = page.locator('h2.tvshows_title');

    this.episodeSection = page.locator(
      '.episode_section, [class*="episode_section"]',
    );

    this.episodesHeading = page
      .getByRole('heading', { name: 'Episodes', exact: true })
      .first();

    this.episodeHeadings = page
  .getByRole('heading', { level: 5 })
  .filter({ hasText: /^S\d+\s*\|\s*E\d+\s*-/i });

    this.episodeCards = page.locator(
      '[class*="episode_card"], [class*="episode-item"], [class*="episodeCard"]',
    );

    this.youMayAlsoLikeHeading = page
      .getByText(/^YOU MAY ALSO LIKE$/i)
      .first();

    this.youMayAlsoLikeRail = this.youMayAlsoLikeHeading.locator(
      'xpath=ancestor::div[.//img][1]',
    );

    this.youMayAlsoLikeCards = this.youMayAlsoLikeRail.locator('img');
}

  getCandidateHeading(title: string): Locator {
    return this.page
      .getByRole('heading', { name: title, exact: true })
      .first();
  }

  getCandidateCard(title: string): Locator {
    return this.getCandidateHeading(title).locator(
      'xpath=ancestor::*[.//img[@alt="display_image"]][1]',
    );
  }

  getCandidateThumbnail(title: string): Locator {
    return this.getCandidateCard(title)
      .locator('img[alt="display_image"]')
      .first();
  }

  async hasCandidate(title: string): Promise<boolean> {
    try {
      await this.getCandidateThumbnail(title).waitFor({
        state: 'visible',
        timeout: 5_000,
      });
      return true;
    } catch {
      return false;
    }
  }

  async openCandidateFromThumbnail(title: string): Promise<void> {
    const thumbnail = this.getCandidateThumbnail(title);
    const previousUrl = this.page.url();

    await expect(thumbnail).toBeVisible({ timeout: 15_000 });
    await thumbnail.scrollIntoViewIfNeeded();
    await thumbnail.click();

    await expect
      .poll(() => this.page.url(), {
        message: `Clicking the thumbnail for "${title}" did not navigate`,
        timeout: 30_000,
      })
      .not.toBe(previousUrl);

    await expect(this.page).toHaveURL(/\/tvshow\//i, {
      timeout: 30_000,
    });
  }

  async verifyDetailPage(): Promise<void> {
    await expect(this.groupingHeadings.first()).toBeVisible({
      timeout: 30_000,
    });
  }

  async getSeasonCount(): Promise<number> {
    try {
      await this.detailMetadata.waitFor({
        state: 'visible',
        timeout: 10_000,
      });
    } catch {
      console.log('Season metadata was not visible');
      return 0;
    }

    const metadata = (await this.detailMetadata.innerText()).trim();
    console.log(`Show metadata: ${metadata}`);

    const seasonCountMatch = /\b(\d+)\s+Seasons?\b/i.exec(metadata);

    if (seasonCountMatch) {
      return Number(seasonCountMatch[1]);
    }

    // A "Season 1" label alone does not establish total season count.
    return 0;
  }

  async verifySingleSeason(): Promise<number> {
    const seasonCount = await this.getSeasonCount();

    expect(
      seasonCount,
      'Selected show should contain exactly one available season',
    ).toBe(1);

    return seasonCount;
  }

  async getEpisodeRangeHeading(): Promise<Locator> {
    const rangeHeadings = this.groupingHeadings.filter({
      hasText: /^E\d+\s*-\s*E\d+$/i,
    });

    await expect
      .poll(
        async () => {
          const count = await rangeHeadings.count();

          for (let index = 0; index < count; index++) {
            if (await rangeHeadings.nth(index).isVisible()) {
              return index;
            }
          }

          return -1;
        },
        {
          message:
            'No visible episode grouping matching "E001 - E100" was found',
          timeout: 30_000,
        },
      )
      .toBeGreaterThanOrEqual(0);

    const count = await rangeHeadings.count();

    for (let index = 0; index < count; index++) {
      const heading = rangeHeadings.nth(index);

      if (await heading.isVisible()) {
        return heading;
      }
    }

    throw new Error('Episode grouping is no longer visible');
  }

  async verifyGrouping(): Promise<number> {
    const groupingHeading = await this.getEpisodeRangeHeading();

    await groupingHeading.scrollIntoViewIfNeeded();
    await expect(groupingHeading).toBeVisible();

    const groupingText = (await groupingHeading.innerText()).trim();

    expect(
      groupingText,
      `Invalid episode grouping format: "${groupingText}"`,
    ).toMatch(/^E\d+\s*-\s*E\d+$/i);

    const episodeThumbnails = this.episodeSection.locator('img:visible');

    if ((await episodeThumbnails.count()) === 0) {
      await groupingHeading.click();
    }

    await expect
      .poll(() => episodeThumbnails.count(), {
        message: `No episode thumbnails were found under "${groupingText}"`,
        timeout: 30_000,
      })
      .toBeGreaterThan(0);

    return await episodeThumbnails.count();
  }

 async openEpisodesList(): Promise<void> {
  await expect(
    this.episodesHeading,
    'Episodes List heading is not visible',
  ).toBeVisible({ timeout: 20_000 });

  await this.episodesHeading.scrollIntoViewIfNeeded();

  await expect
    .poll(() => this.episodeHeadings.count(), {
      message: 'Episodes List should contain more than one episode',
      timeout: 20_000,
    })
    .toBeGreaterThan(1);

  await expect(this.episodeHeadings.first()).toBeVisible({
    timeout: 20_000,
  });

  console.log(
    `Episodes found: ${await this.episodeHeadings.count()}`,
  );
}

  async getEpisodeTitles(): Promise<string[]> {
    await this.openEpisodesList();
    return (await this.episodeHeadings.allTextContents())
      .map(title => title.trim())
      .filter(Boolean);
  }

  async openEpisode(index: number): Promise<void> {
    const episode = this.episodeHeadings.nth(index);
    await expect(
      episode,
      `Episode at index ${index} is not visible`
    ).toBeVisible({ timeout: 20000 });

    const episodeCard = episode.locator(
      'xpath=ancestor::*[.//img][1]'
    );
    await expect(
      episodeCard,
      `Episode card at index ${index} is not visible`
    ).toBeVisible({ timeout: 20000 });
    await episodeCard.click();
  }

  async verifyEpisodesListContainsMoreThanOneEpisode(): Promise<void> {
    const visibleEpisodeCards = this.episodeCards.locator(':visible');

    await expect
      .poll(() => visibleEpisodeCards.count(), {
        message: 'Episodes list should contain more than one episode',
        timeout: 20_000,
      })
      .toBeGreaterThan(1);
  }

  async verifyYouMayAlsoLikeRail(): Promise<void> {
    await expect(
      this.youMayAlsoLikeHeading,
      '"You May Also Like" rail heading should be visible',
    ).toBeVisible({ timeout: 30_000 });

    await expect(
      this.youMayAlsoLikeRail,
      '"You May Also Like" rail should be visible',
    ).toBeVisible();

    await expect
      .poll(() => this.youMayAlsoLikeCards.count(), {
        message: '"You May Also Like" rail should contain content',
        timeout: 30_000,
      })
      .toBeGreaterThan(0);
  }
}