const { test, expect } = require('@playwright/test');

test.describe('Fit and Finish', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
  });

  // Header & Navigation
  test('header renders with logo, nav, and buttons', async ({ page, isMobile }) => {
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.logo')).toBeVisible();
    if (!isMobile) {
      await expect(page.locator('.nav-links')).toBeVisible();
    }
    await expect(page.locator('#themeToggle')).toBeVisible();
    await expect(page.locator('#createPodBtn')).toBeVisible();
  });

  test('navigation links work', async ({ page, isMobile }) => {
    if (isMobile) {
      await page.click('#hamburgerBtn');
      await page.waitForTimeout(300);
    }
    // Click Pod Proposals
    await page.click('[data-page="proposals"]');
    await expect(page.locator('#page-proposals')).toBeVisible();

    if (isMobile) {
      await page.click('#hamburgerBtn');
      await page.waitForTimeout(300);
    }
    // Click How It Works
    await page.click('[data-page="howitworks"]');
    await expect(page.locator('#page-howitworks')).toBeVisible();

    if (isMobile) {
      await page.click('#hamburgerBtn');
      await page.waitForTimeout(300);
    }
    // Click back to Dashboard
    await page.click('[data-page="dashboard"]');
    await expect(page.locator('#page-dashboard')).toBeVisible();
  });

  // Theme Toggle
  test('dark/light mode toggle works', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Toggle to light
    await page.click('#themeToggle');
    await expect(html).toHaveAttribute('data-theme', 'light');

    // Toggle back to dark
    await page.click('#themeToggle');
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('theme persists across navigation', async ({ page }) => {
    await page.click('#themeToggle'); // switch to light
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Reload page
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  // Favicon
  test('favicon is present', async ({ page }) => {
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute('href', 'favicon.svg');
  });

  // Create Pod Modal
  test('create pod modal opens and closes', async ({ page }) => {
    await page.click('#createPodBtn');
    await expect(page.locator('#createModal')).toHaveClass(/open/);

    await page.click('#closeCreateModal');
    await expect(page.locator('#createModal')).not.toHaveClass(/open/);
  });

  // About Section
  test('about section is visible on How It Works page', async ({ page, isMobile }) => {
    if (isMobile) {
      await page.click('#hamburgerBtn');
      await page.waitForTimeout(300);
    }
    await page.click('[data-page="howitworks"]');
    await expect(page.locator('.about-section')).toBeVisible();
    await expect(page.locator('.about-creator')).toBeVisible();
  });

  // Space Background
  test('space canvas is present', async ({ page }) => {
    await expect(page.locator('#spaceCanvas')).toBeVisible();
  });

  // Responsive / Mobile (only in Mobile project)
  test('hamburger menu works on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test');

    const hamburger = page.locator('#hamburgerBtn');
    await expect(hamburger).toBeVisible();

    // Click hamburger to open nav
    await hamburger.click();
    await expect(page.locator('.nav-links')).toHaveClass(/nav-open/);

    // Click a link to close
    await page.click('[data-page="proposals"]');
    await expect(page.locator('.nav-links')).not.toHaveClass(/nav-open/);
  });

  // Visual consistency checks
  test('tiles container exists on dashboard', async ({ page }) => {
    await expect(page.locator('#dashboard-tiles')).toBeVisible();
  });

  test('modal backdrop has blur effect', async ({ page }) => {
    await page.click('#createPodBtn');
    const overlay = page.locator('#createModal');
    await expect(overlay).toBeVisible();
    const backdropFilter = await overlay.evaluate(el => getComputedStyle(el).backdropFilter);
    expect(backdropFilter).toContain('blur');
  });
});
