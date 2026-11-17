# ViMovies OTT Platform — Playwright Automation Framework

End-to-end test automation for the [ViMovies & TV](https://moviesandtv.myvi.in/) OTT platform using Playwright + TypeScript.

## Prerequisites

- **Node.js** >= 22
- **npm** (not yarn)

## Setup

```bash
npm install
npx playwright install
```

Create a `.env` file:

```env
BASE_URL=https://moviesandtv.myvi.in/
MOBILE_NUMBER=<your_number>
OTP=<test_otp>
```

## Architecture

The framework follows a strict **4-layer architecture**:

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 1: TESTS            src/tests/**/*.spec.ts               │
│  → Orchestration only. No DOM interaction.                      │
├─────────────────────────────────────────────────────────────────┤
│  Layer 2: COMMON FUNCTIONS src/commonFunctions/<Feature>Function.ts │
│  → Multi-step business flows with typed Input/Output.           │
├─────────────────────────────────────────────────────────────────┤
│  Layer 3: PAGE OBJECTS     src/pageObjects/<Feature>Page.ts     │
│  → Locators + element actions via UICommands.generic*()         │
├─────────────────────────────────────────────────────────────────┤
│  Layer 4: UTILITIES        utils/                               │
│  → CommonActions (UICommands), Assertions (Allure-integrated)   │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
src/
├── pageObjects/          # Page Object classes (locators + actions)
├── commonFunctions/      # Reusable business flow functions
├── data/                 # Test data JSON files
│   ├── navigation/
│   ├── search/
│   └── login/
└── tests/                # Test specs (orchestration only)
    ├── Navigation/
    └── Search/
utils/
├── CommonActions.ts      # UICommands class (Allure-integrated interactions)
└── Assertions.ts         # Assertion wrappers with Allure step logging
prompts/                  # AI agent prompt files
manifest.yaml             # Function registry (source of truth for reuse)
```

## Running Tests

```bash
# Run all tests
npm test

# Run by project
npm run test:chromium

# Run by tag
npm run test:search
npm run test:login
npm run test:smoke
npm run test:regression

# Run specific test file
npx playwright test src/tests/Navigation/ --project=chromium
```

## Reporting

### Allure Reports

```bash
# Clean old results, run tests, and serve report
npm run report:clean
npx playwright test --project=chromium --reporter=line,allure-playwright
npm run allure:serve
```

### Playwright HTML Report

```bash
npx playwright show-report
```

## Code Quality

```bash
# TypeScript type check
npm run ts:check

# ESLint
npm run lint
npm run lint:fix

# Pre-commit hooks (via Husky + lint-staged)
# Automatically runs on staged .ts files
```

## Key Conventions

| Rule | Description |
|------|-------------|
| No selectors in tests | Tests only call commonFunctions and Page Object methods |
| Descriptive outputs | Function outputs are human-readable strings, not booleans |
| Static UICommands | Page Objects use `UICommands.genericClick()` etc. (static) |
| JSDoc required | All classes, methods, and exports must have JSDoc |
| Path aliases | `@ViMovies/pageObjects/*`, `@ViMovies/commonFunctions/*`, `@ViMovies/data/*`, `@utils/*` |
| Tags required | Every test has `{ tag: ['@feature'] }` |
| Data externalized | All test data lives in `src/data/` JSON files |
| Manifest-driven | Check `manifest.yaml` before creating new code |

## Tags

| Tag | Purpose |
|-----|---------|
| `@navigation` | Navigation flow tests |
| `@search` | Search functionality tests |
| `@login` | Authentication tests |
| `@smoke` | Critical path smoke tests |
| `@regression` | Full regression suite |

## AI-Assisted Workflow

This framework is designed for AI-assisted test generation using the prompts in `prompts/`:

- **exploration-and-generate.prompt.md** — Explore the app and generate automation code
- **complete-qa-flow.prompt.md** — Full end-to-end QA workflow from user story to committed code

The `Playwright_Automation_Master_Prompt.md` contains all guardrails, patterns, and rules for code generation.
