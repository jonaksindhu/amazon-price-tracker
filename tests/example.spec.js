const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('https://www.amazon.in');
  await expect(page).toHaveTitle(/Amazon/);
}); 