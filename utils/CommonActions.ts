import { Page, Locator, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import * as fs from 'fs';
import * as path from 'path';

// Screenshot utility for saving timestamped screenshots
class ScreenshotManager {
  private static screenshotDir = 'screenshots';
  private static sessionDir: string;
  private static initialized = false;

  private static initializeSession() {
    if (!this.initialized) {
      const now = new Date();
      const dateStr = now.toISOString().replace(/[:.]/g, '-').split('T')[0];
      const timeStr = now.toISOString().replace(/[:.]/g, '-').split('T')[1].slice(0, -5);
      const timestamp = `${dateStr}_${timeStr}`;

      this.sessionDir = path.join(this.screenshotDir, `session_${timestamp}`);
      this.ensureDirectory(this.sessionDir);
      this.initialized = true;
    }
  }

  private static ensureDirectory(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static async saveTimestampedScreenshot(
    page: Page,
    stepName: string,
    type: 'success' | 'error' | 'action' = 'action',
  ): Promise<string> {
    this.initializeSession();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeStepName = stepName.replace(/[^a-zA-Z0-9-_]/g, '_');
    const fileName = `${timestamp}_${type}_${safeStepName}.png`;
    const filePath = path.join(this.sessionDir, fileName);

    try {
      await page.screenshot({ path: filePath, fullPage: false });
      return filePath;
    } catch (_error) {
      console.warn(`⚠️ Failed to save screenshot: ${_error}`);
      return '';
    }
  }
}

type CommandMeta = {
  command: string;
  locator?: string;
  input?: string;
  output?: string;
  screenshotOnError?: boolean;
  screenshotAfter?: boolean;
};

type StepContext = {
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
};

export async function commandStep<T>(
  page: Page,
  meta: CommandMeta,
  action: (ctx: StepContext) => Promise<T>,
): Promise<T> {
  const { command, locator, input: initialInput, screenshotOnError = true, screenshotAfter = false } =
    meta;

  let input = initialInput;
  let result: T;

  const stepContext: StepContext = {
    setInput: (val: string) => {
      input = val;
    },
    setOutput: () => {},
  };

  try {
    await allure.step(`${command}`, async () => {
      result = await action(stepContext);
      if (input) allure.attachment('Input', input, 'text/plain');
      if (locator && !locator.includes('Direct Locator object')) {
        allure.attachment('Locator', locator, 'text/plain');
      }
      if (screenshotAfter) {
        const screenshot = await page.screenshot();
        allure.attachment('Screenshot After', screenshot, 'image/png');
      }
    });

    return result!;
  } catch (err) {
    await allure.step(`❌ ${command} - ERROR`, async () => {
      if (screenshotOnError && !page.isClosed()) {
        try {
          const errorShot = await page.screenshot({
            timeout: 5_000,
            animations: 'disabled',
          });

          allure.attachment('Error Screenshot', errorShot, 'image/png');
        } catch (screenshotError) {
          console.warn(
            'Could not capture error screenshot:',
            screenshotError instanceof Error
              ? screenshotError.message
              : String(screenshotError),
          );
        }
      }
      allure.attachment('Error Details', String(err), 'text/plain');
      await ScreenshotManager.saveTimestampedScreenshot(page, command, 'error');
    });
    throw err;
  }
}

/**
 * UICommands class — Allure-integrated interaction helpers for OTT application testing.
 * Supports both string selectors and Playwright Locator objects.
 */
export class UICommands {
  private page: Page;
  private locators: Record<string, string | Locator>;

  constructor(page: Page, locators: Record<string, string | Locator> = {}) {
    this.page = page;
    this.locators = locators;
  }

  setLocators(locators: Record<string, string | Locator>) {
    this.locators = { ...this.locators, ...locators };
  }

  private resolveLocator(
    locatorKeyOrLocator: string | Locator,
    customDescription?: string,
  ): { element: Locator; description: string } {
    if (typeof locatorKeyOrLocator === 'string') {
      if (!this.locators[locatorKeyOrLocator]) {
        throw new Error(
          `Locator '${locatorKeyOrLocator}' not found. Available: ${Object.keys(this.locators).join(', ')}`,
        );
      }
      const locatorValue = this.locators[locatorKeyOrLocator];
      if (typeof locatorValue === 'string') {
        return {
          element: this.page.locator(locatorValue),
          description: customDescription || `${locatorKeyOrLocator} (${locatorValue})`,
        };
      } else {
        return {
          element: locatorValue,
          description: customDescription || `${locatorKeyOrLocator} (Locator object)`,
        };
      }
    } else {
      return {
        element: locatorKeyOrLocator,
        description: customDescription || 'Direct Locator object',
      };
    }
  }

  // --- Core Interaction Methods ---

  async uiClick(
    locatorKeyOrLocator: string | Locator,
    screenshotAfter: boolean = false,
    customDescription?: string,
  ) {
    const { element } = this.resolveLocator(locatorKeyOrLocator, customDescription);
    const stepName = customDescription ? `Click - ${customDescription}` : 'Click';
    const locatorInfo =
      typeof locatorKeyOrLocator === 'string'
        ? locatorKeyOrLocator
        : locatorKeyOrLocator.toString();
    return await commandStep(
      this.page,
      { command: stepName, locator: locatorInfo, screenshotAfter },
      async () => {
        await element.waitFor({ state: 'visible' });
        return await element.click();
      },
    );
  }

  async uiForceClick(
    locatorKeyOrLocator: string | Locator,
    screenshotAfter: boolean = false,
    timeout: number = 10000,
    customDescription?: string,
  ) {
    const { element } = this.resolveLocator(locatorKeyOrLocator, customDescription);
    const stepName = customDescription ? `Force Click - ${customDescription}` : 'Force Click';
    const locatorInfo =
      typeof locatorKeyOrLocator === 'string'
        ? locatorKeyOrLocator
        : locatorKeyOrLocator.toString();
    return await commandStep(
      this.page,
      { command: stepName, locator: locatorInfo, screenshotAfter },
      async () => {
        await element.waitFor({ state: 'visible', timeout });
        return await element.click({ force: true });
      },
    );
  }

  async uiFill(
    locatorKeyOrLocator: string | Locator,
    value: string,
    screenshotAfter: boolean = false,
    customDescription?: string,
  ) {
    const { element } = this.resolveLocator(locatorKeyOrLocator, customDescription);
    const stepName = customDescription ? `Fill - ${customDescription}` : 'Fill';
    const locatorInfo =
      typeof locatorKeyOrLocator === 'string'
        ? locatorKeyOrLocator
        : locatorKeyOrLocator.toString();
    return await commandStep(
      this.page,
      { command: stepName, locator: locatorInfo, input: value, screenshotAfter },
      async () => {
        await element.waitFor({ state: 'visible' });
        return await element.fill(value);
      },
    );
  }

  async uiTypeSequentially(
    locatorKeyOrLocator: string | Locator,
    value: string,
    delay: number = 100,
    customDescription?: string,
  ) {
    const { element } = this.resolveLocator(locatorKeyOrLocator, customDescription);
    const stepName = customDescription
      ? `Type Sequentially - ${customDescription}`
      : 'Type Sequentially';
    const locatorInfo =
      typeof locatorKeyOrLocator === 'string'
        ? locatorKeyOrLocator
        : locatorKeyOrLocator.toString();
    return await commandStep(
      this.page,
      { command: stepName, locator: locatorInfo, input: value },
      async () => {
        await element.waitFor({ state: 'visible' });
        await element.click();
        return await element.pressSequentially(value, { delay });
      },
    );
  }

  async uiClear(locatorKeyOrLocator: string | Locator, customDescription?: string) {
    const { element } = this.resolveLocator(locatorKeyOrLocator, customDescription);
    const stepName = customDescription ? `Clear - ${customDescription}` : 'Clear';
    const locatorInfo =
      typeof locatorKeyOrLocator === 'string'
        ? locatorKeyOrLocator
        : locatorKeyOrLocator.toString();
    return await commandStep(this.page, { command: stepName, locator: locatorInfo }, async () => {
      await element.waitFor({ state: 'visible' });
      return await element.clear();
    });
  }

  async uiPress(
    locatorKeyOrLocator: string | Locator,
    key: string,
    customDescription?: string,
  ) {
    const { element } = this.resolveLocator(locatorKeyOrLocator, customDescription);
    const stepName = customDescription ? `Press Key - ${customDescription}` : 'Press Key';
    const locatorInfo =
      typeof locatorKeyOrLocator === 'string'
        ? locatorKeyOrLocator
        : locatorKeyOrLocator.toString();
    return await commandStep(
      this.page,
      { command: stepName, locator: locatorInfo, input: key },
      async () => {
        await element.waitFor({ state: 'visible' });
        return await element.press(key);
      },
    );
  }

  async uiHover(
    locatorKeyOrLocator: string | Locator,
    screenshotAfter: boolean = false,
    customDescription?: string,
  ) {
    const { element } = this.resolveLocator(locatorKeyOrLocator, customDescription);
    const stepName = customDescription ? `Hover - ${customDescription}` : 'Hover';
    const locatorInfo =
      typeof locatorKeyOrLocator === 'string'
        ? locatorKeyOrLocator
        : locatorKeyOrLocator.toString();
    return await commandStep(
      this.page,
      { command: stepName, locator: locatorInfo, screenshotAfter },
      async () => {
        await element.waitFor({ state: 'visible' });
        return await element.hover();
      },
    );
  }

  async uiScrollIntoView(
    locatorKeyOrLocator: string | Locator,
    screenshotAfter: boolean = false,
    customDescription?: string,
  ) {
    const { element } = this.resolveLocator(locatorKeyOrLocator, customDescription);
    const stepName = customDescription
      ? `Scroll Into View - ${customDescription}`
      : 'Scroll Into View';
    const locatorInfo =
      typeof locatorKeyOrLocator === 'string'
        ? locatorKeyOrLocator
        : locatorKeyOrLocator.toString();
    return await commandStep(
      this.page,
      { command: stepName, locator: locatorInfo, screenshotAfter },
      async () => {
        await element.waitFor({ state: 'visible' });
        return await element.scrollIntoViewIfNeeded();
      },
    );
  }

  // --- Read/Query Methods ---

  async uiGetText(locatorKeyOrLocator: string | Locator, customDescription?: string) {
    const { element } = this.resolveLocator(locatorKeyOrLocator, customDescription);
    const stepName = customDescription ? `Get Text - ${customDescription}` : 'Get Text';
    const locatorInfo =
      typeof locatorKeyOrLocator === 'string'
        ? locatorKeyOrLocator
        : locatorKeyOrLocator.toString();
    return await commandStep(this.page, { command: stepName, locator: locatorInfo }, async () => {
      await element.waitFor({ state: 'visible' });
      return await element.textContent();
    });
  }

  async uiGetValue(locatorKeyOrLocator: string | Locator, customDescription?: string) {
    const { element } = this.resolveLocator(locatorKeyOrLocator, customDescription);
    const stepName = customDescription ? `Get Value - ${customDescription}` : 'Get Value';
    const locatorInfo =
      typeof locatorKeyOrLocator === 'string'
        ? locatorKeyOrLocator
        : locatorKeyOrLocator.toString();
    return await commandStep(this.page, { command: stepName, locator: locatorInfo }, async () => {
      await element.waitFor({ state: 'visible' });
      return await element.inputValue();
    });
  }

  async uiIsVisible(
    locatorKeyOrLocator: string | Locator,
    customDescription?: string,
  ): Promise<boolean> {
    const { element } = this.resolveLocator(locatorKeyOrLocator, customDescription);
    const stepName = customDescription
      ? `Check Visibility - ${customDescription}`
      : 'Check Visibility';
    const locatorInfo =
      typeof locatorKeyOrLocator === 'string'
        ? locatorKeyOrLocator
        : locatorKeyOrLocator.toString();
    return await commandStep(this.page, { command: stepName, locator: locatorInfo }, () =>
      element.isVisible(),
    );
  }

  async uiIsDisabled(
    locatorKeyOrLocator: string | Locator,
    customDescription?: string,
  ): Promise<boolean> {
    const { element } = this.resolveLocator(locatorKeyOrLocator, customDescription);
    const stepName = customDescription
      ? `Check Disabled - ${customDescription}`
      : 'Check Disabled';
    const locatorInfo =
      typeof locatorKeyOrLocator === 'string'
        ? locatorKeyOrLocator
        : locatorKeyOrLocator.toString();
    return await commandStep(this.page, { command: stepName, locator: locatorInfo }, async () => {
      await element.waitFor({ state: 'attached' });
      return await element.isDisabled();
    });
  }

  // --- Wait Methods ---

  async uiWaitForVisible(
    locatorKeyOrLocator: string | Locator,
    timeout: number = 10000,
    customDescription?: string,
  ) {
    const { element } = this.resolveLocator(locatorKeyOrLocator, customDescription);
    const stepName = customDescription
      ? `Wait for Visible (${timeout}ms) - ${customDescription}`
      : `Wait for Visible (${timeout}ms)`;
    const locatorInfo =
      typeof locatorKeyOrLocator === 'string'
        ? locatorKeyOrLocator
        : locatorKeyOrLocator.toString();
    return await commandStep(this.page, { command: stepName, locator: locatorInfo }, () =>
      element.first().waitFor({ state: 'visible', timeout }),
    );
  }

  async uiWaitForHidden(
    locatorKeyOrLocator: string | Locator,
    timeout: number = 10000,
    customDescription?: string,
  ) {
    const { element } = this.resolveLocator(locatorKeyOrLocator, customDescription);
    const stepName = customDescription
      ? `Wait for Hidden (${timeout}ms) - ${customDescription}`
      : `Wait for Hidden (${timeout}ms)`;
    const locatorInfo =
      typeof locatorKeyOrLocator === 'string'
        ? locatorKeyOrLocator
        : locatorKeyOrLocator.toString();
    return await commandStep(this.page, { command: stepName, locator: locatorInfo }, () =>
      element.waitFor({ state: 'hidden', timeout }),
    );
  }

  // --- Page-Level Methods ---

  async uiSetViewportSize(width: number, height: number, label?: string) {
    return await commandStep(
      this.page,
      { command: 'Set Viewport Size', output: `${width}x${height}`, locator: label || '' },
      () => this.page.setViewportSize({ width, height }),
    );
  }

  async uiKeyboardType(content: string) {
    return await commandStep(
      this.page,
      { command: 'Keyboard Type', input: content },
      async () => {
        await this.page.waitForTimeout(100);
        await this.page.keyboard.type(content, { delay: 50 });
      },
    );
  }

  async uiKeyboardPress(key: string) {
    return await commandStep(this.page, { command: 'Keyboard Press', input: key }, async () => {
      await this.page.waitForTimeout(100);
      await this.page.keyboard.press(key);
    });
  }

  async uiCaptureScreenshot(label: string = 'Screenshot') {
    const screenshot = await this.page.screenshot();
    allure.attachment(label, screenshot, 'image/png');
  }

  // --- Static Methods (Direct use without instantiating UICommands) ---

  static async genericClick(
    page: Page,
    locator: string | Locator,
    screenshotAfter: boolean = false,
    customDescription?: string,
  ) {
    const ui = new UICommands(page);
    return await ui.uiClick(locator, screenshotAfter, customDescription);
  }

  static async genericForceClick(
    page: Page,
    locator: string | Locator,
    screenshotAfter: boolean = false,
    timeout: number = 10000,
    customDescription?: string,
  ) {
    const ui = new UICommands(page);
    return await ui.uiForceClick(locator, screenshotAfter, timeout, customDescription);
  }

  static async genericFill(
    page: Page,
    locator: string | Locator,
    value: string,
    screenshotAfter: boolean = false,
    customDescription?: string,
  ) {
    const ui = new UICommands(page);
    return await ui.uiFill(locator, value, screenshotAfter, customDescription);
  }

  static async genericTypeSequentially(
    page: Page,
    locator: string | Locator,
    value: string,
    delay: number = 100,
    customDescription?: string,
  ) {
    const ui = new UICommands(page);
    return await ui.uiTypeSequentially(locator, value, delay, customDescription);
  }

  static async genericClear(
    page: Page,
    locator: string | Locator,
    customDescription?: string,
  ) {
    const ui = new UICommands(page);
    return await ui.uiClear(locator, customDescription);
  }

  static async genericPress(
    page: Page,
    locator: string | Locator,
    key: string,
    customDescription?: string,
  ) {
    const ui = new UICommands(page);
    return await ui.uiPress(locator, key, customDescription);
  }

  static async genericHover(
    page: Page,
    locator: string | Locator,
    screenshotAfter: boolean = false,
    customDescription?: string,
  ) {
    const ui = new UICommands(page);
    return await ui.uiHover(locator, screenshotAfter, customDescription);
  }

  static async genericScrollIntoView(
    page: Page,
    locator: string | Locator,
    screenshotAfter: boolean = false,
    customDescription?: string,
  ) {
    const ui = new UICommands(page);
    return await ui.uiScrollIntoView(locator, screenshotAfter, customDescription);
  }

  static async genericGetText(
    page: Page,
    locator: string | Locator,
    customDescription?: string,
  ) {
    const ui = new UICommands(page);
    return await ui.uiGetText(locator, customDescription);
  }

  static async genericGetValue(
    page: Page,
    locator: string | Locator,
    customDescription?: string,
  ) {
    const ui = new UICommands(page);
    return await ui.uiGetValue(locator, customDescription);
  }

  static async genericIsVisible(
    page: Page,
    locator: string | Locator,
    customDescription?: string,
  ): Promise<boolean> {
    const ui = new UICommands(page);
    return await ui.uiIsVisible(locator, customDescription);
  }

  static async genericIsDisabled(
    page: Page,
    locator: string | Locator,
    customDescription?: string,
  ): Promise<boolean> {
    const ui = new UICommands(page);
    return await ui.uiIsDisabled(locator, customDescription);
  }

  static async genericWaitForVisible(
    page: Page,
    locator: string | Locator,
    timeout: number = 10000,
    customDescription?: string,
  ) {
    const ui = new UICommands(page);
    return await ui.uiWaitForVisible(locator, timeout, customDescription);
  }

  static async genericWaitForHidden(
    page: Page,
    locator: string | Locator,
    timeout: number = 10000,
    customDescription?: string,
  ) {
    const ui = new UICommands(page);
    return await ui.uiWaitForHidden(locator, timeout, customDescription);
  }

  static async genericSetViewportSize(
    page: Page,
    width: number,
    height: number,
    label?: string,
  ) {
    const ui = new UICommands(page);
    return await ui.uiSetViewportSize(width, height, label);
  }

  static async genericKeyboardType(page: Page, content: string) {
    const ui = new UICommands(page);
    return await ui.uiKeyboardType(content);
  }

  static async genericKeyboardPress(page: Page, key: string) {
    const ui = new UICommands(page);
    return await ui.uiKeyboardPress(key);
  }

  static async genericCaptureScreenshot(page: Page, label: string = 'Screenshot') {
    const ui = new UICommands(page);
    return await ui.uiCaptureScreenshot(label);
  }
}

// Standalone utility for writing to Allure report
export async function writeToReport(title: string, message: string, asStep = false) {
  if (asStep) {
    await allure.step(`${title}`, async () => {
      allure.attachment(title, message, 'text/plain');
    });
  } else {
    allure.attachment(title, message, 'text/plain');
  }
}

// Wait for complete page load (useful for OTT content-heavy pages)
export async function waitForCompletePageLoad(page: Page, timeout: number = 2000): Promise<void> {
  await page.waitForTimeout(500);
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
  try {
    await page.waitForTimeout(timeout);
  } catch (_error) {
    console.warn('waitForTimeout interrupted, ignoring.');
  }
}