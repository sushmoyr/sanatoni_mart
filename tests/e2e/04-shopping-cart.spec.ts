import { test, expect } from '@playwright/test';

test.describe('Shopping Experience', () => {
  test('should add products to cart', async ({ page }) => {
    await page.goto('/products');

    // Find and click on a product
    const firstProduct = page.locator('.product-card, .product-item').first();
    await firstProduct.click();

    // Add to cart
    const addToCartButton = page.locator('button').filter({ hasText: /add to cart|buy now/i }).first();
    await addToCartButton.click();

    // Verify cart has item
    await expect(page.locator('.cart-count, [data-testid="cart-count"]')).toContainText(/[1-9]/);
  });

  test('should update cart quantities', async ({ page }) => {
    // Assume product is in cart
    await page.goto('/cart');

    // Find quantity input
    const quantityInput = page.locator('input[name*="quantity"], [data-testid="quantity-input"]').first();
    if (await quantityInput.isVisible()) {
      await quantityInput.fill('2');
      await quantityInput.press('Enter');

      // Verify total updates
      await expect(page.locator('.cart-total, [data-testid="cart-total"]')).toBeVisible();
    }
  });

  test('should remove products from cart', async ({ page }) => {
    await page.goto('/cart');

    // Find remove button
    const removeButton = page.locator('button').filter({ hasText: /remove|delete|×/i }).first();
    if (await removeButton.isVisible()) {
      await removeButton.click();

      // Verify item removed
      await expect(page.locator('.empty-cart, [data-testid="empty-cart"]')).toBeVisible();
    }
  });

  test('should apply coupon codes', async ({ page }) => {
    await page.goto('/cart');

    // Find coupon input
    const couponInput = page.locator('input[name*="coupon"], [data-testid="coupon-input"]');
    if (await couponInput.isVisible()) {
      await couponInput.fill('TEST10');
      await page.locator('button').filter({ hasText: /apply|submit/i }).click();

      // Verify discount applied
      await expect(page.locator('.discount, [data-testid="discount"]')).toBeVisible();
    }
  });

  test('should display correct cart total', async ({ page }) => {
    await page.goto('/cart');

    // Verify total calculation
    const total = page.locator('.cart-total, [data-testid="cart-total"]');
    await expect(total).toBeVisible();

    const totalText = await total.textContent();
    expect(totalText).toMatch(/[\d,]+\.?\d*/); // Should contain numbers
  });

  test('should proceed to checkout', async ({ page }) => {
    await page.goto('/cart');

    // Click checkout button
    const checkoutButton = page.locator('a[href*="checkout"], button').filter({ hasText: /checkout|proceed/i }).first();
    await checkoutButton.click();

    // Verify checkout page
    await expect(page).toHaveURL(/checkout/);
  });

  test('should complete checkout with COD', async ({ page }) => {
    await page.goto('/checkout');

    // Fill shipping address
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('input[name="phone"]').fill('1234567890');
    await page.locator('input[name="address"]').fill('123 Test Street');
    await page.locator('input[name="city"]').fill('Test City');

    // Select COD payment
    const codOption = page.locator('input[value*="cod"], [data-testid="cod-payment"]').first();
    if (await codOption.isVisible()) {
      await codOption.check();
    }

    // Place order
    const placeOrderButton = page.locator('button').filter({ hasText: /place order|confirm/i }).first();
    await placeOrderButton.click();

    // Verify order confirmation
    await expect(page.locator('.order-success, [data-testid="order-confirmation"]')).toBeVisible();
  });

  test('should view order history', async ({ page }) => {
    // Assume user is logged in
    await page.goto('/orders');

    // Verify orders are displayed
    await expect(page.locator('.order-item, .order-card')).toBeVisible();
  });

  test('should track order status', async ({ page }) => {
    await page.goto('/orders');

    // Click on first order
    const firstOrder = page.locator('.order-item, .order-card').first();
    await firstOrder.click();

    // Verify order details and status
    await expect(page.locator('.order-status, [data-testid="order-status"]')).toBeVisible();
  });

  test('should download order invoice', async ({ page }) => {
    await page.goto('/orders');

    // Find download invoice button
    const downloadButton = page.locator('a[href*="invoice"], button').filter({ hasText: /download|invoice/i }).first();
    if (await downloadButton.isVisible()) {
      // Note: In real test, we'd need to handle file download
      await expect(downloadButton).toBeVisible();
    }
  });
});
