import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test ('it does x', async ({page}) => {
  await page.locator('text=Select Audio').setInputFiles('./shrtchrd02.wav');
  await page.locator('input[type="checkbox"]').check();
  await page.locator('button:has-text("Play")').click();
  await page.locator('button:has-text("Stop")').click();
})