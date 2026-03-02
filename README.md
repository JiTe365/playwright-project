# A complete Playwright test automation framework with real working examples.

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

# Run in headed mode
npm run test:headed

# Run specific browser
npm run test:chromium
npm run test:firefox
```

## Test Sites

- **SauceDemo** - E-commerce demo (https://www.saucedemo.com)
  - Username: standard_user
  - Password: secret_sauce
- **TodoMVC** - Todo application (https://demo.playwright.dev/todomvc)
- **The Internet** - Various test scenarios (https://the-internet.herokuapp.com)

## Project Structure

```
├── tests/              # Test files
│   ├── saucedemo-login.spec.ts
│   └── todomvc.spec.ts
├── page-objects/       # Page object models
├── test-data/          # Test data
├── utils/              # Helper functions
│   └── test-data.ts
├── .env.example        # Environment variables template
└── playwright.config.ts # Configuration
```

## Writing Tests

See individual test files for examples of:
- Login flows
- E-commerce checkout
- Todo management
- Form interactions

Step 4: First Commit

# Stage all files
git add .

# Commit
git commit -m "Initial commit: Playwright framework with SauceDemo and TodoMVC tests"

Step 5: Connect to GitHub

# Create repo on GitHub first, then:
git remote add origin https://github.com/yourusername/playwright-project-pack.git
git branch -M main
git push -u origin main

