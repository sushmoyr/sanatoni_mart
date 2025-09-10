import { test, expect } from '@playwright/test';

test.describe('Product Browsing & Catalog', () => {
  test('should browse product catalog without authentication', async ({ page }) => {
    await page.goto('/');

    // Navigate to products section
    const productsLink = page.locator('a[href*="products"], a[href*="catalog"], nav a').filter({ hasText: /products|catalog|shop/i }).first();
    if (await productsLink.isVisible()) {
      await productsLink.click();
    } else {
      // Try to find products on homepage
      await page.goto('/products');
    }

    // Verify products are displayed
    await expect(page.locator('.product-card, .product-item, [data-testid*="product"]')).toBeVisible();
  });

  test('should use search functionality', async ({ page }) => {
    await page.goto('/');

    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], [data-testid="search-input"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('test product');
      await searchInput.press('Enter');

      // Verify search results
      await expect(page.locator('body')).toContainText(/search results|products|no results/i);
    }
  });

  test('should apply category and price filters', async ({ page }) => {
    await page.goto('/products');

    // Test category filter
    const categoryFilter = page.locator('select[name*="category"], [data-testid="category-filter"]');
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption({ index: 1 });
      await expect(page.locator('.product-card')).toBeVisible();
    }

    // Test price filter if available
    const priceFilter = page.locator('input[type="range"], [data-testid="price-filter"]');
    if (await priceFilter.isVisible()) {
      await priceFilter.fill('50');
    }
  });

  test('should sort products by different criteria', async ({ page }) => {
    await page.goto('/products');

    const sortSelect = page.locator('select[name*="sort"], [data-testid="sort-select"]');
    if (await sortSelect.isVisible()) {
      // Test different sort options
      const options = await sortSelect.locator('option').all();
      for (const option of options.slice(0, 3)) {
        const value = await option.getAttribute('value');
        if (value) {
          await sortSelect.selectOption(value);
          await expect(page.locator('.product-card')).toBeVisible();
        }
      }
    }
  });

  test('should view product details', async ({ page }) => {
    await page.goto('/products');

    // Click on first product
    const firstProduct = page.locator('.product-card, .product-item').first();
    await firstProduct.click();

    // Verify product details page
    await expect(page.locator('h1, .product-title')).toBeVisible();
    await expect(page.locator('.product-description, [data-testid="product-description"]')).toBeVisible();
  });

  test('should navigate between categories', async ({ page }) => {
    await page.goto('/');

    // Find category navigation
    const categoryLinks = page.locator('a[href*="category"], nav a').filter({ hasText: /category|categories/i });
    if (await categoryLinks.first().isVisible()) {
      await categoryLinks.first().click();
      await expect(page.locator('.category-list, .products-grid')).toBeVisible();
    }
  });

  test('should handle pagination', async ({ page }) => {
    await page.goto('/products');

    // Check for pagination
    const pagination = page.locator('.pagination, [data-testid="pagination"]');
    if (await pagination.isVisible()) {
      const nextButton = pagination.locator('button, a').filter({ hasText: /next|>|2/i }).first();
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await expect(page.locator('.product-card')).toBeVisible();
      }
    }
  });

  test('should display product availability and stock status', async ({ page }) => {
    await page.goto('/products');

    // Check for stock indicators
    const stockIndicators = page.locator('.stock-status, .availability, [data-testid*="stock"]');
    if (await stockIndicators.first().isVisible()) {
      await expect(stockIndicators.first()).toContainText(/in stock|out of stock|available/i);
    }
  });
});
