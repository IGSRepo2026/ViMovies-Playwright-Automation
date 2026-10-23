import { Locator, Page, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

function logStep(command: string, label: string, expected?: string) {
  const timestamp = new Date().toLocaleTimeString();
  const msgParts = [`${command}`, `Label: ${label}`, expected && `Expected: ${expected}`].filter(
    Boolean,
  );
  console.log(`[${timestamp}] ➤  ${msgParts.join(' | ')}`);
}

async function captureSuccessScreenshot(page: Page, command: string) {
  const screenshot = await page.screenshot();
  allure.attachment(`${command} - Success Screenshot`, screenshot, 'image/png');
}

/**
 * Generic assertion wrapper with Allure step logging and screenshots on failure.
 */
async function assertStep<T>(
  page: Page,
  command: string,
  label: string,
  expected: string | undefined,
  action: () => Promise<T>,
  screenshotOnSuccess = false,
): Promise<T | undefined> {
  logStep(command, label, expected);

  let result: T | undefined;

  await allure.step(
    [command, `Label: ${label}`, expected && `Expected: ${expected}`].filter(Boolean).join(' | '),
    async () => {
      try {
        result = await action();
        if (expected) {
          allure.attachment('Expected Value', expected, 'text/plain');
        }
        if (screenshotOnSuccess) {
          try {
            await captureSuccessScreenshot(page, command);
          } catch (_ssErr) {
            console.warn(`⚠️ Success screenshot failed (non-fatal)`);
          }
        }
      } catch (error) {
        try {
          const screenshot = await page.screenshot();
          allure.attachment('Assertion Failure Screenshot', screenshot, 'image/png');
        } catch (_screenshotError) {
          console.warn(`⚠️ Failed to capture failure screenshot`);
        }
        console.error(`❌ ${command} failed — ${label}`);
        throw error;
      }
    },
  );

  return result;
}

// --- Visibility Assertions ---

export async function assertVisible(
  page: Page,
  locator: string | Locator,
  label = 'Element Visible',
  screenshotOnSuccess = false,
) {
  const element = typeof locator === 'string' ? page.locator(locator) : locator;
  await assertStep(
    page,
    'Assert Visible',
    label,
    undefined,
    async () => {
      await expect(element).toBeVisible({ timeout: 10000 });
    },
    screenshotOnSuccess,
  );
}

export async function assertHidden(
  page: Page,
  locator: string | Locator,
  label = 'Element Hidden',
  screenshotOnSuccess = false,
) {
  const element = typeof locator === 'string' ? page.locator(locator) : locator;
  await assertStep(
    page,
    'Assert Hidden',
    label,
    undefined,
    async () => {
      await expect(element).toBeHidden({ timeout: 10000 });
    },
    screenshotOnSuccess,
  );
}

// --- Text Assertions ---

export async function assertTextEquals(
  page: Page,
  locator: string | Locator,
  expected: string,
  label = 'Text Equals',
  screenshotOnSuccess = false,
) {
  const element = typeof locator === 'string' ? page.locator(locator) : locator;
  await assertStep(
    page,
    'Assert Text Equals',
    label,
    expected,
    async () => {
      await expect(element).toHaveText(expected, { timeout: 10000 });
    },
    screenshotOnSuccess,
  );
}

export async function assertTextContains(
  page: Page,
  locator: string | Locator,
  expected: string,
  label = 'Text Contains',
  screenshotOnSuccess = false,
) {
  const element = typeof locator === 'string' ? page.locator(locator) : locator;
  await assertStep(
    page,
    'Assert Text Contains',
    label,
    expected,
    async () => {
      await expect(element).toContainText(expected, { timeout: 10000 });
    },
    screenshotOnSuccess,
  );
}

// --- Direct Value Assertions (no locator — compare values directly) ---

/**
 * Assert two strings are exactly equal. Logs to Allure.
 */
export async function assertTextEqualsDirectly(
  page: Page,
  actual: string,
  expected: string,
  label = 'Text Comparison',
  screenshotOnSuccess = false,
) {
  await assertStep(
    page,
    'Assert Text Equals (Direct)',
    label,
    expected,
    async () => {
      const actualTrimmed = actual.trim();
      const expectedTrimmed = expected.trim();

      console.log(`🔍 ${label}: actual="${actualTrimmed}" expected="${expectedTrimmed}"`);

      if (actualTrimmed !== expectedTrimmed) {
        console.error(
          `❌ ${label}: Expected "${expectedTrimmed}" but received "${actualTrimmed}"`,
        );
      }

      expect(actualTrimmed).toBe(expectedTrimmed);
    },
    screenshotOnSuccess,
  );
}

/**
 * Assert equality for any value type (boolean, number, string).
 * Logs to Allure with description.
 */
export async function assertToBe(
  page: Page,
  actual: unknown,
  expected: unknown,
  label = 'Equality Check',
  screenshotOnSuccess = false,
): Promise<void> {
  await assertStep(
    page,
    'Assert To Be',
    label,
    String(expected),
    async () => {
      console.log(
        `🔍 ${label}: actual=${JSON.stringify(actual)} expected=${JSON.stringify(expected)}`,
      );

      if (actual !== expected) {
        console.error(
          `❌ ${label}: Expected ${JSON.stringify(expected)} but received ${JSON.stringify(actual)}`,
        );
      }

      expect(actual).toBe(expected);
    },
    screenshotOnSuccess,
  );
}

/**
 * Assert string contains substring. Logs to Allure.
 */
export async function assertToContain(
  page: Page,
  actual: string,
  substring: string,
  label = 'Contains Check',
  screenshotOnSuccess = false,
): Promise<void> {
  await assertStep(
    page,
    'Assert To Contain',
    label,
    substring,
    async () => {
      console.log(`🔍 ${label}: actual="${actual}" should contain="${substring}"`);

      if (!actual.includes(substring)) {
        console.error(`❌ ${label}: "${actual}" does not contain "${substring}"`);
      }

      expect(actual).toContain(substring);
    },
    screenshotOnSuccess,
  );
}

/**
 * Assert numeric value is greater than threshold. Logs to Allure.
 */
export async function assertToBeGreaterThan(
  page: Page,
  actual: number,
  threshold: number,
  label = 'Greater Than Check',
  screenshotOnSuccess = false,
): Promise<void> {
  await assertStep(
    page,
    'Assert Greater Than',
    label,
    `> ${threshold}`,
    async () => {
      console.log(`🔍 ${label}: actual=${actual} threshold=${threshold}`);

      if (actual <= threshold) {
        console.error(`❌ ${label}: ${actual} is not greater than ${threshold}`);
      }

      expect(actual).toBeGreaterThan(threshold);
    },
    screenshotOnSuccess,
  );
}

/**
 * Assert array has specific length. Logs to Allure.
 */
export async function assertToHaveLength(
  page: Page,
  actual: unknown[],
  expectedLength: number,
  label = 'Array Length Check',
  screenshotOnSuccess = false,
): Promise<void> {
  await assertStep(
    page,
    'Assert Array Length',
    label,
    String(expectedLength),
    async () => {
      console.log(`🔍 ${label}: actual length=${actual.length} expected=${expectedLength}`);

      if (actual.length !== expectedLength) {
        console.error(
          `❌ ${label}: Array length ${actual.length} !== expected ${expectedLength}`,
        );
      }

      expect(actual).toHaveLength(expectedLength);
    },
    screenshotOnSuccess,
  );
}

// --- URL Assertions ---

// export async function assertUrlContains(
//   page: Page,
//   expected: string,
//   label = 'URL Contains',
//   screenshotOnSuccess = false,
// ) {
//   await assertStep(
//     page,
//     'Assert URL Contains',
//     label,
//     expected,
//     async () => {
//       expect(page.url()).toContain(expected);
//     },
//     screenshotOnSuccess,
//   );
// }
export async function assertUrlContains(
  page: Page,
  expected: string,
  label = 'URL Contains',
  screenshotOnSuccess = false,
) {
  await assertStep(
    page,
    'Assert URL Contains',
    label,
    expected,
    async () => {
      await expect(page).toHaveURL(new RegExp(expected), {
        timeout: 10000,
      });
    },
    screenshotOnSuccess,
  );
}

// --- State Assertions ---

export async function assertEnabled(
  page: Page,
  locator: string | Locator,
  label = 'Element Enabled',
  screenshotOnSuccess = false,
) {
  const element = typeof locator === 'string' ? page.locator(locator) : locator;
  await assertStep(
    page,
    'Assert Enabled',
    label,
    undefined,
    async () => {
      await expect(element).toBeEnabled({ timeout: 10000 });
    },
    screenshotOnSuccess,
  );
}

export async function assertDisabled(
  page: Page,
  locator: string | Locator,
  label = 'Element Disabled',
  screenshotOnSuccess = false,
) {
  const element = typeof locator === 'string' ? page.locator(locator) : locator;
  await assertStep(
    page,
    'Assert Disabled',
    label,
    undefined,
    async () => {
      await expect(element).toBeDisabled({ timeout: 10000 });
    },
    screenshotOnSuccess,
  );
}

// --- Soft Assertions (non-failing — test continues on mismatch) ---

export async function softAssertTextEquals(
  page: Page,
  actual: string,
  expected: string,
  label = 'Soft Text Comparison',
) {
  await assertStep(page, 'Soft Assert Text Equals', label, expected, async () => {
    expect.soft(actual.trim()).toBe(expected.trim());
  });
}

export async function softAssertTextContains(
  page: Page,
  actual: string,
  expected: string,
  label = 'Soft Contains Check',
) {
  await assertStep(page, 'Soft Assert Contains', label, expected, async () => {
    expect.soft(actual).toContain(expected.trim());
  });
}

export async function softAssertToBe(
  page: Page,
  actual: unknown,
  expected: unknown,
  label = 'Soft Equality Check',
) {
  await assertStep(page, 'Soft Assert To Be', label, String(expected), async () => {
    expect.soft(actual).toBe(expected);
  });
}

/**
 * Assert with screenshot — always captures screenshot on success.
 * Useful for audit-ready evidence in Allure reports.
 */
export async function assertWithScreenshot(
  page: Page,
  actual: string,
  expected: string,
  label = 'Text Comparison',
): Promise<void> {
  await assertTextEqualsDirectly(page, actual, expected, label, true);
}
