POM means Page Object Model. It’s a test design pattern where each page or screen gets its own class, and that class owns the page’s selectors and actions. So instead of repeating raw Playwright calls like page.locator('#user-name').fill(...) in every test, the test uses something clearer like loginPage.login(user).

For example, utils/SauceDemoLoginPage.ts (line 8) groups the login page locators and actions into one class, which is exactly the idea. The same pattern is also present in inventory, cart, checkout, and TodoMVC page classes.

I changed the setup by adding shared Playwright fixtures in fixtures/pom-fixtures.ts (line 16) and refactoring tests/saucedemo-login.spec.ts (line 1) to use them. That means my tests can now receive loginPage, inventoryPage, cartPage, and checkoutPage directly, instead of repeatedly creating them with new ...Page(page).

In practice, implementing POM in Playwright setup looks like this:

Create one class per page or major UI area.
Put locators and page actions inside that class.
Keep test scenarios and assertions in the spec files.
Reuse page objects through fixtures so setup stays clean.

A good mental model is:

Page object = “how to interact with the page”
Test file = “what behavior we are verifying”

Verification:
npm run typecheck
npm run typecheck passed, and npx playwright test tests/saucedemo-login.spec.ts --project=chromium
