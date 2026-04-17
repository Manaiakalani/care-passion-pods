const { test } = require('@playwright/test');
const path = require('path');

const screenshotDir = path.join(__dirname, '..', 'screenshots');

test.describe('README Screenshots', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('dashboard dark mode', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(screenshotDir, 'dashboard-dark.png'), fullPage: false });
  });

  test('dashboard light mode', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await page.click('#themeToggle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, 'dashboard-light.png'), fullPage: false });
  });

  test('proposals dark mode', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await page.click('[data-page="proposals"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, 'proposals-dark.png'), fullPage: false });
  });

  test('how it works dark mode', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await page.click('[data-page="howitworks"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, 'how-it-works-dark.png'), fullPage: false });
  });

  test('create modal dark mode', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await page.click('#createPodBtn');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, 'create-modal-dark.png'), fullPage: false });
  });

  test('mobile dashboard dark mode', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotDir, 'mobile-dashboard-dark.png'), fullPage: false });
  });

  test('mobile menu open dark mode', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await page.click('#hamburgerBtn');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, 'mobile-menu-dark.png'), fullPage: false });
  });
});
