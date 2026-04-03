# Playwright Project Pack

Complete Playwright test automation framework with real working examples.

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

## Writing Tests

See individual test files for examples of:
- Login flows
- E-commerce checkout
- Todo management
- Form interactions
