import { test, expect } from '@playwright/test';

test('Amazon title validation', async ({ page }) => {
  // Navigate to Amazon
  await page.goto('https://www.amazon.in');
  
  // Verify the page title
  const title = await page.title();
  console.log('Page title:', title);
  
  // Assert that the title contains "Amazon"
  expect(title).toContain('Amazon');
}); 