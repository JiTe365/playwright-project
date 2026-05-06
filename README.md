# Playwright Project Pack

Complete Playwright test automation framework with real working examples.

## Notes

> **API Tests (Local Only):** The `api-status-codes.spec.ts` tests are designed to run locally and require the demo server to be running. These tests are automatically **skipped in CI environments** (GitHub Actions). Run them locally with `npm run test:api`.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env
```

3. Install browsers:

```bash
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific site tests
npm run test:saucedemo
npm run test:todomvc
npm run test:token-demo

# Run API tests (includes server auto-start)
npm run test:api
npm run test:api:headed

# Run in headed mode
npm run test:headed

# Run specific browser
npm run test:chromium
npm run test:firefox
```

## Token Usage Demo

This project includes a local token usage demo app plus an end-to-end Playwright test.

The token demo test:
- sends a prompt from the UI
- waits for the `/api/chat` response
- reads the returned token usage
- checks that the UI shows the same values
- captures the same token usage through a response listener
- checks that total token usage stays under a small budget

Run it with:

```bash
npm run test:token-demo
```

Run it in headed mode with:

```bash
npm run test:token-demo:headed
```

GitHub Actions runs the token demo separately from the main Playwright suite by using its dedicated config.

Relevant files:
- `demo-app/token-demo/server.js`
- `demo-app/token-demo/public/index.html`
- `demo-app/token-demo/public/app.js`
- `tests/token-usage.spec.ts`

## Test Sites

- **SauceDemo** - E-commerce demo (https://www.saucedemo.com)
- Username: `standard_user`
- Password: `secret_sauce`
- **TodoMVC** - Todo application (https://demo.playwright.dev/todomvc)
- **The Internet** - Various test scenarios (https://the-internet.herokuapp.com)

## Project Structure

```text
tests/                          # Test suites (~40+ test cases)
  saucedemo-login.spec.ts       # SauceDemo tests (auth, products, cart, checkout)
  todomvc.spec.ts               # TodoMVC tests (CRUD, filtering, persistence)
  token-usage.spec.ts           # Token usage demo test
  api-status-codes.spec.ts      # API status codes & response validation (12+ tests)
fixtures/                       # Shared Playwright fixtures
  pom-fixtures.ts               # Custom test fixtures exposing page objects
utils/                          # Page Objects & Utilities
  SauceDemoLoginPage.ts         # SauceDemo login page object
  SauceDemoInventoryPage.ts     # SauceDemo inventory page object
  SauceDemoCartPage.ts          # SauceDemo cart page object
  SauceDemoCheckoutPage.ts      # SauceDemo checkout page object
  TodoMVCPage.ts                # TodoMVC page object
  test-data.ts                  # Test data (users, credentials)
  types.ts                       # TypeScript type definitions
demo-app/                       # Local demo applications
  token-demo/                   # Token usage demo app
    server.js
    public/
      index.html
      app.js
.env.example                    # Environment variables template
playwright.config.ts            # Main configuration
playwright.token-demo.config.ts # Token demo configuration
```

## POM And Fixtures

This project uses the `Page Object Model (POM)` pattern together with custom Playwright fixtures.

- Page objects live in `utils/` and contain selectors plus page-specific actions.
- Shared fixtures live in `fixtures/pom-fixtures.ts`.
- Tests can receive ready-to-use page objects like `loginPage`, `inventoryPage`, `cartPage`, `checkoutPage`, and `todoPage`.

This keeps the test files focused on behavior and assertions instead of repeatedly creating page object instances with `new ...Page(page)`.

Example:

```ts
import { test, expect } from '../fixtures/pom-fixtures';

test.beforeEach(async ({ todoPage }) => {
  await todoPage.goto();
});

test('can add a todo item', async ({ todoPage }) => {
  await todoPage.addTodo('Buy milk');
  await expect(todoPage.todoTitles).toHaveText(['Buy milk']);
});
```

## Writing Tests

See individual test files for examples of:
- Login flows
- E-commerce checkout
- Todo management
- Form interactions

When a test uses page objects, import `test` and `expect` from `fixtures/pom-fixtures`:

```ts
import { test, expect } from '../fixtures/pom-fixtures';
```

If a test does not need custom page object fixtures, importing from `@playwright/test` is still fine.
