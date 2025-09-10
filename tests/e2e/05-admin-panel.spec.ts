import { test, expect } from '@playwright/test';

test.describe('Admin Panel - Authentication & Dashboard', () => {
  test('should login to admin panel', async ({ page }) => {
    await page.goto('/admin/login');

    // Fill admin login form
    await page.locator('input[name="email"], input[type="email"]').fill('admin@example.com');
    await page.locator('input[name="password"], input[type="password"]').fill('admin123');

    // Submit form
    await page.locator('button[type="submit"], [data-testid="login-button"]').click();

    // Verify admin dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test('should access admin dashboard with statistics', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Verify dashboard elements
    await expect(page.locator('.dashboard-stats, [data-testid="stats"]')).toBeVisible();
    await expect(page.locator('nav, .sidebar')).toBeVisible();
  });

  test('should navigate admin menu', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Test navigation menu
    const menuItems = page.locator('nav a, .sidebar a');
    const itemCount = await menuItems.count();

    for (let i = 0; i < Math.min(itemCount, 5); i++) {
      const menuItem = menuItems.nth(i);
      const href = await menuItem.getAttribute('href');
      if (href && href.includes('/admin/')) {
        await expect(menuItem).toBeVisible();
      }
    }
  });
});

test.describe('Admin Panel - Product Management', () => {
  test('should view products list', async ({ page }) => {
    await page.goto('/admin/dashboard');

    // Navigate to products
    const productsLink = page.locator('a[href*="products"]').first();
    await productsLink.click();

    // Verify products table/list
    await expect(page.locator('.products-table, [data-testid="products-list"]')).toBeVisible();
  });

  test('should create new product', async ({ page }) => {
    await page.goto('/admin/products');

    // Click add product button
    const addButton = page.locator('a[href*="create"], button').filter({ hasText: /add|create|new/i }).first();
    await addButton.click();

    // Fill product form
    await page.locator('input[name="name"]').fill('Test Product');
    await page.locator('input[name="price"]').fill('99.99');
    await page.locator('textarea[name="description"]').fill('Test product description');

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Verify success
    await expect(page.locator('.success, .alert-success')).toBeVisible();
  });

  test('should edit existing product', async ({ page }) => {
    await page.goto('/admin/products');

    // Click edit on first product
    const editButton = page.locator('a[href*="edit"], button').filter({ hasText: /edit/i }).first();
    await editButton.click();

    // Update product details
    await page.locator('input[name="name"]').fill('Updated Test Product');

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Verify success
    await expect(page.locator('.success, .alert-success')).toBeVisible();
  });

  test('should manage categories', async ({ page }) => {
    await page.goto('/admin/categories');

    // Click add category
    const addButton = page.locator('a[href*="create"], button').filter({ hasText: /add|create/i }).first();
    if (await addButton.isVisible()) {
      await addButton.click();

      // Fill category form
      await page.locator('input[name="name"]').fill('Test Category');

      // Submit
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.success')).toBeVisible();
    }
  });
});

test.describe('Admin Panel - Order Management', () => {
  test('should view orders list', async ({ page }) => {
    await page.goto('/admin/orders');

    // Verify orders table
    await expect(page.locator('.orders-table, [data-testid="orders-list"]')).toBeVisible();
  });

  test('should process order', async ({ page }) => {
    await page.goto('/admin/orders');

    // Click on first order
    const firstOrder = page.locator('tr, .order-item').first();
    await firstOrder.click();

    // Update order status
    const statusSelect = page.locator('select[name="status"]');
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption('processing');

      // Submit
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.success')).toBeVisible();
    }
  });

  test('should generate invoice', async ({ page }) => {
    await page.goto('/admin/orders');

    // Find invoice button
    const invoiceButton = page.locator('a[href*="invoice"], button').filter({ hasText: /invoice/i }).first();
    if (await invoiceButton.isVisible()) {
      await invoiceButton.click();
      // Verify invoice page or download
      await expect(page.locator('.invoice, [data-testid="invoice"]')).toBeVisible();
    }
  });
});

test.describe('Admin Panel - User Management', () => {
  test('should view users list', async ({ page }) => {
    await page.goto('/admin/users');

    // Verify users table
    await expect(page.locator('.users-table, [data-testid="users-list"]')).toBeVisible();
  });

  test('should create new user', async ({ page }) => {
    await page.goto('/admin/users');

    // Click add user
    const addButton = page.locator('a[href*="create"], button').filter({ hasText: /add|create/i }).first();
    await addButton.click();

    // Fill user form
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill(`test${Date.now()}@example.com`);
    await page.locator('input[name="password"]').fill('password123');

    // Submit
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('.success')).toBeVisible();
  });

  test('should manage user roles', async ({ page }) => {
    await page.goto('/admin/users');

    // Click edit on first user
    const editButton = page.locator('a[href*="edit"], button').filter({ hasText: /edit/i }).first();
    await editButton.click();

    // Update role
    const roleSelect = page.locator('select[name="role"]');
    if (await roleSelect.isVisible()) {
      await roleSelect.selectOption('manager');

      // Submit
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.success')).toBeVisible();
    }
  });
});
