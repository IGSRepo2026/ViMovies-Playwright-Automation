import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    readonly profileIcon: Locator;
    readonly exitProfileOption: Locator;
    readonly whosWatchingHeading: Locator;
    readonly profileAvatars: Locator;
    readonly mobileNumberInput: Locator;
    readonly getOtpButton: Locator;
    readonly signInButton: Locator;
    readonly myBingelist: Locator;
    readonly bingelistPopup: Locator;
    readonly otpInputs: Locator;
    readonly otpRequestLimitMessage: Locator;
    readonly submitButton: Locator;
    readonly homeTab: Locator;
    readonly searchIcon: Locator;
    readonly searchInput: Locator;
    readonly searchResult: Locator;
    readonly watchNowButton: Locator;
    readonly partnerIcon: Locator;
    readonly contentTitle: Locator;
    readonly contentSubtitle: Locator;
    readonly shareButton: Locator;
    readonly youMayAlsoLike: Locator;

    // Blocker screen locators
    readonly missingOutText: Locator;
    readonly purchaseMessage: Locator;
    readonly explorePlans: Locator;
    readonly monthlyPrice: Locator;
    readonly subscribeNetworks: Locator;
    readonly addToViPostpaidBill: Locator;
    readonly deviceLimitScreen: Locator;
    readonly removeButton: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Login
        this.profileIcon = page.locator(
            'img[alt="profile_icon"]'
        );
        this.exitProfileOption = page.getByText('Exit Profile', {
            exact: true,
        });
        this.whosWatchingHeading = page.getByText(/who['’]s watching\s*\?/i);
        this.profileAvatars = page.locator(
            'img[alt]:visible:not([alt="profile_lock"]):not([alt="add_profile_icon"])'
        );
        this.mobileNumberInput = page.locator('#number');
        this.getOtpButton = page.locator('#verifyOtp');
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
        this.otpInputs = page.getByRole('textbox', {
            name: /Please enter OTP character \d+/,
        });
        this.otpRequestLimitMessage = page.getByText(
            /OTP Request limit exceeded/i
        );
        this.submitButton = page.getByRole('button', { name: 'Submit' });

        // Navigation
        this.homeTab = page.getByRole('button', { name: 'Home' });
        this.searchIcon = page.getByAltText('search_icon');

        // Search
        this.searchInput = page.locator(
            'input[placeholder="Search channels, movies & TV shows"]'
        );
        this.searchResult = page
            .locator('.search_search_header__pa73X')
            .first();

        // Content details
        this.watchNowButton = page
            .getByRole('button', { name: 'Watch Now' })
            .first();

        this.partnerIcon = page.locator('img[alt="partner_icon"]');
        this.contentTitle = page.locator('.details_main_title__soxJM');
        this.contentSubtitle = page.locator('.details_subtitle__KiE0E');

        this.myBingelist = page.getByRole('button', { name: 'like_iconMy Bingelist'});
        this.bingelistPopup = page.getByText(
    'To add this content to Bingelist',
    { exact: true }
);

        this.shareButton = page
            .locator('button img[alt="share"]')
            .first();

        this.youMayAlsoLike = page.getByText('You May Also Like');

        // Blocker screen
        this.missingOutText = page.getByText('You’re missing out!');

        this.purchaseMessage = page.getByText(
            'Purchase now to start watching this content. Please Note Renewal of existing Vi MTV plan, if any will be cancelled.'
        );

        this.explorePlans = page.locator(
            '.subscriptionpending_explore_plans__PIpAp'
        );

        this.monthlyPrice = page.getByText('₹ 248.0 / month');

        //Remove button and logout button for device limit screen
        this.deviceLimitScreen = this.page.getByRole('heading', {name: 'Device Limit Reached'});
        this.removeButton = this.page.getByRole('button', { name: 'Remove' }).first();
        this.logoutButton = this.page.getByRole('button', { name: 'Log Out' });

        this.subscribeNetworks = page.locator(
            '.subscriptionpending_subscribe_networks__hvDlE'
        );

        this.addToViPostpaidBill = page.getByRole('button', {
            name: 'Add to Vi Postpaid Bill',
        });
    }

    // =========================
    // Login Actions
    // =========================

  async clickProfileIcon() {
      await expect(this.profileIcon).toBeVisible({ timeout: 15000 });
      await this.profileIcon.click({ force: true, timeout: 10000 });
    }

    async verifyExitProfileOptionVisible(): Promise<void> {
        await expect(
            this.exitProfileOption,
            'Profile menu should display the Exit Profile option'
        ).toBeVisible({ timeout: 15000 });
    }

    async clickExitProfile(): Promise<void> {
        await this.exitProfileOption.click();
    }

    async verifyWhosWatchingScreen(): Promise<void> {
        await expect(
            this.whosWatchingHeading,
            'Who’s Watching screen should be displayed'
        ).toBeVisible({ timeout: 20000 });
    }

    async verifyProfilesAreVisible(): Promise<void> {
        await expect
            .poll(() => this.profileAvatars.count(), {
                message: 'Available profiles should be visible for selection',
                timeout: 15000,
            })
            .toBeGreaterThan(0);
    }

    async verifyAllProfilesHaveNames(): Promise<void> {
        const profileCount = await this.profileAvatars.count();

        for (let index = 0; index < profileCount; index += 1) {
            const profileAvatar = this.profileAvatars.nth(index);
            const profileName = (await profileAvatar.getAttribute('alt'))?.trim();

            if (!profileName || ['profile_lock', 'add_profile_icon'].includes(profileName)) {
                continue;
            }

            await expect(
                profileAvatar,
                `Profile ${index + 1} avatar should be visible`
            ).toBeVisible();

            expect(
                profileName,
                `Profile ${index + 1} should have a visible name`
            ).toBeTruthy();

            await expect(
                this.page.getByText(profileName!, { exact: true }),
                `Profile ${index + 1} name should be visible`
            ).toBeVisible();
        }
    }

   async enterMobileNumber(mobileNumber?: string) {
    mobileNumber = mobileNumber || process.env.MOBILE_NUMBER!;

    await this.mobileNumberInput.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await this.mobileNumberInput.fill(mobileNumber);

    try {
        await expect(this.mobileNumberInput).toHaveValue(mobileNumber, {
            timeout: 2000,
        });
    } catch {
        await expect(
            this.otpInputs.first(),
            'Mobile number entry should advance to OTP verification'
        ).toBeVisible({ timeout: 15000 });
    }
}

    async clickGetOtp() {
        const otpInput = this.otpInputs.first();
        const otpPrompt = this.page.getByText(
            'Enter the OTP you received and login.',
            { exact: true }
        );
        const otpHeading = this.page.getByRole('heading', {
            name: /^(Verify Number|Almost Done!)$/i,
        });
        const getLoginStep = async () => {
            if (
                (await otpInput.isVisible().catch(() => false)) ||
                (await otpPrompt.isVisible().catch(() => false)) ||
                (await otpHeading.isVisible().catch(() => false))
            ) {
                return 'enter-otp';
            }
            if (await this.otpRequestLimitMessage.first().isVisible()) {
                return 'rate-limited';
            }
            if (await this.getOtpButton.isVisible()) {
                return 'request-otp';
            }
            return 'loading';
        };

        await expect
            .poll(
                getLoginStep,
                {
                    message: 'Login should reach OTP entry or show an OTP request limit',
                    timeout: 15000,
                    intervals: [250, 500, 1000],
                }
            )
            .toMatch(/^(enter-otp|request-otp|rate-limited)$/);

        let loginStep = await getLoginStep();
        if (loginStep === 'rate-limited') {
            throw new Error(
                'OTP request limit exceeded. Wait for the service cooldown or use a test account with available OTP requests.'
            );
        }

        if (loginStep === 'request-otp') {
            try {
                await this.getOtpButton.click({ timeout: 5000 });
            } catch (error) {
                loginStep = await getLoginStep();

                if (loginStep === 'enter-otp') {
                    return;
                }

                if (loginStep === 'rate-limited') {
                    throw new Error(
                        'OTP request limit exceeded. Wait for the service cooldown or use a test account with available OTP requests.'
                    );
                }

                throw error;
            }

            await expect
                .poll(getLoginStep, {
                    message: 'OTP request should open OTP entry or report a request limit',
                    timeout: 15000,
                    intervals: [250, 500, 1000],
                })
                .toMatch(/^(enter-otp|rate-limited)$/);

            loginStep = await getLoginStep();
            if (loginStep === 'rate-limited') {
                throw new Error(
                    'OTP request limit exceeded. Wait for the service cooldown or use a test account with available OTP requests.'
                );
            }
        }

        await expect(
            otpInput,
            'OTP entry form should appear after requesting an OTP'
        ).toBeVisible({ timeout: 15000 });
    }

    async enterOtp(otp?: string) {
     otp = otp || process.env.OTP!;

    for (let i = 0; i < otp.length; i++) {
        await this.otpInputs.nth(i).fill(otp[i]);
    }
}

    async clickOnSubmitButton() {
        await this.submitButton.click();
    }

    async login() {
        await this.clickProfileIcon();
        await this.enterMobileNumber();
        await this.clickGetOtp();
        await this.enterOtp();
        await this.clickOnSubmitButton();
        await this.handleDeviceLimitIfDisplayed();
    }

     async Sublogin() {
        await this.enterMobileNumber();
        await this.clickGetOtp();
        await this.enterOtp();
        await this.clickOnSubmitButton();
        await this.handleDeviceLimitIfDisplayed();
    }
    
async loginAsNonSubscribedUser(): Promise<void> {
  const mobileNumber = process.env.NON_SUBSCRIBED_MOBILE_NUMBER?.trim();
  const otp = process.env.NON_SUBSCRIBED_OTP?.trim();

  if (!mobileNumber || !otp) {
    throw new Error(
      'NON_SUBSCRIBED_MOBILE_NUMBER and NON_SUBSCRIBED_OTP must be configured in .env',
    );
  }

  await this.clickProfileIcon();
  await this.enterMobileNumber(mobileNumber);
  await this.clickGetOtp();
  await this.enterOtp(otp);
  await this.clickOnSubmitButton();

  const expiredDeviceLogoutMessage = this.page.getByText(
    /allott?ed time for logging out another device has expired/i,
  );
  let deviceLogoutExpired = false;

  try {
    await expiredDeviceLogoutMessage.waitFor({
      state: 'visible',
      timeout: 5000,
    });
    deviceLogoutExpired = true;
  } catch (error) {
    if (!(error instanceof Error) || error.name !== 'TimeoutError') {
      throw error;
    }
  }

  if (deviceLogoutExpired) {
    await this.page
      .getByRole('button', { name: /login with different number/i })
      .click();
    await this.enterMobileNumber(mobileNumber);
    await this.clickGetOtp();
    await this.enterOtp(otp);
    await this.clickOnSubmitButton();
    await expect(expiredDeviceLogoutMessage).toBeHidden({ timeout: 15000 });
  }

  await this.handleDeviceLimitIfDisplayed();
}
    // =========================
    // Navigation Actions
    // =========================

    async clickHomeTab() {
        await this.homeTab.click();
    }

    // =========================
    // Search Actions
    // =========================

    async clickOnSearchIcon() {
        await this.searchIcon.click();
    }

    async searchContent(content: string) {
        await this.searchInput.fill(content);

        await expect(this.searchResult).toBeVisible({
            timeout: 10000,
        });
    }

    async clickOnSearchResult() {
        await expect(this.searchResult).toBeVisible({
            timeout: 10000,
        });

        await this.searchResult.click();
    }

    async searchAndOpenContent(content: string) {
        await this.clickOnSearchIcon();
        await this.searchContent(content);
        await this.clickOnSearchResult();
    }

   async clickOnWatchNowButton(): Promise<void> {
  const watchNowButton = this.page
    .getByRole('button', { name: /^watch now$/i })
    .filter({ visible: true })
    .first();

  await watchNowButton.scrollIntoViewIfNeeded();
  await expect(watchNowButton).toBeVisible({ timeout: 15_000 });
  await watchNowButton.click({ force: true });
}


    async clickSignInButton() {
        await expect(this.signInButton).toBeVisible({
            timeout: 15000,
        });

        await this.signInButton.click();
    }

async clickMyBingeList() {
    await expect(this.myBingelist).toBeVisible({
        timeout: 20000,
    });

    await this.myBingelist.click();
}

    async verifyBingeListPopup() {
    await expect(this.bingelistPopup).toBeVisible({
        timeout: 10000,
    });
}

    async verifyLoginFlowDisplayed() {
        await expect(this.mobileNumberInput).toBeVisible({
            timeout: 15000,
        });
    }

    // =========================
    // Content Details Validation
    // =========================

    async verifyContentDetails() {
        await expect(this.partnerIcon).toBeVisible({
            timeout: 20000,
        });

        await expect(this.contentTitle).toBeVisible({
            timeout: 20000,
        });

        await expect(this.contentSubtitle).toBeVisible({
            timeout: 10000,
        });

        await expect(this.watchNowButton).toBeVisible({
            timeout: 10000,
        });

        await expect(this.myBingelist).toBeVisible({
            timeout: 10000,
        });

        await expect(this.shareButton).toBeVisible({
            timeout: 10000,
        });

        await expect(this.youMayAlsoLike).toBeVisible({
            timeout: 10000,
        });
    }

    // =========================
    // Blocker Screen Validation
    // =========================

    async validateBlockerScreen() {
        await expect(this.missingOutText).toBeVisible();

        await expect(this.purchaseMessage).toBeVisible();

        await expect(this.explorePlans).toBeVisible();

        await expect(this.monthlyPrice).toBeVisible();

        await expect(this.subscribeNetworks).toBeVisible();

        await expect(this.addToViPostpaidBill).toBeVisible();
    }

    //Remove device limit
   async handleDeviceLimitIfDisplayed(): Promise<void> {
    try {
        await this.removeButton.waitFor({
            state: 'visible',
            timeout: 10000
        });

        await this.removeButton.click();

        await this.logoutButton.waitFor({
            state: 'visible',
            timeout: 10000
        });

        await this.logoutButton.click();
    } catch {
        // Device limit screen did not appear
        console.log('Device limit screen not displayed, proceeding with login.');
    }
   }
   
}