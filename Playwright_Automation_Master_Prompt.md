# MASTER GUARDRAILS — Playwright Automation Framework
## ViMovies OTT Platform — AI Code Generation & QA Function

> **This document is the single source of truth for AI-generated automation code.**
> Every code output MUST pass the validation checklist (Section 14) before delivery.
> When given a user story, START at Section 1 (Function) and follow the phases sequentially.

---

## SECTION 1: END-TO-END QA Function

This section defines the complete Function from User Story to committed automation code.
Each phase references specific guardrail sections below for detailed rules and patterns.

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1        PHASE 2         PHASE 3        PHASE 4       PHASE 5   PHASE 6  │
│  ────────       ────────        ────────       ────────      ────────  ───────  │
│  Read Story →   Test Plan →     Explore &  →   Generate  →   Execute  → Commit  │
│                                 Validate       Automation     & Heal            │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

### PHASE 1: Read & Understand User Story

**Input:** User story file (e.g., `specs/<feature>-story.md`)

**Actions:**
1. Read the user story file
2. Extract:
   - Key requirements and acceptance criteria
   - Feature module (Search, Login, Playback, Subscription, etc.)
   - Test credentials and environment details
   - Features/modules to test
3. Identify the testing scope (Search, Navigation, Playback, Subscription, UI Validation)

**Output:** Summary of requirements, acceptance criteria, and testing scope.

---

### PHASE 2: Create Test Plan

**Agent:** `playwright-test-planner`

**Actions:**
1. Read the user story and acceptance criteria from Phase 1
2. Navigate to the application using Playwright browser tools to understand the UI
3. Create a comprehensive test plan covering:
   - Happy path scenarios
   - Negative scenarios (invalid search, expired OTP, no results)
   - Edge cases and boundary conditions
   - Navigation flow tests
   - UI element validation
   - Mobile responsiveness (if applicable)
4. For each test scenario, define:
   - Test case ID (e.g., `T1001`)
   - Clear title and description
   - Step-by-step instructions
   - Expected results per step
   - Test data requirements

**Output:** Test plan saved as `specs/<feature>-test-plan.md`

---

### PHASE 3: Exploratory Testing & Validation

**Tools:** Playwright browser tools (MCP)

**Actions:**
1. Read the test plan from Phase 2
2. Using Playwright browser tools, manually execute each test scenario
3. At each key step:
   - Take screenshots as evidence
   - Note any UI inconsistencies
   - Document unexpected behaviors
4. Produce findings report

**Output:** Validated test plan with exploration results and screenshots.

**Gate:** Only proceed to Phase 4 if all scenarios are validated against real application behavior.

---

### PHASE 4: Generate Automation Code

**Agent:** `playwright-test-generator`

**Actions — Follow the code generation protocol:**

1. **REUSE CHECK** — Check existing commonFunctions and pages before creating new ones
2. **GAP RESOLUTION** — For unmet steps:
   - Run Page Discovery (Section 6) → produce Element Inventory Table
   - Choose locators per priority (Section 6.4)
   - Create Page Objects (Layer 3)
   - Create commonFunctions with typed I/O (Layer 2)
3. **GENERATE** — Following Section 7 patterns:
   - **Page Objects** → `src/pageObjects/<Feature>Page.ts`
   - **commonFunctions** → `src/commonFunctions/<Feature>Function.ts`
   - **Test Data** → `src/data/<feature>/<scenario>.json`
   - **Test Specs** → `src/tests/<Feature>/<scenario>.spec.ts`
4. **ESLINT COMPLIANCE** — All generated code MUST conform to ESLint rules (Section 15):
   - Use `type` instead of `interface` for type definitions
   - No unused variables (prefix intentionally unused with `_`)
   - No `any` types — use proper typing
   - Use optional chaining (`a?.b`) instead of `a && a.b`
   - Always `return await` in async functions
   - Merge imports from the same module
   - Place optional/default parameters last
   - Follow Prettier formatting (100 char width, trailing commas, 2-space indent, semicolons)
5. **VALIDATE** — Run Section 14 checklist before delivery
6. **COMPILE CHECK** — Run `npx tsc --noEmit` on all generated files to catch syntax errors (duplicate braces, missing imports, type mismatches). Fix any errors before proceeding. This is mandatory — never skip to Phase 5 without a clean compile.

**Output:** Complete automation code following the 3-layer architecture.

---

### PHASE 5: Execute, Heal & Stabilize

**Agent:** `playwright-test-healer` (for failures)

**CRITICAL:** Do NOT get stuck on failure. Always diagnose, fix, and re-run. Never stop the flow at a failed state.

**Actions:**
1. **Run tests** (always use `--reporter=line,allure-playwright` to avoid HTML report server blocking):
   ```bash
   npx playwright test src/tests/<Feature>/ --project=chromium --reporter=line,allure-playwright
   ```
2. **If all pass** → proceed to Phase 6
3. **If tests fail** — for each failure:
   - Read the error message and identify root cause (selector issue, timing, strict mode, assertion mismatch)
   - Fix at the correct layer (Page Object for locator issues, Function for logic, Test for assertion)
   - Clean old results: `npm run report:clean`
   - Re-run immediately — do NOT wait for user input
   - Repeat until all tests pass (max 3 heal attempts per failure)
4. **Common failure patterns and fixes:**
   - `strict mode violation: resolved to N elements` → Add `.first()` or use a more specific locator
   - `Timeout waiting for element` → Increase timeout or verify selector is correct against live page
   - `Target closed` → Add proper waitForURL or waitForLoadState
   - `HTML report server blocking terminal` → Use `--reporter=line,allure-playwright` (never bare `--reporter=html`)

**Output:** Stable, passing test suite.

---

### PHASE 6: Commit & Report

**Actions:**
1. Run final validation
2. Stage and commit all artifacts
3. Commit message format:
   ```
   feat(<feature>): Add <feature> automation
   
   - Tests: src/tests/<Feature>/
   - commonFunctions: src/commonFunctions/<Feature>Function.ts
   - Pages: src/pageObjects/<Feature>Page.ts
   - Data: src/data/<feature>/
   - All tests passing, guardrails validated
   ```

---

## SECTION 2: NON-NEGOTIABLE RULES

These rules are **hard constraints**. Any violation makes the output invalid.

| #  | Rule                  | What It Means                                                                                     | Violation = Reject |
|----|----------------------|---------------------------------------------------------------------------------------------------|--------------------|
| R1 | **Layer Integrity**  | Tests → commonFunctions (for multi-step flows) OR Page Objects (for simple reads/verifications) → Utilities. Never use raw `page.*` in tests. | YES |
| R2 | **Reuse First**      | Check existing commonFunctions/pages BEFORE creating new ones. NEVER re-implement logic another function already provides (e.g., navigation). | YES |
| R3 | **No Selectors in Tests** | Tests MUST NOT contain `page.locator()`, `page.getByRole()`, `page.click()`, `page.fill()`, or any DOM interaction. | YES |
| R4 | **No Hardcoding**    | All test data lives in JSON files or env variables. No string literals for data values in `.ts` files. | YES |
| R5 | **Path Aliases**     | Use `@ViMovies/pageObjects/*`, `@ViMovies/commonFunctions/*`, `@ViMovies/data/*`, `@utils/*` — never deep relative paths. | YES |
| R6 | **Typed I/O**        | Every commonFunction MUST define `Input` and `Output` types in the same file.                      | YES |
| R7 | **Tag Required**     | Every `test()` MUST include `{ tag: ['@<feature>'] }` (e.g., `{ tag: ['@search'] }`). Array format. | YES |
| R8 | **No Secrets**       | Credentials use environment variables. Never hardcode passwords, tokens, OTPs, or phone numbers.   | YES |
| R9 | **Test Independence**| Each test is self-contained. No shared mutable state between tests.                                | YES |
| R10 | **UICommands Only** | Page Objects use `UICommands.genericClick()`, `UICommands.genericFill()`, etc. — NOT standalone `page.click()` or `page.fill()`. | YES |
| R11 | **Descriptive Outputs** | commonFunction Output types MUST use descriptive strings (not booleans). Assertions validate by checking the string contains expected keywords. This ensures Allure reports show *what* was validated (e.g., `"Home page loaded — header logo visible"`) instead of opaque `true/false`. | YES |
| R12 | **JSDoc Required** | Every class, public method, and exported function MUST have a JSDoc comment with description. Methods with parameters include `@param`, return values include `@returns`. Classes and exported functions include `@author`. | YES |
| R13 | **Static UICommands** | Page Objects MUST use `UICommands.genericClick()`, `UICommands.genericFill()`, etc. (static methods). Do NOT instantiate UICommands or use `ui.uiClick()` instance methods. | YES |
| R14 | **Compose, Don't Duplicate** | Tests MUST compose existing commonFunctions for shared steps (navigation, login). NEVER create a new commonFunction that re-implements what an existing one already does. | YES |
| R15 | **Right Layer for the Job** | Use commonFunctions ONLY for multi-step orchestration flows (login, search+validate, navigate+verify). For single-action reads/verifications, tests import Page Objects directly. See Section 3.1 for decision guide. | YES |

---

## SECTION 3: ARCHITECTURE

```
┌────────────────────────────────────────────────────────────────────────────┐
│  LAYER 1: TESTS         src/tests/**/*.spec.ts                            │
│  ────────────────────────────────────────────────────────────────────────  │
│  CAN import: commonFunctions, Page Objects, JSON data, assertCommands     │
│  CAN call: commonFunctions for multi-step flows                           │
│  CAN call: Page Object methods directly for simple reads/verifications    │
│  CANNOT use: page.locator(), page.click(), page.fill(), any raw DOM calls │
├────────────────────────────────────────────────────────────────────────────┤
│  LAYER 2: commonFunctions     src/commonFunctions/<Feature>Function.ts    │
│  ────────────────────────────────────────────────────────────────────────  │
│  CAN import: Page Objects, Page type from playwright                      │
│  CANNOT use: page.locator(), page.click(), page.fill(), hardcoded data    │
│  MUST define: Input/Output types inline                                   │
│  MUST return: Typed result object (never void for execute functions)      │
│  MUST use: Descriptive strings in Output (not booleans) for Allure clarity│
│  USE FOR: Multi-step orchestration flows only (login, navigate, search)   │
├────────────────────────────────────────────────────────────────────────────┤
│  LAYER 3: PAGE OBJECTS   src/pageObjects/<Feature>Page.ts                 │
│  ────────────────────────────────────────────────────────────────────────  │
│  CAN import: UICommands from utils/CommonActions                          │
│  CAN import: Page, Locator, expect from @playwright/test                  │
│  CAN define: Locators via page.getByRole(), page.getByTestId(), etc.     │
│  Actions via: UICommands.genericClick(), UICommands.genericFill(), etc.   │
│  CANNOT: Hardcode test data, make test flow decisions                     │
├────────────────────────────────────────────────────────────────────────────┤
│  LAYER 4: UTILITIES      utils/**/*.ts                                    │
│  ────────────────────────────────────────────────────────────────────────  │
│  Shared helpers: CommonActions, Assertions, TestData                      │
│  Available to: All layers above as needed                                │
└────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Decision Guide: commonFunction vs Page Object Direct Call

Before creating a commonFunction, ask: **Does this action require multi-step orchestration?**

| Scenario | Use | Example |
|----------|-----|---------|
| Multi-step flow (navigate + click + wait + verify) | **commonFunction** | `executeNavigateToSearch()`, `executeLogin()` |
| Single read/verification on current page | **Page Object directly in test** | `searchPage.isExploreByAppsVisible()` |
| Reusable setup shared across multiple tests | **commonFunction** | `executeLogin()` called by many tests |
| Simple UI check after a flow completes | **Page Object directly in test** | Check a rail is visible after navigation |

**Key Principles:**
1. **commonFunctions = orchestration** — They combine multiple Page Object calls into a meaningful business flow
2. **Page Objects in tests = simple verification** — Single method calls for reads/checks (visibility, text, counts)
3. **NEVER duplicate** — If `executeNavigateToSearch` already navigates to search page, don't re-implement navigation in another function. Compose it.
4. **Test composes the flow** — A test should call `executeNavigateToSearch` THEN call Page Object methods for verifications

**Correct composition pattern:**
```typescript
test('TC_016 — Verify search page UI', { tag: ['@search'] }, async ({ page }) => {
  // Multi-step flow → commonFunction
  const navResult = await executeNavigateToSearch(page, { baseUrl });
  await assertToContain(page, navResult.navigationStatus, '/search', 'Navigated to search');

  // Simple verifications → Page Object directly
  const searchPage = new SearchPage(page);
  const appsVisible = await searchPage.isExploreByAppsVisible();
  // ... assert results
});
```

**Anti-pattern (DON'T DO THIS):**
```typescript
// ❌ Creating a new commonFunction that re-implements navigation
export async function executeVerifySearchPageUI(page, input) {
  await page.goto(input.baseUrl);           // ← DUPLICATED from executeNavigateToSearch
  await homePage.verifyHomePageLoaded();    // ← DUPLICATED
  await homePage.clickSearchIcon();         // ← DUPLICATED
  // ... then does verification
}
```

---

## SECTION 4: FILE STRUCTURE & NAMING

```
src/
├── pageObjects/
│   ├── LoginPage.ts              # Login page locators + methods
│   ├── SearchPage.ts             # Search page locators + methods
│   ├── PlayerPage.ts             # Video player page
│   └── HomePage.ts               # Home/landing page
├── commonFunctions/
│   ├── LoginFunction.ts          # executeLogin function
│   ├── SearchFunction.ts         # executeSearch function
│   └── PlaybackFunction.ts       # executePlayback function
├── data/
│   ├── search/
│   │   └── search-scenarios.json
│   ├── login/
│   │   └── login-scenarios.json
│   └── playback/
│       └── playback-scenarios.json
└── tests/
    ├── Search/
    │   └── search-scenarios.spec.ts
    ├── Login/
    │   └── login-scenarios.spec.ts
    └── Playback/
        └── playback-scenarios.spec.ts
utils/
├── CommonActions.ts              # Reusable page interaction helpers
├── Assertions.ts                 # Allure-integrated assertion wrappers
└── TestData.ts                   # Environment-driven test data
specs/
└── <feature>-test-plan.md        # Test plans
```

### Naming Conventions

| Artifact | Pattern | Example |
|----------|---------|---------|
| Test file | `<feature>-scenarios.spec.ts` | `search-scenarios.spec.ts` |
| Function file | `<Feature>Function.ts` | `SearchFunction.ts` |
| Function export | `execute<Feature>` | `executeSearch` |
| Page Object | `<Feature>Page.ts` | `SearchPage.ts` |
| JSON data | `<feature>-scenarios.json` | `search-scenarios.json` |
| Type | `<Feature>Input` / `<Feature>Output` | `SearchInput` / `SearchOutput` |

---

## SECTION 5: MANIFEST & REUSE/GAP ANALYSIS

Every automation request MUST go through the manifest-based Reuse/Gap analysis before code generation.

### 5.0 Manifest — Function Registry

The project has a `manifest.yaml` at the root — the registry of all Page Objects and Common Functions.

**Before writing ANY new code:**
1. Read `manifest.yaml`
2. Check if the needed function/method already exists
3. If yes → REUSE. If no → follow GAP path and update manifest after creating new artifacts.

**Manifest structure:**
```yaml
pageObjects:
  - id: SearchPage
    path: src/pageObjects/SearchPage.ts
    class: SearchPage
    methods: [clickSearchIcon, enterSearchText, getSearchResultCount, ...]

commonFunctions:
  - id: executeSearch
    path: src/commonFunctions/SearchFunction.ts
    export: executeSearch
    inputType: SearchInput
    outputType: SearchOutput
    dependsOn: [SearchPage]
```

### 5.1 REUSE Path (All Steps Covered)

When given a test scenario or user request:

1. **Read** existing `src/commonFunctions/` and `src/pageObjects/` files
2. **Map** each test step to an existing Function or Page Object method
3. **Produce a mapping table:**

```markdown
| Step                              | Covered By                        | File                          |
|-----------------------------------|-----------------------------------|-------------------------------|
| Navigate to app                   | page.goto('/')                    | (built-in — baseURL from env) |
| Login with OTP                    | executeLogin                      | src/commonFunctions/LoginFunction.ts |
| Open search page                  | SearchPage.clickSearchIcon()      | src/pageObjects/searchPage.ts        |
| Enter search text                 | SearchPage.enterSearchText()      | src/pageObjects/searchPage.ts        |
| Verify results count              | SearchPage.getSearchResultCount() | src/pageObjects/searchPage.ts        |
| Click on content card             | ❌ NOT COVERED                    | —                             |
```

4. If **all steps are covered** → generate test spec + JSON data only. No new code needed.
5. If **any step is NOT covered** → follow the GAP path below.

### 5.2 GAP Path (Steps Not Covered)

For each unmet step:

1. **STOP** — do not generate test code yet
2. **Run Discovery** (Section 6) on the target page → produce Element Inventory Table
3. **Choose locators** per priority policy (Section 6.4)
4. **Create bottom-up:**
   - Page Object with `// EI#` references and UICommands usage
   - Function function with Input/Output types
5. **Re-run REUSE** — now all steps should map

### 5.3 GAP Output Format

```markdown
## GAP REPORT

### Unmet Steps
1. "Click on content card" — No Page Object method covers this

### Discovery
(Element Inventory Table — see Section 6.2)

### New Artifacts
- PO: `src/pageObjects/ContentCardPage.ts` — method `clickContentCard()`
- Function: `src/commonFunctions/ContentFunction.ts` — `executeContentNavigation()`
- Data keys: `contentTitle` in JSON scenario
```

### 5.4 Reuse Check — Quick Reference

| Check | Where to Look | If Found |
|-------|---------------|----------|
| Login flow exists? | `src/commonFunctions/LoginFunction.ts` | Reuse `executeLogin()` |
| Search actions exist? | `src/pageObjects/searchPage.ts` | Reuse page methods |
| Navigation covered? | `src/commonFunctions/` | Reuse existing Function |
| Page elements defined? | `src/pageObjects/` | Reuse existing Page Object |
| New page needed? | Not in `src/pageObjects/` | → Run Discovery → Create PO |
| New Function needed? | Not in `src/commonFunctions/` | → Create Function with I/O types |

---

## SECTION 6: LOCATOR STRATEGY — DISCOVERY FIRST

### 6.1 Discovery Requirement

Before creating or modifying ANY Page Object, you MUST first **discover the page** and produce an **Element Inventory Table**. Do NOT guess locators.

### 6.2 Element Inventory Table Format

```markdown
## Element Inventory — [Page Name]

| #   | Role      | Name/Label          | Candidate Locator                                    | Unique? | Rationale             |
|-----|-----------|---------------------|------------------------------------------------------|---------|-----------------------|
| EI1 | button    | Home                | page.getByRole('button', { name: 'Home' })           | Yes     | Priority 2 - semantic |
| EI2 | textbox   | Search              | page.getByPlaceholder('Search for Movies...')        | Yes     | Priority 4            |
| EI3 | img       | profile_icon        | page.locator('[alt="profile_icon"]')                 | Yes     | Priority 6 - attr     |
```

### 6.3 EI# Traceability

Every locator in a Page Object MUST include a comment referencing its Element Inventory item:

```typescript
constructor(page: Page) {
  this.page = page;
  this.searchInput = page.getByPlaceholder('Search for Movies...');    // EI#2
  this.homeButton = page.getByRole('button', { name: 'Home' });        // EI#1
}
```

### 6.4 Locator Priority

Apply in order — stop at first match:

| Priority | Method | When to Use | Example |
|----------|--------|-------------|----------|
| 1 | `getByTestId()` | If `data-testid` exists | `page.getByTestId('search-input')` |
| 2 | `getByRole()` | Buttons, links, tabs | `page.getByRole('button', { name: 'Home' })` |
| 3 | `getByLabel()` | Form fields with labels | `page.getByLabel('Mobile Number')` |
| 4 | `getByPlaceholder()` | Inputs with placeholders | `page.getByPlaceholder('Search...')` |
| 5 | `getByText()` | Static text, headings | `page.getByText('No results found')` |
| 6 | `getByAltText()` | Images with alt text | `page.getByAltText('search_icon')` |
| 7 | `page.locator()` | Last resort — CSS/XPath | `page.locator('[data-index="0"]')` |

**AVOID:** Index-based (`.nth(0)`), CSS classes (`.MuiButton`), generic XPath, `text=` selector.

---

## SECTION 7: CODE PATTERNS

### 7.1 Page Object — CORRECT Pattern

```typescript
import { Page, Locator } from '@playwright/test';
import { UICommands } from '@utils/CommonActions';

/**
 * SearchPage — Page Object for the ViMovies search page.
 * Handles search input, results display, and search-related interactions.
 * @author ViMovies Automation
 */
export class SearchPage {
  private page: Page;
  private searchIcon: Locator;
  private searchInput: Locator;
  private searchResults: Locator;
  private noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchIcon = page.getByAltText('search_icon');                    // EI#1
    this.searchInput = page.getByPlaceholder('Search for Movies...');      // EI#2
    this.searchResults = page.locator('[class*="searchResult"]');           // EI#3
    this.noResultsMessage = page.getByText('No search results found');     // EI#4
  }

  /**
   * Clicks the search icon to open search.
   */
  async clickSearchIcon(): Promise<void> {
    await UICommands.genericClick(this.page, this.searchIcon, false, 'Click search icon');
  }

  /**
   * Enters text into the search input field.
   * @param {string} text - The search query to enter
   */
  async enterSearchText(text: string): Promise<void> {
    await UICommands.genericFill(this.page, this.searchInput, text, false, 'Enter search text');
  }

  /**
   * Gets the count of visible search results.
   * @returns {Promise<number>} Number of result cards displayed
   */
  async getSearchResultCount(): Promise<number> {
    await UICommands.genericWaitForVisible(
      this.page, this.searchResults.first(), 10000, 'Wait for search results',
    );
    return await this.searchResults.count();
  }

  async isNoResultsVisible(): Promise<boolean> {
    try {
      await UICommands.genericWaitForVisible(
        this.page, this.noResultsMessage, 5000, 'Check no results message',
      );
      return true;
    } catch {
      return false;
    }
  }

  async getSearchResultText(): Promise<string | null> {
    return await UICommands.genericGetText(
      this.page, this.searchResults.first(), 'Get first search result text',
    );
  }
}
```

**Key points from UICommands usage:**
- Page Objects use `UICommands.generic*()` static methods — NOT standalone `page.click()` / `page.fill()`
- Every action gets a descriptive string that logs to Allure for traceability
- `genericWaitForVisible` acts as a gate/sync point before reading state
- Locators are still defined with Playwright's `page.getBy*()` / `page.locator()` — UICommands wraps the *actions*

### 7.2 Function — CORRECT Pattern

```typescript
import { Page } from '@playwright/test';
import { SearchPage } from '@ViMovies/pageObjects/searchPage';

export type SearchInput = {
  searchText: string;
  expect?: {
    hasResults?: boolean;
    minResultCount?: number;
  };
};

export type SearchOutput = {
  searchStatus: string;
  resultCountStatus: string;
  noResultsStatus: string;
  errorMessage: string;
  timestamp: string;
};

export async function executeSearch(
  page: Page,
  input: SearchInput,
): Promise<SearchOutput> {
  const searchPage = new SearchPage(page);

  try {
    await searchPage.clickSearchIcon();
    await searchPage.enterSearchText(input.searchText);

    const resultCount = await searchPage.getSearchResultCount();
    const noResultsVisible = await searchPage.isNoResultsVisible();

    return {
      searchStatus: 'Search performed successfully',
      resultCountStatus: resultCount > 0
        ? `Found ${resultCount} results for search query`
        : 'No results found for search query',
      noResultsStatus: noResultsVisible
        ? 'No results message is displayed to user'
        : 'No results message is hidden — results are showing',
      errorMessage: '',
      timestamp: new Date().toISOString(),
    };
  } catch (_error) {
    return {
      searchStatus: 'Search FAILED — could not perform search action',
      resultCountStatus: 'Unable to retrieve results — search failed',
      noResultsStatus: 'Unable to verify no-results state — search failed',
      errorMessage: _error instanceof Error ? _error.message : String(_error),
      timestamp: new Date().toISOString(),
    };
  }
}
```

### 7.3 Test — CORRECT Pattern

```typescript
import { test, Page } from '@playwright/test';
import { executeSearch } from '@ViMovies/commonFunctions/SearchFunction';
import { executeLogin } from '@ViMovies/commonFunctions/LoginFunction';
import { assertToBe, assertToBeGreaterThan } from '@utils/Assertions';
import scenarioData from '@ViMovies/data/search/search-scenarios.json';

test.describe('Search - Content Discovery', () => {
  let currentPage: Page;

  test.beforeEach(async ({ page }) => {
    currentPage = page;
    await page.goto('/');

    const loginResult = await executeLogin(page, {
      mobileNumber: process.env.MOBILE_NUMBER!,
      otp: process.env.OTP!,
    });

    await assertToBe(page, loginResult.loggedIn, true, 'Login successful');
  });

  test('T1001: Search for valid content returns results', { tag: ['@search'] }, async () => {
    const scenario = scenarioData.scenarios.find((s) => s.id === 'T1001');
    if (!scenario) throw new Error('Scenario T1001 not found');

    const result = await executeSearch(currentPage, {
      searchText: scenario.searchText,
      expect: scenario.expect,
    });

    await assertToContain(currentPage, result.searchStatus, 'successfully', 'Search action performed');
    await assertToContain(currentPage, result.resultCountStatus, 'Found', 'Search returned results');
    await assertToContain(currentPage, result.noResultsStatus, 'hidden', 'No results message not shown');
  });
});
```

### 7.4 JSON Data — CORRECT Pattern

```json
{
  "scenarios": [
    {
      "id": "T1001",
      "description": "Search for valid content returns results",
      "searchText": "jaanu",
      "expect": {
        "hasResults": true,
        "minResultCount": 1
      }
    },
    {
      "id": "T1002",
      "description": "Search for non-existent content shows no results",
      "searchText": "xyznonexistent123",
      "expect": {
        "hasResults": false,
        "noResultsMessage": "No search results found"
      }
    }
  ]
}
```

---

## SECTION 8: OTP HANDLING

The ViMovies platform uses OTP-based login. The standard pattern:

1. Enter mobile number
2. Click "Get OTP"
3. Fill OTP digits (one per input field using `data-index` attributes)
4. Click Submit

**When running tests locally:** Use `--headed` mode. OTP values should come from `.env` file.

**Environment Variables Required:**
```
BASE_URL=https://moviesandtv.myvi.in/
MOBILE_NUMBER=<your_number>
OTP=<test_otp>
```

---

## SECTION 9: TEST INDEPENDENCE RULE

### 9.1 No Cross-Test Dependencies

Every test MUST be self-contained. A test MUST NEVER depend on another test.

### 9.2 Test Tags

All tests must be tagged for filtering:

| Tag | Use For |
|-----|---------|
| `@login` | Login/authentication tests |
| `@search` | Search functionality tests |
| `@playback` | Video playback tests |
| `@navigation` | Navigation flow tests |
| `@subscription` | Subscription/premium tests |
| `@smoke` | Critical path smoke tests |
| `@regression` | Full regression suite |

---

## SECTION 10: ASSERTION PATTERNS

Use the Allure-integrated assertion wrappers from `utils/Assertions.ts` — NOT raw `expect()`:

```typescript
import {
  assertToBe,
  assertTextEqualsDirectly,
  assertToContain,
  assertToBeGreaterThan,
  assertToHaveLength,
  assertVisible,
  assertUrlContains,
  softAssertToBe,
} from '@utils/Assertions';

// String exact match
await assertTextEqualsDirectly(page, result.successMessage, scenario.expect.message, 'Toast matches');

// String contains
await assertToContain(page, result.pageTitle, 'Search', 'Page title contains Search');

// Numeric check
await assertToBeGreaterThan(page, result.resultCount, 0, 'Has search results');

// Boolean / any value equality
await assertToBe(page, result.isVisible, true, 'Element is visible');

// Array length
await assertToHaveLength(page, result.items, 3, 'Three items returned');

// URL validation
await assertUrlContains(page, '/search', 'Navigated to search page');

// Soft assert (non-failing — test continues)
await softAssertToBe(page, result.tabCount, 5, 'Expected 5 tabs');
```

**Why generic assertions over raw `expect()`:**
- Every assertion logs as a **step in Allure** with description
- Screenshots captured **automatically on failure**
- Test reports show clear pass/fail per assertion with context
- Raw `expect()` calls are invisible in Allure — no evidence

**Descriptive Output Rule (R11):**
Function Output fields MUST be descriptive strings that explain what was validated, not booleans.
This ensures Allure reports display meaningful context like:
```
🔍 Home page load validation: actual="Home page loaded — header logo visible" should contain="header logo visible"
```
Instead of opaque:
```
🔍 Home page loaded: actual=true expected=true
```

**Pattern:**
```typescript
// In the Function — return descriptive status strings
const homePageStatus = logoVisible
  ? 'Home page loaded — header logo visible'
  : 'Home page FAILED to load — header logo not visible';

// In the Test — assert the string contains the expected keyword
await assertToContain(page, result.homePageStatus, 'header logo visible', 'Home page load validation');
```

**When raw `expect()` is acceptable:**
- Test setup guards: `if (!scenario) throw new Error('...')`
- Internal sanity checks that don't need Allure evidence

---

## SECTION 11: VALIDATION CHECKLIST

**Before delivering ANY generated code, verify ALL items pass:**

### Layer Integrity
- [ ] Tests do NOT contain `page.locator()`, `page.click()`, `page.fill()`, or any DOM selectors
- [ ] Tests use commonFunctions for multi-step flows (navigate, login, search)
- [ ] Tests use Page Objects directly ONLY for simple reads/verifications (visibility checks, text reads)
- [ ] commonFunctions import Page Objects only
- [ ] commonFunctions define Input and Output types in the same file
- [ ] Page Objects handle all DOM interactions

### Composition & Reuse
- [ ] No commonFunction duplicates logic from another existing function
- [ ] Navigation/setup steps reuse existing commonFunctions (e.g., `executeNavigateToSearch`)
- [ ] Tests compose multiple functions rather than creating monolithic ones
- [ ] commonFunctions are created ONLY for multi-step orchestration, NOT for single-action wrappers

### Naming & Structure
- [ ] Files are in correct directories per Section 4
- [ ] Import paths use `@ViMovies/pageObjects/*`, `@ViMovies/commonFunctions/*`, `@ViMovies/data/*`, `@utils/*` aliases
- [ ] Function exports follow `execute<Feature>` naming
- [ ] Page Object follows `<Feature>Page` naming

### Test Quality
- [ ] Every `test()` has `{ tag: ['@<feature>'] }` (array format with `@` prefix)
- [ ] Test data loaded from JSON via `@ViMovies/data/*` path
- [ ] No hardcoded data values in test files
- [ ] Each test is self-contained

### Data & Config
- [ ] JSON scenarios have unique `id` fields matching test IDs
- [ ] No credentials or secrets in JSON or code
- [ ] Environment variables used for sensitive data

### Discovery & Traceability
- [ ] Element Inventory Table produced before creating new Page Objects
- [ ] All PO locators have `// EI#` comment referencing inventory item

### ESLint Compliance (Section 15)
- [ ] All type definitions use `type` keyword (NOT `interface`)
- [ ] No unused variables — unused catches prefixed with `_`
- [ ] No `any` types — all parameters and returns are properly typed
- [ ] Optional chaining used where applicable
- [ ] Async functions use `return await`
- [ ] No duplicate imports from same module
- [ ] Optional/default parameters placed last
- [ ] Code formatted to Prettier standards

**If any item fails → fix before delivery. No exceptions.**

---

## SECTION 12: ESLINT COMPLIANCE — CODE GENERATION RULES

### 12.1 TypeScript Rules

| Rule | Requirement | Example |
|------|-------------|---------|
| `consistent-type-definitions: "type"` | Use `type` not `interface` | `export type MyInput = { ... }` |
| `no-unused-vars` | Prefix unused with `_` | `catch (_error) { }` |
| `no-explicit-any` | Never use `any` | `input: string` NOT `input: any` |
| `prefer-optional-chain` | Use `?.` chains | `result?.data?.items` |
| `return-await` | Always `return await` | `return await doSomething()` |
| `default-param-last` | Optional params last | `fn(name: string, force = false)` |

### 12.2 Formatting Rules (Prettier)

| Setting | Value |
|---------|-------|
| `printWidth` | 100 |
| `trailingComma` | "all" |
| `tabWidth` | 2 |
| `semi` | true |
| `singleQuote` | true |
| `endOfLine` | "auto" |

---

## APPENDIX A: COMMON MISTAKES TO AVOID

| Mistake | Fix |
|---------|-----|
| `{ tag: '@search' }` | `{ tag: ['@search'] }` — must be array |
| `import { Locator }` in test | Only import in Page Objects |
| `page.click(selector)` in Page Object | Use `UICommands.genericClick()` |
| `page.fill(selector)` in Function | Use Page Object method |
| `'../../pages/...'` | Use `@ViMovies/pageObjects/...` alias |
| `void` return on Function | Return typed Output object |
| Hardcoded phone number in test | Use `process.env.MOBILE_NUMBER` |
| Missing try/catch in Function | Wrap in try/catch, return error |
| `interface` keyword | Use `type` keyword instead |

---

## APPENDIX B: QUICK REFERENCE — IMPORT MAP

| In a... | You CAN import | You CANNOT import |
|---------|---------------|-------------------|
| **Test** | commonFunctions via `@ViMovies/commonFunctions/*`, JSON data via `@ViMovies/data/*`, Assertions via `@utils/*`, `test`/`expect`/`Page` from `@playwright/test` | Page Objects, `Locator`, `CommonActions` |
| **Function** | Page Objects via `@ViMovies/pageObjects/*`, `Page` from `@playwright/test`, other commonFunctions | `CommonActions`, direct `page.locator()` calls |
| **Page Object** | `UICommands` from `@utils/CommonActions`, `Page`/`Locator`/`expect` from `@playwright/test` | Other Page Objects (avoid), commonFunctions, test files |

---
