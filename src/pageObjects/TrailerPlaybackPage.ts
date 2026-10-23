import { expect, Locator, Page } from '@playwright/test';

export class TrailerPlaybackPage {
  readonly page: Page;

  readonly zee5Banner: Locator;
  readonly zee5WatchNowButton: Locator;
  readonly detailTitle: Locator;
  readonly trailerPlayer: Locator;
  readonly trailerVideo: Locator;

  constructor(page: Page) {
    this.page = page;

    this.zee5Banner = page
      .locator('.slider_image:visible')
      .filter({
        has: page.locator(
          '.banner_premium_logo img[alt="partner_logo"][src*="zee5-network"]'
        ),
      })
      .filter({
        has: page.getByRole('button', {
          name: /watch now/i,
        }),
      })
      .first();

    this.zee5WatchNowButton = this.zee5Banner.getByRole('button', {
      name: /watch now/i,
    });

    this.detailTitle = page.locator(
      'h1[class*="main_title"]'
    );

    this.trailerPlayer = page.locator('#trailerplayer');

    this.trailerVideo = this.trailerPlayer.locator(
      'video.jw-video'
    );
  }

  async openZee5DetailPage(): Promise<void> {
    await expect(this.zee5Banner).toBeVisible({
      timeout: 30000,
    });

    await this.zee5Banner.scrollIntoViewIfNeeded();

    await expect(this.zee5WatchNowButton).toBeVisible({
      timeout: 10000,
    });

    await this.zee5WatchNowButton.click();

    await expect(this.page).toHaveURL(
      /\/(movie|tv-show|web-series)\//,
      {
        timeout: 30000,
      }
    );

    await expect(this.detailTitle).toBeVisible({
      timeout: 30000,
    });
  }

  async verifyTrailerPlayerDisplayed(): Promise<void> {
    await expect(this.trailerPlayer).toBeVisible({
      timeout: 30000,
    });

    await expect(this.trailerVideo).toBeAttached({
      timeout: 30000,
    });
  }

  async verifyTrailerSourceLoaded(): Promise<void> {
    await expect
      .poll(
        async () =>
          await this.trailerVideo.evaluate(
            (video: HTMLVideoElement) =>
              Boolean(video.currentSrc || video.src)
          ),
        {
          message: 'Trailer media source was not loaded',
          timeout: 30000,
          intervals: [500, 1000, 2000],
        }
      )
      .toBe(true);
  }

  async verifyTrailerIsPlaying(): Promise<void> {
    await expect
      .poll(
        async () =>
          await this.trailerVideo.evaluate(
            (video: HTMLVideoElement) =>
              !video.paused &&
              !video.ended &&
              video.readyState >=
                HTMLMediaElement.HAVE_CURRENT_DATA &&
              video.currentTime > 0
          ),
        {
          message: 'Trailer did not start playing',
          timeout: 30000,
          intervals: [500, 1000, 2000],
        }
      )
      .toBe(true);
  }

  async verifyPlaybackTimeProgresses(): Promise<void> {
    const initialPlaybackTime =
      await this.trailerVideo.evaluate(
        (video: HTMLVideoElement) => video.currentTime
      );

    await expect
      .poll(
        async () =>
          await this.trailerVideo.evaluate(
            (video: HTMLVideoElement) => video.currentTime
          ),
        {
          message: 'Trailer playback time did not progress',
          timeout: 15000,
          intervals: [1000],
        }
      )
      .toBeGreaterThan(initialPlaybackTime);
  }

  async verifyTrailerPlayback(): Promise<void> {
    await this.verifyTrailerPlayerDisplayed();
    await this.verifyTrailerSourceLoaded();
    await this.verifyTrailerIsPlaying();
    await this.verifyPlaybackTimeProgresses();
  }
}