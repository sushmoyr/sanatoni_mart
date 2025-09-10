import { test, expect } from '@playwright/test';

test.describe('User Authentication & Account Management', () => {
  test('should register new user with valid data', async ({ page }) => {
    await page.goto('/');

    // Navigate to registration page
    const registerLink = page.locator('a[href*="register"], a[href*="signup"]').first();
    if (await registerLink.isVisible()) {
      await registerLink.click();
    } else {
      await page.goto('/register');
    }

    // Fill registration form
    const email = `test${Date.now()}@example.com`;
    await page.locator('input[name="email"], input[type="email"]').fill(email);
    await page.locator('input[name="password"], input[type="password"]').first().fill('password123');
    await page.locator('input[name="password_confirmation"]').fill('password123');
    await page.locator('input[name="name"]').fill('Test User');

    // Submit form
    await page.locator('button[type="submit"], [data-testid="register-button"]').click();

    // Verify successful registration or email verification required
    await expect(page).toHaveURL(/\/dashboard|\/email\/verify|\/login/);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.locator('input[name="email"], input[type="email"]').fill('test@example.com');
    await page.locator('input[name="password"], input[type="password"]').fill('password123');

    // Submit form
    await page.locator('button[type="submit"], [data-testid="login-button"]').click();

    // Verify successful login
    await expect(page).toHaveURL(/\/dashboard|\/home/);
  });

  test('should handle invalid login credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill with invalid credentials
    await page.locator('input[name="email"], input[type="email"]').fill('invalid@example.com');
    await page.locator('input[name="password"], input[type="password"]').fill('wrongpassword');

    // Submit form
    await page.locator('button[type="submit"], [data-testid="login-button"]').click();

    // Verify error message
    await expect(page.locator('.error, .alert-danger, [data-testid="error-message"]')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Assume user is logged in
    await page.goto('/dashboard');

    // Find logout button/link
    const logoutButton = page.locator('a[href*="logout"], button').filter({ hasText: /logout|sign out/i }).first();
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL('/');
    }
  });

  test('should reset password', async ({ page }) => {
    await page.goto('/password/reset');

    // Fill email for password reset
    await page.locator('input[name="email"], input[type="email"]').fill('test@example.com');

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Verify success message
    await expect(page.locator('.success, .alert-success')).toContainText(/password reset|check your email/i);
  });

  test('should update password from profile', async ({ page }) => {
    // Assume user is logged in
    await page.goto('/profile');

    // Navigate to password change section
    const passwordTab = page.locator('a[href*="password"], button').filter({ hasText: /password|security/i });
    if (await passwordTab.isVisible()) {
      await passwordTab.click();
    }

    // Fill password change form
    await page.locator('input[name="current_password"]').fill('oldpassword');
    await page.locator('input[name="password"]').fill('newpassword123');
    await page.locator('input[name="password_confirmation"]').fill('newpassword123');

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Verify success
    await expect(page.locator('.success, .alert-success')).toBeVisible();
  });

  test('should manage user profile', async ({ page }) => {
    await page.goto('/profile');

    // Update profile information
    await page.locator('input[name="name"]').fill('Updated Name');
    await page.locator('input[name="email"]').fill('updated@example.com');

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Verify success
    await expect(page.locator('.success, .alert-success')).toBeVisible();
  });

  test('should manage addresses', async ({ page }) => {
    await page.goto('/profile');

    // Navigate to addresses section
    const addressesTab = page.locator('a[href*="address"], button').filter({ hasText: /address/i });
    if (await addressesTab.isVisible()) {
      await addressesTab.click();
    }

    // Add new address
    const addAddressButton = page.locator('button').filter({ hasText: /add address|new address/i });
    if (await addAddressButton.isVisible()) {
      await addAddressButton.click();

      // Fill address form
      await page.locator('input[name="street"]').fill('123 Test Street');
      await page.locator('input[name="city"]').fill('Test City');
      await page.locator('input[name="postal_code"]').fill('12345');

      // Submit
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.success')).toBeVisible();
    }
  });
});
