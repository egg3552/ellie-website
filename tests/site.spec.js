const { test, expect } = require('@playwright/test');

for (const width of [320, 390, 768, 1440]) {
  test(`page loads without overflow at ${width}px on the GitHub Pages path`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/ellie-website/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('A little colour.');
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await page.locator('a[href^="mailto:"], a[href*="instagram.com"]').count()).toBe(0);
    expect(await page.locator('body').innerText()).not.toMatch(/Ellie/);
    expect(errors).toEqual([]);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `.preview/site-${width}.png`, fullPage: true });
  });
}

test('mobile menu opens, follows section links and supports Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  const navigation = page.getByRole('navigation');
  await expect(navigation).not.toBeVisible();
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await navigation.getByRole('link', { name: 'The making table' }).click();
  await expect(page).toHaveURL(/#story$/);
  await expect(navigation).not.toBeVisible();
  await menu.click();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
});

test('FAQ works with the keyboard and section links have targets', async ({ page }) => {
  await page.goto('/');
  const question = page.locator('summary').filter({ hasText: 'Can I buy through the website?' });
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('For now, this is a place')).toBeVisible();
  expect(await page.locator('a[href^="#"]').evaluateAll(links => links.every(link => link.hash === '' || Boolean(document.querySelector(link.hash))))).toBe(true);
});

test('content and mobile navigation remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.locator('summary').first().click();
  await expect(page.getByText('Hand-painted stones and other small arts and crafts.')).toBeVisible();
  await context.close();
});
