# ViMTV Complete Test Case Flow

## Pre-request: Verify Successful Website Launch

### Step 1: Navigate to the URL
- Launch the ViMTV website using the provided URL.

### Expected Result
- The ViMTV website launches successfully.
- The Home page is displayed without any errors.
- The page loads successfully.

---

# Onboarding / Login

# Test Case 1: Verify User Redirection to Home Screen

### Pre-requisite
- ViMTV website is accessible.

### Step 1
- Launch the ViMTV website.

### Expected Result
- Guest, subscribed user, and non-subscribed user are redirected to the Home screen after launching the URL.

### Validation
- Home page is displayed successfully for the applicable user states.

---

# Test Case 2: Verify Non-Subscriber User State

### Pre-requisite
- User has successfully launched the ViMTV website.

### Step 1
- Access ViMTV as a non-subscriber.

### Expected Result
- The user is recognized as a non-subscriber.
- Non-subscriber state is displayed correctly.

---

# Test Case 3: Verify Login as Vi Subscriber

### Pre-requisite
- User is on the ViMTV website.
- Valid Vi subscriber credentials are available.

### Step 1
- Log in using the Vi subscriber mobile number.

### Expected Result
- User is logged in successfully as a Vi subscriber.
- Subscriber state is displayed correctly.

---

# Test Case 4: Verify Login as Non-Vi Non-Subscriber User

### Pre-requisite
- User is on the ViMTV website.
- Valid non-Vi/non-subscriber mobile number is available.

### Step 1
- Log in using the non-Vi non-subscriber mobile number.

### Expected Result
- User is logged in successfully.
- User is identified as a non-Vi non-subscriber.

---

# Test Case 5: Verify Mobile Number Login from Different Entry Points

### Pre-requisite
- User is in a logged-out state.
- Valid mobile number is available.

### Step 1
- Initiate mobile number login from the Hamburger Menu.

### Expected Result
- Login flow is displayed successfully.

### Step 2
- Initiate mobile number login from the Subscribe icon on the Home page.

### Expected Result
- Login flow is displayed successfully.

### Step 3
- Initiate mobile number login from the Subscribe icon in the Hamburger Menu.

### Expected Result
- Login flow is displayed successfully.

### Step 4
- Tap the Watch Now CTA in the Carousel.

### Expected Result
- User is prompted to log in as applicable.

### Step 5
- Tap any asset in landing/grid view.

### Expected Result
- User is prompted to log in as applicable.

### Step 6
- Tap the BingeList tab.

### Expected Result
- User is prompted to log in as applicable.

### Validation
- Mobile number login is available from all configured entry points.

---

# Test Case 6: Verify BingeList Login Toast Message

### Pre-requisite
- User is logged out.
- User is on a screen containing the BingeList icon in the Carousel.

### Step 1
- Tap the BingeList icon in the Carousel.

### Expected Result
- Toast message `"Please sign in to view MyBingelist"` is displayed.

---

---

# Subscription

# Test Case 8: Verify All Plans are Displayed

### Pre-requisite
- User is able to access the Subscription page.

### Step 1
- Navigate to the Subscription page.

### Expected Result
- All available plans are displayed.
- Plan information is visible correctly.

---

# Test Case 9: Verify User Can Purchase Available Packs

### Pre-requisite
- User is on the Subscription page.
- Available packs are displayed.

### Step 1
- Select an available pack.

### Expected Result
- Selected pack details are displayed.

### Step 2
- Complete the purchase flow.

### Expected Result
- The selected pack is purchased successfully.

---

# Test Case 10: Verify Content Playback After Purchasing a Pack

### Pre-requisite
- User has successfully purchased a pack.

### Step 1
- Play available Shows.

### Expected Result
- Shows are played successfully.

### Step 2
- Play available Movies.

### Expected Result
- Movies are played successfully.

### Step 3
- Play available Linear media.

### Expected Result
- Linear media is played successfully.

---

# Test Case 11: Verify Plan Details After Purchase

### Pre-requisite
- User has successfully purchased a pack.

### Step 1
- Navigate to the Plans & Offer page.

### Expected Result
- Purchased plan details are displayed.

---

# Test Case 12: Verify Navigation to Subscription Page

### Pre-requisite
- User is on ViMTV.

### Step 1
- Navigate to Subscription from the Hamburger Menu.

### Expected Result
- Subscription page is displayed.

### Step 2
- Navigate to Subscription using the Subscribe icon.

### Expected Result
- Subscription page is displayed.

### Step 3
- Tap the Watch Now CTA.

### Expected Result
- User is navigated to the applicable Subscription page.

### Step 4
- Tap the Subscribe banner.

### Expected Result
- Subscription page is displayed.

---

# Detail Screen

# Test Case 13: Verify Navigation to Detail Screen

### Pre-requisite
- User is logged in.

### Step 1
- Tap any Show/Movie thumbnail from a rail, masthead, or carousel.

### Expected Result
- User is navigated to the corresponding detail screen.

---

# Test Case 14: Verify Movie Detail Screen for Non-Subscribed User

### Pre-requisite
- User is a non-subscribed user.
- Movie content is available.

### Step 1
- Open a Movie detail screen.

### Expected Result
- Movie detail screen is displayed correctly for the non-subscribed user.

---

# Test Case 15: Verify Show Detail Screen for Non-Subscribed User

### Pre-requisite
- User is a non-subscribed user.
- Show content is available.

### Step 1
- Open a Show detail screen.

### Expected Result
- Show detail screen is displayed correctly for the non-subscribed user.

---

# Test Case 16: Verify LIVE Detail Screen

### Pre-requisite
- LIVE content is available.

### Step 1
- Open the detail screen of LIVE content.

### Expected Result
- LIVE detail screen is displayed correctly.

---

# Test Case 17: Verify Trailer Playback on Detail Page

### Pre-requisite
- Content with a trailer is available.

### Step 1
- Open the content detail page.

### Step 2
- Play the trailer.

### Expected Result
- Trailer playback starts successfully.

---

# Test Case 18: Verify Grouping for Single-Season Shows

### Pre-requisite
- A show with one season is available.

### Step 1
- Open the Show detail screen.

### Expected Result
- Grouping is available for the show.

### Validation
- Grouping is available only for shows with one season.

---

# Test Case 19: Verify Grouping Contains 100 Episodes

### Pre-requisite
- A show with applicable grouping is available.

### Step 1
- Open the grouping.

### Expected Result
- The grouping consists of 100 episodes.
- The latest episode is included.

---

# Test Case 20: Verify Latest Episode and Seasons Availability

### Pre-requisite
- A show with multiple seasons is available.

### Step 1
- Open the Show detail screen.

### Expected Result
- The latest episode is available first.
- Seasons are available first as configured.

---

# Player

# Test Case 21: Validate Player Controls During Playback

### Pre-requisite
- Playable content is available.

### Step 1
- Start content playback.

### Expected Result
- Player controls are displayed and functional during playback.

---

# Test Case 22: Validate 10-Second Forward/Backward Buttons

### Pre-requisite
- Content is playing.

### Step 1
- Verify the 10-second forward button.

### Expected Result
- 10-second forward button is available.

### Step 2
- Verify the 10-second backward button.

### Expected Result
- 10-second backward button is available.

---

# Test Case 23: Validate 10-Second Forward Functionality

### Pre-requisite
- Content is playing.

### Step 1
- Tap the 10-second forward button.

### Expected Result
- Content jumps 10 seconds forward.

---

# Test Case 24: Validate 10-Second Backward Functionality

### Pre-requisite
- Content is playing.

### Step 1
- Tap the 10-second backward button.

### Expected Result
- Content jumps 10 seconds backward.

---

# Test Case 25: Validate Play/Pause Functionality

### Pre-requisite
- Content is playing.

### Step 1
- Tap Pause.

### Expected Result
- Playback pauses.

### Step 2
- Tap Play.

### Expected Result
- Playback resumes.

---

# Test Case 26: Validate Progress Bar Functionality

### Pre-requisite
- Content is playing.

### Step 1
- Observe the progress bar during playback.

### Expected Result
- Progress bar is displayed.
- Progress updates according to playback.

---

# Test Case 27: Validate Seek Functionality

### Pre-requisite
- Content is playing.

### Step 1
- Seek to another position using the progress bar.

### Expected Result
- Playback moves to the selected position.

---

# Test Case 28: Validate LIVE Icon

### Pre-requisite
- LIVE streaming content is available.

### Step 1
- Start LIVE content playback.

### Expected Result
- LIVE icon is displayed.

---

# Test Case 29: Validate Go Live CTA

### Pre-requisite
- LIVE content is playing.

### Step 1
- Seek backward from the live position.

### Expected Result
- Go Live CTA is displayed.

---

# Test Case 30: Validate Settings Option

### Pre-requisite
- Content is playing.

### Step 1
- Open Player Settings.

### Expected Result
- Settings option is available.

---

# Test Case 31: Validate Subtitle Option

### Pre-requisite
- Player Settings are available.

### Step 1
- Open Settings.

### Expected Result
- Subtitle option is displayed.

---

# Test Case 32: Validate Audio Option

### Pre-requisite
- Player Settings are available.

### Step 1
- Open Settings.

### Expected Result
- Audio option is displayed.

---

# Test Case 33: Validate Quality Option

### Pre-requisite
- Player Settings are available.

### Step 1
- Open Settings.

### Expected Result
- Quality option is displayed.

---

# Test Case 34: Validate Next Content Auto-Play

### Pre-requisite
- Content with next content configured is available.

### Step 1
- Play the first content until completion.

### Expected Result
- Next content auto-plays after the first content.

---

# Test Case 35: Validate Episode Auto-Play

### Pre-requisite
- An episodic show is available.

### Step 1
- Play an episode until completion.

### Expected Result
- Next episode auto-plays.

---

# Test Case 36: Validate Up Next Card

### Pre-requisite
- Content with next content configured is playing.

### Step 1
- Continue playback until the last 5 seconds.

### Expected Result
- Up Next card is displayed during the last 5 seconds.

---

# Test Case 37: Validate Episode Selection

### Pre-requisite
- Episodes List is available.

### Step 1
- Open the Episodes List.

### Step 2
- Select an episode.

### Expected Result
- Selected episode is played.

---

# Test Case 38: Validate Episodes List Scrolling

### Pre-requisite
- Episodes List contains multiple episodes.

### Step 1
- Scroll through the Episodes List.

### Expected Result
- Episodes List scrolls successfully.
- Available episodes can be viewed.

---

# Test Case 39: Validate Up Next Playback

### Pre-requisite
- Up Next content is configured.

### Step 1
- Play the first content until it ends.

### Expected Result
- Up Next playback starts after the first content ends.

---

# Test Case 40: Validate Up Next Card Selection

### Pre-requisite
- Up Next card is displayed.

### Step 1
- Tap the Up Next card.

### Expected Result
- Up Next card closes.
- Next episode starts playing.

---

# Test Case 41: Validate Automatic Next Content Start

### Pre-requisite
- Up Next card is displayed.

### Step 1
- Take no action on the Up Next card.

### Expected Result
- Next content starts automatically.

---

# Test Case 42: Validate Video Quality from App Settings

### Pre-requisite
- Video Quality is configured in App Settings.
- Playable content is available.

### Step 1
- Select a Video Quality in App Settings.

### Step 2
- Start content playback.

### Expected Result
- Selected Video Quality is reflected on the player.

---

# Test Case 43: Validate Subtitle Remembrance

### Pre-requisite
- Subtitle options are available.

### Step 1
- Select a subtitle preference.

### Step 2
- Play applicable content again.

### Expected Result
- Subtitle preference is remembered.

---

# Test Case 44: Validate Language Remembrance

### Pre-requisite
- Multiple language options are available.

### Step 1
- Select a language preference.

### Step 2
- Play applicable content again.

### Expected Result
- Language preference is remembered.

---

# Playback

# Test Case 45: Verify Free Content Playback

### Pre-requisite
- Free content from Hangama or Shemaroo is available.

### Step 1
- Select free content.

### Step 2
- Start playback.

### Expected Result
- Free content plays successfully.

---

# Test Case 46: Verify Premium Content Playback

### Pre-requisite
- User has access to premium content.
- Premium content from applicable partner apps is available.

### Step 1
- Select a premium Show/Episode or Movie.

### Step 2
- Start playback.

### Expected Result
- Premium content plays successfully.
- Applicable partner content such as SonyLIV and Manorama Max is playable.

---

# Landing Screens

# Test Case 47: Verify ViMTV and Subscribe/Premium Logos

### Pre-requisite
- User is on a landing screen.

### Step 1
- Observe the Vi Movies & TV Logo and Subscribe/Premium Logo.

### Expected Result
- Vi Movies & TV Logo remains constant.
- Subscribe/Premium Logo remains constant.

---

# Test Case 48: Verify Landing Screen Tab Menu

### Pre-requisite
- User is on a landing screen.

### Step 1
- Verify the tab menu.

### Expected Result
- Landing screen tabs are displayed as per VD.

---

# Test Case 49: Verify Selected Tab Highlight

### Pre-requisite
- Landing screen contains multiple tabs.

### Step 1
- Select a tab.

### Expected Result
- Selected tab is highlighted in yellow.

---

# Test Case 50: Verify Feature Carousel on Home

### Pre-requisite
- User is on the Home page.

### Step 1
- Observe the Home page.

### Expected Result
- Feature carousel is available on Home.

---

# Test Case 51: Verify Content Partner Logos

### Pre-requisite
- Content thumbnails are displayed.

### Step 1
- Observe content thumbnails.

### Expected Result
- Content Partner Logos are displayed on thumbnails.

---

# Test Case 52: Verify Carousel/Banner Rotation

### Pre-requisite
- Masthead Carousel/Mid-page Banners are configured.

### Step 1
- Observe the Carousel/Mid-page Banners.

### Expected Result
- Banners rotate at the configured fixed interval.

---

# Test Case 53: Verify Manual Banner Swipe

### Pre-requisite
- Multiple banners are available.

### Step 1
- Swipe the banner manually.

### Expected Result
- Banner changes successfully.
- The next/previous configured banner is displayed.

---

# Test Case 54: Verify Grid View/View All Page

### Pre-requisite
- A rail configured for Grid View/View All is available.

### Step 1
- Open the Grid View/View All page for the configured rail.

### Expected Result
- Grid View/View All page is displayed.
- Configured rail content is displayed.

---

# Test Case 55: Verify Carousel Banner Navigation

### Pre-requisite
- Carousel banner is displayed.

### Step 1
- Tap a carousel banner.

### Expected Result
- User is navigated to the respective content screen.

---

# Continue Watching

# Test Case 56: Verify Continue Watching Rail for Logged-In User

### Pre-requisite
- User is logged in.
- User has partially watched content.

### Step 1
- Navigate to the applicable landing screen.

### Expected Result
- Continue Watching rail is displayed.
- Partially watched content is available in the rail.

---

# Test Case 57: Verify Continue Watching Rail is Not Available for Guest

### Pre-requisite
- User is a Guest.
- User is on the applicable landing screen.

### Step 1
- Observe the landing screen.

### Expected Result
- Continue Watching rail is NOT available for Guest.

---

# Test Case 58: Verify Partially Watched Content is Added to CW Rail

### Pre-requisite
- User is logged in.
- Playable content is available.

### Step 1
- Start watching content.

### Step 2
- Stop before the content is fully watched.

### Expected Result
- Partially watched content is added to the Continue Watching rail.

---

# Test Case 59: Verify Navigation from Continue Watching

### Pre-requisite
- Continue Watching rail contains content.

### Step 1
- Tap an asset in the Continue Watching rail.

### Expected Result
- User is navigated to the applicable content/player screen.

---

# Test Case 60: Verify Latest Watched Episode

### Pre-requisite
- A show has multiple watched episodes.

### Step 1
- Observe the Continue Watching rail.

### Expected Result
- Only the latest watched episode is displayed.

---

# Test Case 61: Verify Continue Watching Progress Bar

### Pre-requisite
- Partially watched content is available in Continue Watching.

### Step 1
- Observe the content progress.

### Expected Result
- Progress bar updates accordingly.

---

# Test Case 62: Verify Completed Content Removal

### Pre-requisite
- Content is available in Continue Watching.

### Step 1
- Watch the content until 100% completion.

### Expected Result
- 100% watched content is removed from the Continue Watching rail.

---

# BingeList

# Test Case 63: Verify Content is Added to BingeList

### Pre-requisite
- User is logged in.
- Content is available.

### Step 1
- Add content to BingeList.

### Expected Result
- Content is added successfully to BingeList.

---

# Test Case 64: Verify BingeListed Content is Displayed

### Pre-requisite
- Content has been added to BingeList.

### Step 1
- Navigate to the BingeList page.

### Expected Result
- BingeListed content is displayed.

---

# Test Case 65: Verify Content Removal from BingeList

### Pre-requisite
- BingeList contains content.

### Step 1
- Remove content from BingeList.

### Expected Result
- Content is removed successfully.

---

# Test Case 66: Verify Playback from BingeList

### Pre-requisite
- BingeList contains playable content.

### Step 1
- Select content from BingeList.

### Expected Result
- Selected content starts playing successfully.

---

# Test Case 67: Verify BingeList Toast Message

### Pre-requisite
- User is logged in.
- Content is available.

### Step 1
- Add content to BingeList.

### Expected Result
- Appropriate toast message is displayed after adding content.

### Step 2
- Remove content from BingeList.

### Expected Result
- Appropriate toast message is displayed after removing content.

---

# Navigation / Hamburger Menu

# Test Case 68: Verify Navigation Across Main Tabs

### Pre-requisite
- User has successfully launched ViMTV.

### Step 1
- Navigate to Home.

### Expected Result
- Home page is displayed.

### Step 2
- Navigate to Web Series.

### Expected Result
- Web Series page is displayed.

### Step 3
- Navigate to Sports.

### Expected Result
- Sports page is displayed.

### Step 4
- Navigate to BingeList.

### Expected Result
- BingeList page is displayed according to user state.

### Step 5
- Navigate to Search.

### Expected Result
- Search page is displayed.

---

# Test Case 69: Verify Configured Content Partners

### Pre-requisite
- User is on ViMTV.
- Content Partners are configured.

### Step 1
- Navigate through the applicable content areas.

### Expected Result
- Configured Content Partners are available.

---

# Test Case 70: Verify Hamburger Menu Options by User State

### Pre-requisite
- ViMTV is accessible.

### Step 1
- Open the Hamburger Menu.

### Expected Result
- Hamburger Menu options are displayed according to the current user state.

---

# Test Case 71: Verify Thumbnail/Image Aspect Ratio

### Pre-requisite
- Content thumbnails/images are displayed.

### Step 1
- Observe thumbnails/images across the application.

### Expected Result
- Thumbnail/image aspect ratios are consistent.
- No incorrect image stretching or distortion is observed.

---

# Test Case 72: Verify Back Navigation

### Pre-requisite
- User has navigated away from the initial screen.

### Step 1
- Navigate to another screen.

### Step 2
- Use the Back navigation.

### Expected Result
- User is navigated to the previous screen correctly.
- Back navigation works throughout the application.

---



# Notifications / Active Screens / Error

# Test Case 75: Verify Notifications in App Settings

### Pre-requisite
- User is able to access App Settings.

### Step 1
- Open App Settings.

### Step 2
- Open Notifications.

### Expected Result
- Notifications option is available.
- Notifications functionality works as configured.

---

# Test Case 76: Verify Logged-In Devices on Active Screen

### Pre-requisite
- User is logged in on multiple devices.

### Step 1
- Open the Active screen.

### Expected Result
- All logged-in devices are displayed.

---



# Test Case 78: Verify Network Error Message

### Pre-requisite
- ViMTV application is accessible.
- Network interruption can be simulated.

### Step 1
- Trigger a network interruption while using the application.

### Expected Result
- Network error message is displayed appropriately.
- Network error handling works throughout the application.

---

# Search

# Test Case 79: Verify Search Results After Entering 2nd Character

### Pre-requisite
- User is on the Search page.

### Step 1
- Enter two characters into the Search field.

### Expected Result
- Search results are displayed after entering the second character.
- Results are relevant to the entered search keyword.

---

# Test Case 80: Verify Search Filters

### Pre-requisite
- User is on the Search page.
- Search results are displayed.

### Step 1
- Verify the available search filters.

### Expected Result
- Search filters are displayed and functional.
- Applicable filters can be selected successfully.

---

# Test Case 81: Verify Error Message for Invalid Character

### Pre-requisite
- User is on the Search page.

### Step 1
- Enter an invalid character in the Search field.

### Expected Result
- Appropriate error message is displayed.

---

# Test Case 82: Verify Navigation and Content Playback from Search Page

### Pre-requisite
- User is on the Search page.
- Search results are displayed.

### Step 1
- Select a search result.

### Expected Result
- User is navigated to the applicable content screen.

### Step 2
- Start playback of the selected content.

### Expected Result
- Selected content plays successfully.

---

# GYFTR

# Test Case 83: Verify Activate Offer Tab

### Pre-requisite
- User is able to access the Hamburger Menu.

### Step 1
- Open the Hamburger Menu.

### Expected Result
- Activate Offer tab is available.

---

# Test Case 84: Verify Redemption of Valid Coupon

### Pre-requisite
- User has a valid coupon code.
- Activate Offer tab is available.

### Step 1
- Navigate to Activate Offer.

### Step 2
- Enter a valid coupon code.

### Step 3
- Redeem the coupon.

### Expected Result
- Valid coupon is redeemed successfully.

---

# Test Case 85: Verify Invalid Coupon Error Message

### Pre-requisite
- Activate Offer tab is available.

### Step 1
- Enter an invalid coupon code.

### Step 2
- Attempt to redeem the coupon.

### Expected Result
- Error message `"Please enter a valid coupon code"` is displayed.

---

# Test Case 86: Verify ViMTV Plus Plan Activation

### Pre-requisite
- Valid coupon has been successfully redeemed.

### Step 1
- Navigate to the Plans page.

### Expected Result
- `"ViMTV Plus"` plan is activated.
- `"ViMTV Plus"` plan is displayed on the Plans page.

---

# Test Case 87: Verify Premium Content Playback After Redemption

### Pre-requisite
- Valid coupon has been redeemed.
- ViMTV Plus plan is activated.

### Step 1
- Select premium content.

### Step 2
- Start playback.

### Expected Result
- Premium content plays successfully after coupon redemption.

---

# Automation Notes

- Reuse existing Page Object Model locators and methods wherever available.
- Reuse existing common actions instead of creating duplicate actions.
- Reuse existing assertion utilities instead of creating duplicate assertions.
- Keep test/spec files focused on the test flow.
- Keep page-specific actions and validations inside the relevant Page Object.
- Do not duplicate existing functions or methods.
- Use existing SearchPage methods for Search-related test cases.
- Keep test data/configuration separate from test logic where applicable.



# Test Case 74: Verify User Logged-Out State on WiFi Data  [ Not feasible]

### Pre-requisite
-silent login
- User is accessing ViMTV over WiFi data.

### Step 1
- Access ViMTV using WiFi data.

### Expected Result
- User should be in the logged-out state when on WiFi data.

---

# Test Case 77: Verify Close Screen Functionality

### Pre-requisite
- Active Screen is displayed.

### Step 1
- Tap the Close option.

### Expected Result
- Active Screen closes successfully.

---
