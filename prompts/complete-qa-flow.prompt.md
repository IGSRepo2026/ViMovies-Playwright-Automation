---
mode: agent
description: "Complete QA workflow: User Story → Test Plan → Exploration → Code Generation → Execute & Heal → Commit"
tools:
  - playwright-test-planner
  - playwright-test-generator
  - playwright-test-healer
---

# Complete QA Flow

Execute the full end-to-end QA workflow as defined in the Master Prompt (Playwright_Automation_Master_Prompt.md).

## Instructions

Follow ALL 6 phases sequentially:

### PHASE 1: Read & Understand User Story
- Read the user story file provided
- Extract requirements, acceptance criteria, feature module, and testing scope

### PHASE 2: Create Test Plan
- Use `playwright-test-planner` agent
- Navigate the app to understand UI
- Create comprehensive test plan covering happy path, negative, edge cases
- Save to `specs/<feature>-test-plan.md`

### PHASE 3: Exploratory Testing & Validation
- Use Playwright browser tools to manually execute each scenario
- Take screenshots as evidence
- Document findings
- **Gate:** Only proceed if all scenarios validated

### PHASE 4: Generate Automation Code
- Read `manifest.yaml` — REUSE existing functions before creating new ones
- Run GAP analysis (Section 5 of Master Prompt)
- For gaps: Discovery → Page Object → Common Function
- Generate: Page Objects, Common Functions, Test Data JSON, Test Specs
- All code MUST use UICommands, path aliases, typed I/O, tags

### PHASE 5: Execute, Heal & Stabilize
- Run tests: `npx playwright test src/tests/<Feature>/ --project=chromium`
- If failures: use `playwright-test-healer` agent to fix
- Fix at correct layer (PO for selectors, Function for logic, Test for assertions)
- Re-run until all green

### PHASE 6: Commit & Report
- Final validation run
- Stage and commit with proper message format
- Update `manifest.yaml` with new artifacts

## Context Files
- Master Prompt: `Playwright_Automation_Master_Prompt.md`
- Manifest: `manifest.yaml`
- ESLint: `eslint.config.mjs`
