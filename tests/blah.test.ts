import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('localhost:3000');
});

test ('it does x', async ({page}) => {
  await page.locator('text=Select Audio').setInputFiles('./shrtchrd02.wav');
  await page.locator('input[type="checkbox"]').check();
  await page.locator('text=Play').click();
  await page.locator('text=Stop').click();
})