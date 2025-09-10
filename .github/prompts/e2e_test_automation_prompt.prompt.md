---
mode: agent
description: Perform end-to-end test automation based on the provided specifications.
---
Here’s a copy-paste prompt you can give to GitHub Copilot Agent.
Replace the placeholders (like `/docs/e2e/test-cases.md`) with your actual file path(s).

---
You are an automation engineer. Run end-to-end (E2E) tests using the **Playwright MCP server**.
All test cases, routes, data, and setup/teardown instructions are defined in a **single source of truth** file referenced below.
Follow that file exactly, generate any missing Playwright code if needed, execute the suite, and return artifacts and a concise report.

# Inputs

* **Test plan file**: `/docs/e2e/test-cases.md`
  (May include: prerequisites, env vars, test matrix, selectors, URLs, user flows, mock data, retries, screenshots/video rules, and reporting requirements.)
* **Optional env file(s)**: `/.env` (if present, load securely)
* **Project root**: `/` (assume current workspace if not provided)

# Tools & Constraints

* Prefer the **Playwright MCP server** tool for all actions (navigation, assertions, tracing, screenshots, videos, downloads).

  * If the MCP server/tool is unavailable, fall back to CLI: `npx playwright install --with-deps` and `npx playwright test`.
* Keep actions **idempotent** and **non-destructive**. Never modify production data.
* Headless by default unless the test plan says otherwise.
* Parallelism, retries, and timeouts must be read from the test plan; otherwise use: `retries=2`, `timeout=45s`, `workers=50% of cores`.

# Required Steps

1. **Read & parse the test plan**

   * Load `/docs/e2e/test-cases.md` and extract:

     * app URL(s), flows, roles, credentials, test matrix (browsers/devices), fixtures, mocks, and success criteria.
     * artifact policy (screenshots/video/trace on first retry or on failure).
     * reporting format(s) (HTML, JUnit XML, JSON).
   * Validate for missing info; if gaps exist, infer reasonable defaults and proceed.

2. **Environment setup**

   * Ensure Node and Playwright deps are installed. If a `package.json` exists, run the project’s install script (`npm ci` or `pnpm i`).
   * Load env vars from `.env`/`test.env.*` if referenced by the test plan.
   * Start any required local servers or mocks described in the test plan (e.g., dev server, API stub). Wait until health checks pass.

3. **Generate or sync tests (if needed)**

   * If the repo already contains Playwright tests, align them with the plan (add/adjust specs, fixtures, and config).
   * If tests are missing, **generate** Playwright spec files that implement each scenario in the plan:

     * Use role-based flows, page objects if plan requests, and data-driven patterns from the test matrix.
     * Implement robust selectors and waiting strategies.
     * Add accessibility checks if requested.
   * Update/create `playwright.config.*` to match the matrix (browsers/devices, baseURL, retries, reporter(s), artifacts).

4. **Execute via MCP**

   * Use the Playwright MCP tool to:

     * run the full matrix,
     * capture **trace**, **screenshots**, **video**, and **network logs** according to the artifact policy,
     * mark flaky tests for retry with trace-on-retry.
   * If MCP execution is not available, run `npx playwright test` with equivalent flags.

5. **Collect artifacts**

   * Gather:

     * HTML report (`playwright-report`),
     * JUnit XML (`junit-results.xml`) if requested,
     * Traces (`trace.zip` per failing test),
     * Screenshots and videos (on failure or as configured).
   * Package artifacts into `/.playwright-mcp/artifacts/e2e-<timestamp>/...`.

6. **Summarize results**

   * Produce a **concise test summary**:

     * totals: passed/failed/flaky/skipped, duration, slowest tests,
     * failures: test title, error, step where it failed, link to trace/screenshot,
     * environment details: commit SHA/branch, Node/Playwright versions, browser versions, config deltas vs plan.
   * If failures match known flaky patterns in the plan, call them out separately.

7. **Output**

   * Return:

     * A human-readable summary (markdown),
     * Paths to all artifacts,
     * Any generated/modified files (specs, fixtures, configs).
   * Do **not** expose secrets in logs.

# Acceptance Criteria

* All scenarios from `/docs/e2e/test-cases.md` are implemented and executed across the specified browser/device matrix.
* Artifacts (report, traces, screenshots, videos) are saved and their paths are listed.
* Summary clearly identifies failing steps and links to corresponding trace/screenshot/video.
* Non-flaky failures cause a non-zero exit status.

# Execution Hints (Agent-side)

* When using MCP:

  * Prefer high-level navigation and assertion APIs exposed by the Playwright MCP server.
  * Enable tracing: `on-first-retry` (or as required by the plan).
  * Store artifacts under `/artifacts/e2e-<timestamp>/`.
* CLI fallback example (if MCP not available):

  ```
  npx playwright install --with-deps
  npx playwright test --reporter=html,junit --project=all
  ```
* Useful config defaults if not specified:

  * `use: { baseURL, headless: true, trace: 'on-first-retry', screenshot: 'only-on-failure', video: 'retain-on-failure' }`
  * Reporters: `[['html', { open: 'never' }], ['junit', { outputFile: 'junit-results.xml' }]]`

# Deliverables

* Markdown summary with:

  * Overall result + totals
  * Table of failures (test title, error snippet, artifact links)
  * Environment + versions
* File tree of `/.playwright-mcp/artifacts/e2e-<timestamp>/`
* List of generated/updated files (paths) suitable for a PR description
* List bugs/issues for any non-flaky failures

# Begin

1. Read `/docs/e2e/test-cases.md`.
2. Prepare environment and config.
3. Run tests via Playwright MCP (or CLI fallback).
4. Collect artifacts and produce the summary.
5. Return outputs exactly as specified above.
