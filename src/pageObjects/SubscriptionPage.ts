import { expect, Locator, Page } from '@playwright/test';

export class SubscriptionPage {
    readonly page: Page;
    readonly chooseYourPlanHeading: Locator;
    readonly plusPlan: Locator;
    readonly superPlan: Locator;
    readonly buyNowButton: Locator;
    readonly couponSection: Locator;
    readonly termsOfUse: Locator;
    readonly privacyPolicy: Locator;

    constructor(page: Page) {
        this.page = page;
       
        this.chooseYourPlanHeading = page.getByText(/your subscription is active|20 OTTs,\s*one subscription/i)
        this.plusPlan = page.getByText('ViMTV Plus', { exact: true }).first();
        this.superPlan = page.getByText('ViMTV Super', { exact: true }).first();
        this.buyNowButton = page.getByRole('button', { name: 'Buy Now' }).first();
        this.couponSection = page.getByText(/coupon/i).first();
        this.termsOfUse = page.getByText('Terms of Use', { exact: true }).first();
        this.privacyPolicy = page.getByText('Privacy Policy', { exact: true }).first();
    }

    async verifySubscriptionPageDisplayed(): Promise<void> {
        await expect(this.chooseYourPlanHeading).toBeVisible({ timeout: 20000 });
    }

   async verifyPlanDisplayed(planName: string): Promise<Locator> {
    const planNamePattern =
        planName === 'FIFA WC ‘26 + Z5 All Access'
            ? /FIFA WC\s*[‘’']26\s*\+\s*Z5 All Access/i
            : new RegExp(`^${planName}$`, 'i');

    const planHeading = this.page
        .locator('h5')
        .filter({ hasText: planNamePattern })
        .first();

    await expect(
        planHeading,
        `${planName} should be displayed`
    ).toBeVisible({ timeout: 15000 });

    return planHeading.locator(
        'xpath=ancestor::*[self::div or self::section or self::article][.//*[contains(normalize-space(), "₹")]][1]'
    );
}

async verifyPlanPrice(
    planName: string,
    price: string,
    duration?: string
): Promise<void> {
    const planNameLocator = this.page
        .getByText(planName, { exact: false })
        .first();

    await expect(
        planNameLocator,
        `${planName} should be displayed`
    ).toBeVisible({ timeout: 15000 });

    const numericPrice = price.replace(/\D/g, '');
    const pricePattern = new RegExp(`₹\\s*${numericPrice}`);

    const priceLocator = this.page
        .getByText(pricePattern)
        .first();

    await expect(
        priceLocator,
        `${price} should be displayed for ${planName}`
    ).toBeVisible({ timeout: 15000 });

    if (duration) {
        const durationLocator = this.page
            .getByText(duration, { exact: false })
            .first();

        await expect(
            durationLocator,
            `${duration} should be displayed for ${planName}`
        ).toBeVisible({ timeout: 15000 });
    }
}
async verifyPlanOptionsDisplayed(): Promise<void> {
    const planOption = this.page.getByText(
        /^(ViMTV Plus|ViMTV Super|FIFA WC\s*[‘’']26\s*\+\s*Z5 All Access)$/i
    ).first();

    await expect(
        planOption,
        'ViMTV Plus, ViMTV Super, or FIFA plan should be displayed'
    ).toBeVisible({ timeout: 15000 });
}

    async verifySubscriptionPageDetails(): Promise<void> {
        await expect(this.buyNowButton).toBeVisible();
        await expect(this.couponSection).toBeVisible();
        await expect(this.termsOfUse).toBeVisible();
        await expect(this.privacyPolicy).toBeVisible();
    }

    async verifyActivePlanDisplayed(): Promise<void> {
    const activePlanStatus = this.page
        .locator('p')
        .filter({ hasText: /^active plan$/i })
        .first();

    await expect(
        activePlanStatus,
        'Active plan status should be displayed'
    ).toBeVisible({ timeout: 15000 });
}
}