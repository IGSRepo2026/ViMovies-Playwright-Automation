# ViMTV Search Page Test Case Flow

## Pre-request: Verify Successful Website Launch

### Step 1: Navigate to the URL
- Launch the ViMTV website using the provided URL.

### Expected Result
- The ViMTV website launches successfully.
- The Home page is displayed without any errors.
- The page loads within an acceptable response time.

---

# Test Case 1: Verify Navigation to Search Page

### Pre-requisite
- User has successfully launched the ViMTV website.

### Step 1: Tap on the Search icon

### Expected Result
- User is navigated to the Search page successfully.
- Search text box is visible and ready for input.

---

# Test Case 2: Verify Search Page UI

### Pre-requisite
- User is on the Search page.

### Step 1: Verify the Search page UI.

### Expected Result
- ViMTV logo is displayed.
- Top navigation banner is displayed.
- Home tab is displayed.
- Sports tab is displayed.
- Movies tab is displayed.
- FREE OTTs tab is displayed.
- Web Series tab is displayed.
- Subscribe Lottie is displayed.
- Search text field with placeholder is displayed.
- Search icon is displayed.
- Profile icon is displayed.
- "Explore by Apps" rail is displayed.
- "Explore by Language" rail is displayed.
- "Explore by Genre" rail is displayed.
- Other configurable rails are displayed.
- No UI alignment issues are observed.

---

# Test Case 3: Verify User Can Enter Text into Search Field

### Pre-requisite
- User is on the Search page.

### Step 1
- Tap inside the Search text field.

### Expected Result
- Cursor appears inside the Search text field.

### Step 2
- Enter any valid search keyword.

### Expected Result
- User is able to type successfully.
- Typed keyword is displayed correctly.
- No UI issues occur while typing.

---

# Test Case 4: Verify Search Results with Two Characters

### Pre-requisite
- User is on the Search page.

### Step 1
- Enter only two characters into the Search field.

### Expected Result
- Search results are displayed according to the latest implementation.
- Displayed results are relevant to the entered keyword.
- No incorrect or unrelated results are shown.

---

# Test Case 5: Verify Search Results UI

### Pre-requisite
- User is on the Search page.

### Step 1
- Enter a valid search keyword.

### Expected Result
- Relevant search results are displayed.

### Step 2
- Verify the Search Results UI.

### Expected Result
- Search filters are displayed.
    - All
    - Movies
    - TV Shows
    - Videos
    - Live
- Total number of search results is displayed.
- Every result displays:
    - Thumbnail
    - Content partner logo
    - Title
    - Metadata
- Results match the entered keyword.
- UI is properly aligned.

---

# Test Case 6: Verify Search Filters

### Pre-requisite
- User is on the Search page.
- Search results are displayed.

### Step 1
- Tap the "All" filter.

### Expected Result
- All search results are displayed.

### Step 2
- Tap the "Movies" filter.

### Expected Result
- Only Movies are displayed.

### Step 3
- Tap the "TV Shows" filter.

### Expected Result
- Only TV Shows are displayed.

### Step 4
- Tap the "Videos" filter.

### Expected Result
- Only Videos are displayed.

### Step 5
- Tap the "Live" filter.

### Expected Result
- Only Live content is displayed.

### Validation
- Search results update correctly after each filter selection.
- No irrelevant content is displayed.

---

# Test Case 7: Verify Search History

### Pre-requisite
- User is on the Search page.

### Step 1
- Search for any valid content.

### Expected Result
- Relevant search results are displayed.

### Step 2
- Navigate back to the Search page.

### Expected Result
- Search history section is displayed.

### Step 3
- Tap one of the search history items.

### Expected Result
- Search box is automatically populated.
- Relevant search results are displayed.

---

# Test Case 8: Verify Thumbnail Navigation

### Pre-requisite
- User is viewing search results.

### Step 1
- Tap any content thumbnail.

### Expected Result
- User is navigated to the respective Details page or Player page.
- Selected content information is displayed correctly.

---

# Test Case 9: Verify Recently Searched Content

### Pre-requisite
- User has searched for one or more content titles.

### Step 1
- Navigate back to the Search page.

### Expected Result
- Recently searched content appears under Search History.

### Step 2
- Verify displayed search history.

### Expected Result
- Search history displays previously searched titles.
- Most recent searches appear first.

---

# Test Case 10: Verify Clear History CTA

### Pre-requisite
- Search history contains at least one item.

### Step 1
- Tap the "Clear History" CTA.

### Expected Result
- All search history items are removed.

### Step 2
- Verify Search History section.

### Expected Result
- Search History is empty.
- Previously searched items are no longer displayed.

---

# Test Case 11: Verify Back Navigation from Details Page

### Pre-requisite
- User has opened any content Details page.

### Step 1
- Tap the Back button.

### Expected Result
- User returns to the Search page.

### Step 2
- Verify Search History.

### Expected Result
- Previously searched content remains available in Search History.

---

# Test Case 12: Verify Home Tab Navigation

### Pre-requisite
- User is on the Search page.

### Step 1
- Tap the Home tab.

### Expected Result
- User is navigated to the Home page successfully.

---

# Test Case 13: Verify Sports Tab Navigation

### Pre-requisite
- User is on the Search page.

### Step 1
- Tap the Sports tab.

### Expected Result
- User is navigated to the Sports page successfully.

---

# Test Case 14: Verify Movies Tab Navigation

### Pre-requisite
- User is on the Search page.

### Step 1
- Tap the Movies tab.

### Expected Result
- User is navigated to the Movies page successfully.

---

# Test Case 15: Verify FREE OTTs Tab Navigation

### Pre-requisite
- User is on the Search page.

### Step 1
- Tap the FREE OTTs tab.

### Expected Result
- User is navigated to the FREE OTTs page successfully.

---

# Test Case 16: Verify Web Series Tab Navigation

### Pre-requisite
- User is on the Search page.

### Step 1
- Tap the Web Series tab.

### Expected Result
- User is navigated to the Web Series page successfully.

---

# Test Case 17: Verify Subscribe Lottie Navigation

### Pre-requisite
- User is on the Search page.

### Step 1
- Tap the Subscribe Lottie.

### Expected Result
- User is navigated to the Subscription Plans page successfully.

---

# Test Case 18: Verify Profile Icon Navigation

### Pre-requisite
- User is on the Search page.

### Step 1
- Tap the Profile icon.

### Expected Result
- User is navigated to the Login/Profile page if not logged in.
- User is navigated to the Profile page if already logged in.

---

# Test Case 19: Verify Empty Search Result

### Pre-requisite
- User is on the Search page.

### Step 1
- Enter a keyword that has no matching content.

### Expected Result
- No search results are displayed.
- Appropriate "No Results Found" message is displayed.
- Search filters are hidden or disabled if applicable.

---

# Test Case 20: Verify Search Using Special Characters

### Pre-requisite
- User is on the Search page.

### Step 1
- Enter only special characters (e.g., @#$%^&*).

### Expected Result
- Application does not crash.
- Appropriate message or empty result is displayed.
- Search page remains responsive.

---

# Test Case 21: Verify Search Using Numeric Characters

### Pre-requisite
- User is on the Search page.

### Step 1
- Enter numeric characters.

### Expected Result
- Relevant results are displayed if matching content exists.
- Otherwise, "No Results Found" is displayed.

---

# Test Case 22: Verify Search Persistence

### Pre-requisite
- User has searched for any content.

### Step 1
- Open a content Details page.

### Expected Result
- Details page opens successfully.

### Step 2
- Navigate back.

### Expected Result
- Previously entered search keyword remains in the Search field.
- Search results remain displayed.

---

# Test Case 23: Verify Multiple Sequential Searches

### Pre-requisite
- User is on the Search page.

### Step 1
- Search for Content A.

### Expected Result
- Relevant results are displayed.

### Step 2
- Clear the Search field.

### Expected Result
- Search field is cleared.

### Step 3
- Search for Content B.

### Expected Result
- Relevant results for Content B are displayed.
- Previous results are replaced correctly.

---

# Test Case 24: Verify Search Performance

### Pre-requisite
- User is on the Search page.

### Step 1
- Enter a valid keyword.

### Expected Result
- Search results load within acceptable response time.
- No loading failures occur.
- UI remains responsive throughout the search process.

---

## End of Search Page Test Flow