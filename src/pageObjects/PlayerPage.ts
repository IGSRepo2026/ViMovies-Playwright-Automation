import { test, expect, type Locator, type Page } from '@playwright/test';

export class PlayerPage {
  readonly page: Page;
  readonly playerContainer: Locator;
  readonly video: Locator;
  readonly controlBar: Locator;
  readonly playPauseButton: Locator;
  readonly volumeButton: Locator;
  readonly progressBar: Locator;
  readonly settingsButton: Locator;
  readonly settingsMenu: Locator;
  readonly settingsOption: Locator;
  readonly qualityOption: Locator;
  readonly episodesOption: Locator;
  readonly audioTracksOption: Locator;
  readonly audioLanguageOptions: Locator;
  readonly fullscreenButton: Locator;
  readonly tenSecondForwardButton: Locator;
  readonly tenSecondBackwardButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.playerContainer = page.locator('#trailerplayer:visible, .jwplayer:visible, .video-js:visible').filter({ has: page.locator('video') }).first();
    this.video = this.playerContainer.locator('video').first();
    this.controlBar = this.playerContainer.locator('.jw-controlbar:visible, .vjs-control-bar:visible').first();
    this.playPauseButton = this.playerContainer.locator('.jw-controlbar .jw-icon-playback:visible, .vjs-control-bar .vjs-play-control:visible').first();
    this.volumeButton = this.playerContainer.locator('.jw-controlbar .jw-icon-volume:visible, .vjs-control-bar .vjs-mute-control:visible').first();
    this.progressBar = this.playerContainer.locator('.jw-controlbar .jw-slider-time:visible, .vjs-control-bar .vjs-progress-control:visible').first();
    this.settingsButton = this.playerContainer.locator('.jw-controlbar .jw-icon-settings:visible, .vjs-control-bar .vjs-settings-button:visible').first();
    const activePlayer = page.getByRole('application', { name: 'Video Player', exact: true }).filter({ has: page.locator('video') }).first();
    this.settingsMenu = activePlayer.locator('[role="menu"]:visible, .jw-settings-menu:visible, .jw-settings-submenu:visible, .vjs-settings-menu:visible, .vjs-menu:visible').first();
    this.settingsOption = this.settingsMenu.locator('[role="menuitem"]:visible, [role="option"]:visible, li:visible, button:visible, .jw-settings-content-item:visible, .vjs-menu-item:visible').first();
    this.qualityOption = activePlayer.getByRole('button', { name: 'Quality', exact: true }).first();
    this.episodesOption = activePlayer.getByRole('button', { name: 'Episodes', exact: true }).first();
    this.audioTracksOption = this.settingsMenu.getByText('Audio Tracks', { exact: true }).first();
    this.audioLanguageOptions = this.playerContainer.locator('.jw-settings-submenu:visible [role="menuitem"], .jw-settings-submenu:visible [role="option"], .jw-settings-submenu:visible li, .vjs-menu:visible .vjs-menu-item');
    this.fullscreenButton = this.playerContainer.locator('.jw-controlbar .jw-icon-fullscreen:not(.jw-fullscreen-ima):visible, .jw-controlbar [aria-label="Fullscreen"]:visible, .vjs-control-bar .vjs-fullscreen-control:visible').first();
    this.tenSecondForwardButton = this.playerContainer.locator('[aria-label*="Forward 10" i]:visible, [title*="Forward 10" i]:visible, .jw-controlbar .jw-icon-forward:visible, .vjs-control-bar .vjs-skip-forward-10:visible').first();
    this.tenSecondBackwardButton = this.playerContainer.locator('[aria-label*="Rewind 10" i]:visible, [aria-label*="Backward 10" i]:visible, [title*="Rewind 10" i]:visible, [title*="Backward 10" i]:visible, .jw-controlbar .jw-icon-rewind:visible, .vjs-control-bar .vjs-skip-backward-10:visible').first();
  }

  async verifyPlayerVisible(): Promise<void> {
    await expect(this.playerContainer, 'Active video player is not visible').toBeVisible({ timeout: 30000 });
    await expect(this.video, 'Active video element is not attached').toBeAttached({ timeout: 30000 });
  }

  async hoverPlayer(): Promise<void> {
    await expect(this.playerContainer).toBeVisible({ timeout: 30000 });
    await this.playerContainer.scrollIntoViewIfNeeded();
    const box = await this.playerContainer.boundingBox();
    if (!box) throw new Error('Unable to determine the active player position');
    await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await this.page.mouse.move(box.x + box.width / 2, box.y + box.height - 10, { steps: 10 });
    await expect(this.controlBar, 'Player controls did not appear after hovering').toBeVisible({ timeout: 10000 });
  }

  async verifyPlaybackStarted(): Promise<void> {
  await expect(
    this.playerContainer,
    'Active video player is not visible'
  ).toBeVisible({ timeout: 30_000 });

  await expect(
    this.video,
    'Visible video element was not found inside the active player'
  ).toBeVisible({ timeout: 30_000 });

  await expect.poll(
    async () => {
      return await this.video.evaluate((element: HTMLVideoElement) => ({
        currentTime: element.currentTime,
        paused: element.paused,
        ended: element.ended,
        readyState: element.readyState,
      }));
    },
    {
      message: 'Waiting for video playback to start',
      timeout: 30_000,
      intervals: [500, 1_000, 2_000],
    }
  ).toMatchObject({
    paused: false,
    ended: false,
  });

  const initialTime = await this.getCurrentTime();

  await expect.poll(
    () => this.getCurrentTime(),
    {
      message: 'Video is not progressing after playback started',
      timeout: 15_000,
      intervals: [1_000],
    }
  ).toBeGreaterThan(initialTime);
}

async ensurePlaying(): Promise<void> {
  await expect(
    this.video,
    'Playable video element is not visible'
  ).toBeVisible({ timeout: 30_000 });

  await this.playerContainer.hover();

  const state = await this.video.evaluate((element: HTMLVideoElement) => ({
    paused: element.paused,
    ended: element.ended,
    readyState: element.readyState,
  }));

  if (state.paused || state.ended) {
    const playButton = this.playerContainer.locator(
      '.jw-icon-playback[aria-label*="Play" i]:visible, ' +
      '.jw-icon-playback.jw-off:visible, ' +
      '.vjs-play-control[title*="Play" i]:visible'
    ).first();

    if (await playButton.isVisible().catch(() => false)) {
      await playButton.click();
    } else {
      await this.video.evaluate(async (element: HTMLVideoElement) => {
        await element.play();
      });
    }
  }

  await this.verifyPlaybackStarted();
}

async getCurrentTime(): Promise<number> {
  return await this.video.evaluate(
    (element: HTMLVideoElement) => element.currentTime
  );
}

  async verifyPlaybackAdvances(): Promise<void> {
    const initialTime = await this.getCurrentTime();
    await expect.poll(() => this.getCurrentTime(), { message: 'Video playback time did not advance', timeout: 10000, intervals: [500, 1000] }).toBeGreaterThan(initialTime);
  }

  async verifySettingsOption(): Promise<void> {
    await this.hoverPlayer();
    await expect(this.settingsButton, 'Settings button is not visible').toBeVisible({ timeout: 10000 });
    await expect(this.settingsButton, 'Settings button is disabled').toBeEnabled();
    await this.settingsButton.click();
    await expect(this.settingsMenu, 'Settings menu is not visible').toBeVisible({ timeout: 10000 });
    await expect(this.settingsOption, 'Settings menu has no available option').toBeVisible({ timeout: 10000 });
  }

  async verifyQualityOption(): Promise<void> {
    await this.hoverPlayer();
    await expect(this.settingsButton, 'Settings button is not visible').toBeVisible({ timeout: 10000 });
    await expect(this.settingsButton, 'Settings button is disabled').toBeEnabled();
    await this.settingsButton.click();
    await expect(this.settingsMenu, 'Settings menu is not visible').toBeVisible({ timeout: 10000 });
    await expect(this.qualityOption, 'Quality option is not displayed in Settings').toBeVisible({ timeout: 10000 });
  }

  async verifyEpisodesOptionVisible(): Promise<void> {
    await this.hoverPlayer();
    await expect(this.episodesOption, 'Episodes option is not visible in the active player controls').toBeVisible({ timeout: 10000 });
  }

  async openAudioTracks(): Promise<void> {
    await this.hoverPlayer();
    if (!(await this.settingsMenu.isVisible().catch(() => false))) {
      await expect(this.settingsButton, 'Settings button is not visible').toBeVisible({ timeout: 10000 });
      await expect(this.settingsButton, 'Settings button is disabled').toBeEnabled();
      await this.settingsButton.click();
    }
    await expect(this.settingsMenu, 'Settings menu is not visible').toBeVisible({ timeout: 10000 });
    await expect(this.audioTracksOption, 'Audio Tracks is not displayed in Settings').toBeVisible({ timeout: 10000 });
    await this.audioTracksOption.click();
  }

  async getAudioLanguageNames(): Promise<string[]> {
    await expect(this.audioLanguageOptions.first(), 'No audio language options are available').toBeVisible({ timeout: 10000 });
    return (await this.audioLanguageOptions.allTextContents()).map(name => name.trim()).filter(Boolean);
  }

  async selectAudioLanguage(): Promise<{ name: string; count: number }> {
    const count = await this.audioLanguageOptions.count();
    if (count === 0) throw new Error('Audio Tracks is available, but no audio languages were rendered');
    const selectedIndex = await this.audioLanguageOptions.evaluateAll(options => options.findIndex(option => {
      const element = option as HTMLElement;
      return option.getAttribute('aria-selected') === 'true' || option.getAttribute('aria-checked') === 'true' || element.dataset.selected === 'true' || element.classList.contains('jw-settings-item-active') || element.classList.contains('vjs-selected');
    }));
    const targetIndex = count > 1 && selectedIndex >= 0 ? (selectedIndex + 1) % count : 0;
    const target = this.audioLanguageOptions.nth(targetIndex);
    const name = (await target.innerText()).trim();
    await target.click();
    return { name, count };
  }

  async verifySelectedAudioLanguage(name: string): Promise<void> {
    const option = this.playerContainer.locator('.jw-settings-submenu:visible [role="menuitem"], .jw-settings-submenu:visible [role="option"], .jw-settings-submenu:visible li, .vjs-menu:visible .vjs-menu-item').filter({ hasText: name }).first();
    await expect(option, `Audio language ${name} is not displayed after selection`).toBeVisible({ timeout: 10000 });
    await expect.poll(() => option.evaluate(element => element.getAttribute('aria-selected') === 'true' || element.getAttribute('aria-checked') === 'true' || (element as HTMLElement).dataset.selected === 'true' || element.classList.contains('jw-settings-item-active') || element.classList.contains('vjs-selected')), { message: `Audio language ${name} is not marked as selected`, timeout: 10000, intervals: [250, 500] }).toBe(true);
  }

  

  async clickPlayPause(): Promise<void> {
    await this.hoverPlayer();
    await expect(this.playPauseButton).toBeVisible({ timeout: 10000 });
    await expect(this.playPauseButton).toBeEnabled();
    await this.playPauseButton.click();
  }

  async getPlayedProgress(): Promise<number> {
    return await this.page.evaluate(() => {
      type PlayerWindow = Window & { jwplayer?: () => { getPosition: () => number; getDuration: () => number }; videojs?: { getPlayer: (id: string) => { currentTime: () => number; duration: () => number } | undefined } };
      const playerWindow = window as PlayerWindow;
      const jw = playerWindow.jwplayer?.();
      if (jw) { const duration = jw.getDuration(); return duration > 0 ? jw.getPosition() / duration : 0; }
      const vjs = playerWindow.videojs?.getPlayer('vjs-main-video');
      return vjs ? vjs.currentTime() / vjs.duration() : 0;
    });
  }

  async verifyProgressBarUpdates(): Promise<void> {
    await this.hoverPlayer();
    await expect(this.progressBar).toBeVisible({ timeout: 10000 });
    const initialTime = await this.getCurrentTime();
    const initialProgress = await this.getPlayedProgress();
    await expect.poll(async () => ({ timeAdvanced: await this.getCurrentTime() > initialTime, progressAdvanced: await this.getPlayedProgress() > initialProgress }), { message: 'Progress bar did not update during playback', timeout: 10000 }).toMatchObject({ timeAdvanced: true, progressAdvanced: true });
  }

  async seekToPosition(targetPercentage: number): Promise<void> {
    await this.hoverPlayer();
    const duration = await this.video.evaluate(element => (element as HTMLVideoElement).duration);
    if (!Number.isFinite(duration) || duration <= 0) throw new Error('Video duration is not finite or invalid');
    const box = await this.progressBar.boundingBox();
    if (!box) throw new Error('Progress bar bounding box was not found');
    await this.page.mouse.click(box.x + box.width * targetPercentage / 100, box.y + box.height / 2);
    const targetTime = duration * targetPercentage / 100;
    await expect.poll(async () => Math.abs(await this.getCurrentTime() - targetTime), { message: 'Video did not seek to the selected position', timeout: 10000 }).toBeLessThanOrEqual(3);
  }

  async seekToPositionReliably(
  targetPercentage: number,
  playForSeconds = 0
): Promise<void> {
  expect(
    targetPercentage,
    'Target seek position must be between 0 and 100'
  ).toBeGreaterThanOrEqual(0);

  expect(
    targetPercentage,
    'Target seek position must be between 0 and 100'
  ).toBeLessThanOrEqual(100);

  await expect(
    this.video,
    'Video must be ready before seeking'
  ).toBeVisible({ timeout: 30000 });

  await expect
    .poll(
      () =>
        this.video.evaluate(
          (video: HTMLVideoElement) => video.duration
        ),
      {
        message: 'Video duration was not available before seeking',
        timeout: 15000,
      }
    )
    .toBeGreaterThan(0);

  const duration = await this.video.evaluate(
    (video: HTMLVideoElement) => video.duration
  );

  const targetTime = Math.min(
    duration - 0.5,
    Math.max(
      0,
      (duration * targetPercentage) / 100
    )
  );

  expect(
    duration - targetTime,
    `Video does not have ${playForSeconds} seconds remaining after seeking`
  ).toBeGreaterThanOrEqual(playForSeconds);

  await this.video.evaluate(
    async (
      video: HTMLVideoElement,
      time: number
    ) => {
      video.currentTime = time;

      video.dispatchEvent(
        new Event('seeking', { bubbles: true })
      );

      video.dispatchEvent(
        new Event('timeupdate', { bubbles: true })
      );

      video.dispatchEvent(
        new Event('seeked', { bubbles: true })
      );

      await video.play();
    },
    targetTime
  );

  await expect
    .poll(
      async () =>
        Math.abs(
          (await this.getCurrentTime()) - targetTime
        ),
      {
        message:
          `Video did not seek to ${targetPercentage}% ` +
          'using the active media element',
        timeout: 10000,
        intervals: [250, 500, 1000],
      }
    )
    .toBeLessThanOrEqual(3);

  if (playForSeconds === 0) {
    return;
  }

  const playbackStartTime =
    await this.getCurrentTime();

  await expect
    .poll(
      async () => {
        const currentTime = await this.getCurrentTime();
        return currentTime - playbackStartTime;
      },
      {
        message:
          `Video did not continue playing for ` +
          `${playForSeconds} seconds after seeking`,
        timeout: (playForSeconds + 15) * 1000,
        intervals: [1000],
      }
    )
    .toBeGreaterThanOrEqual(playForSeconds);
}

  async seekNearEndAndWaitForCompletion(
    remainingSeconds = 5
  ): Promise<void> {
    expect(remainingSeconds, 'Remaining playback time must be positive').toBeGreaterThan(0);
    await expect(this.video, 'Video must be visible before completing playback').toBeVisible({ timeout: 30000 });

    await expect
      .poll(
        () => this.video.evaluate((video: HTMLVideoElement) => video.duration),
        {
          message: 'Video duration was not available before completion',
          timeout: 15000,
          intervals: [250, 500, 1000],
        }
      )
      .toBeGreaterThan(remainingSeconds);

    const duration = await this.video.evaluate(
      (video: HTMLVideoElement) => video.duration
    );
    const targetTime = Math.max(0, duration - remainingSeconds);

    await this.video.evaluate(
      async (video: HTMLVideoElement, time: number) => {
        video.currentTime = time;
        await video.play();
      },
      targetTime
    );

    await expect
      .poll(
        () =>
          this.video.evaluate((video: HTMLVideoElement) =>
            video.ended ||
            (video.duration > 0 && video.currentTime / video.duration >= 0.995)
          ),
        {
          message: 'Video did not reach natural completion',
          timeout: Math.max(30000, (remainingSeconds + 15) * 1000),
          intervals: [250, 500, 1000],
        }
      )
      .toBe(true);
  }

  async verifyPlayPauseFunctionality(): Promise<void> {
  const getVideoState = async (): Promise<{
    paused: boolean;
    currentTime: number;
  }> =>
    await this.video.evaluate((video: HTMLVideoElement) => ({
      paused: video.paused,
      currentTime: video.currentTime,
    }));

  // Pause the video
  await this.hoverPlayer();

  await expect(
    this.playPauseButton,
    'Play/Pause button should be visible',
  ).toBeVisible({ timeout: 10_000 });

  await expect(
    this.playPauseButton,
    'Play/Pause button should be enabled',
  ).toBeEnabled();

  await this.clickPlayPause();

  await expect
    .poll(async () => (await getVideoState()).paused, {
      message: 'Video did not pause after clicking the Pause button',
      timeout: 10_000,
    })
    .toBe(true);

  const { currentTime: pausedTime } = await getVideoState();

  // Confirm that the playback position remains unchanged
  await this.page.waitForTimeout(2_000);

  const { currentTime: timeAfterPause } = await getVideoState();

  expect(
    timeAfterPause,
    'Video playback time changed while paused',
  ).toBeCloseTo(pausedTime, 1);

  // Resume the video
  await this.hoverPlayer();

  await expect(
    this.playPauseButton,
    'Play button should be visible after pausing',
  ).toBeVisible({ timeout: 10_000 });

  await this.clickPlayPause();

  await expect
    .poll(async () => (await getVideoState()).paused, {
      message: 'Video did not resume after clicking the Play button',
      timeout: 10_000,
    })
    .toBe(false);

  const { currentTime: resumedTime } = await getVideoState();

  // Confirm that playback time advances
  await expect
    .poll(async () => (await getVideoState()).currentTime, {
      message: 'Video playback time did not advance after resuming',
      timeout: 10_000,
    })
    .toBeGreaterThan(resumedTime);
}


async validateSeekFunctionality(targetPercentage = 50): Promise<void> {
  await test.step(
    `Validate seek functionality - seek to ${targetPercentage}% position`,
    async () => {
      await this.ensurePlaying();

      const duration = await this.video.evaluate(
        video => (video as HTMLVideoElement).duration
      );

      expect(
        Number.isFinite(duration),
        'Video duration must be finite'
      ).toBe(true);

      expect(
        duration,
        'Video duration must be greater than zero'
      ).toBeGreaterThan(0);

      expect(
        targetPercentage,
        'Target percentage must be between 0 and 100'
      ).toBeGreaterThanOrEqual(0);

      expect(
        targetPercentage,
        'Target percentage must be between 0 and 100'
      ).toBeLessThanOrEqual(100);

      const targetTime = (targetPercentage / 100) * duration;

      const currentTime = await this.video.evaluate(
        video => (video as HTMLVideoElement).currentTime
      );

      expect(
        Math.abs(targetTime - currentTime),
        'Target seek position must be different from the current position'
      ).toBeGreaterThan(1);

      await this.seekToPosition(targetPercentage);

      const expectedProgress = targetPercentage / 100;

      await expect
        .poll(() => this.getPlayedProgress(), {
          message: `Progress bar did not reach approximately ${targetPercentage}%`,
          timeout: 10000,
        })
        .toBeCloseTo(expectedProgress, 1);

      const timeAfterSeek = await this.video.evaluate(
        video => (video as HTMLVideoElement).currentTime
      );

      await expect
        .poll(
          () =>
            this.video.evaluate(
              video => (video as HTMLVideoElement).currentTime
            ),
          {
            message: 'Video playback did not continue after seeking',
            timeout: 10000,
          }
        )
        .toBeGreaterThan(timeAfterSeek);
    }
  );
}
}
