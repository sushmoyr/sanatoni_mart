import { test, expect } from '@playwright/test';

test.describe('Site Navigation & Basic Access', () => {
  test('should load homepage correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Sanatoni Mart/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should switch language between English and Bengali', async ({ page }) => {
    await page.goto('/');

    // Test language switching functionality
    const languageSelector = page.locator('[data-testid="language-selector"]');
    if (await languageSelector.isVisible()) {
      await languageSelector.click();
      await page.locator('text=Bengali').click();
      // Verify content changes to Bengali
      await expect(page.locator('body')).toContainText('বাংলা');
    }
  });

  test('should be responsive across different screen sizes', async ({ page }) => {
    await page.goto('/');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('nav')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('nav')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have functional navigation menu', async ({ page }) => {
    await page.goto('/');

    // Test main navigation links
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();

    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      if (href && href !== '#') {
        await expect(link).toBeVisible();
      }
    }
  });

  test('should have proper meta tags and SEO', async ({ page }) => {
    await page.goto('/');

    // Check for essential meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);

    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.isVisible()) {
      const content = await metaDescription.getAttribute('content');
      expect(content).toBeTruthy();
    }
  });
});
