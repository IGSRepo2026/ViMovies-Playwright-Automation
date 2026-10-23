---
mode: agent
description: "Start from Exploration phase: Skip story/plan creation, explore the app and generate automation code"
tools:
  - playwright-test-generator
  - playwright-test-healer
---

# Exploration & Generate Flow

Start from Phase 3 (Exploration) of the QA workflow. Use this when you already have a test plan or know what to automate and want to skip story reading and planning.

## Instructions

### PHASE 3: Exploratory Testing & Validation
- Navigate to the target page/feature using Playwright browser tools
- Execute the test scenarios manually
- At each step:
  - Take screenshots
  - Capture element inventory (locators, roles, attributes)
  - Produce Element Inventory Table (Section 6.2 of Master Prompt)
- Validate expected behaviors match actual app behavior

### PHASE 4: Generate Automation Code
1. **Read `manifest.yaml`** — check what already exists
2. **REUSE/GAP Analysis:**
   - Map each test step to existing Page Object methods or Common Functions
   - Produce mapping table showing covered vs. uncovered steps
   - For gaps: use discovered elements to create new artifacts
3. **Generate (bottom-up):**
   - Page Objects → `src/pageObjects/<Feature>Page.ts` (UICommands, EI# comments)
   - Common Functions → `src/commonFunctions/<Feature>Function.ts` (typed I/O)
   - Test Data → `src/data/<feature>/<scenario>.json`
   - Test Specs → `src/tests/<Feature>/<scenario>.spec.ts` (tags, assertions)
4. **Update `manifest.yaml`** with new artifacts
5. **Validate** against Section 11 checklist
6. **Compile check** — Run `npx tsc --noEmit` to catch syntax errors, duplicate braces, missing imports, and type mismatches. Fix all errors before proceeding to Phase 5.

### PHASE 5: Execute, Heal & Stabilize
- Run: `npx playwright test src/tests/<Feature>/ --project=chromium --reporter=line,allure-playwright`
- **NEVER use bare `--reporter=html`** — it opens a blocking server on failure
- For failures: diagnose root cause → fix at correct layer → clean results (`npm run report:clean`) → re-run immediately
- Do NOT stop or wait for user input on failure — always heal and continue
- Use `playwright-test-healer` agent for complex failures
- Common fixes: `.first()` for strict mode, increase timeout, verify locator on live page
- Repeat until all tests pass (max 3 heal attempts per failure)

### PHASE 6: Commit
- Confirm all tests green
- Update manifest if not already done
- Commit with format: `feat(<feature>): Add <feature> automation`

## Context Files
- Master Prompt: `Playwright_Automation_Master_Prompt.md`
- Manifest: `manifest.yaml`
- ESLint: `eslint.config.mjs`

## Usage
Provide one of:
- A test plan file path (e.g., `specs/search-test-plan.md`)
- A single test case description (e.g., "Verify search returns results for valid keyword 'jaanu'")
- A list of test case IDs from an existing test plan (e.g., "T1001, T1002")
- A feature description (e.g., "Automate the search functionality")
- A specific page URL to explore (e.g., "https://moviesandtv.myvi.in/")

### When providing a test case directly:
Include the following details:
- **Test ID** (e.g., T1001)
- **Title** (e.g., "Search for valid content returns results")
- **Steps** (numbered list of actions)
- **Expected Results** (what should happen at each step)
- **Test Data** (search keywords, credentials source, etc.)

Example:
```
Test Case: T1001 - Search for valid content
Steps:
1. Open the app
2. Login with OTP
3. Click on search icon
4. Enter "jaanu" in search field
5. Verify search results are displayed
Expected: At least 1 result card is visible
```
