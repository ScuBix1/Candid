import { expect, test } from '@playwright/test';
import fr from '../messages/fr.json';

const testPassword = 'TestP@ssw0rd!';
const correctPassword = 'Test12345!';
const testEmail = 'bastian.monnin@gmail.com';

test.describe('Signin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
  });

  test('rejette si email est vide', async ({ page }) => {
    await page.fill('#email', '');
    await page.fill('#password', testPassword);
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.auth.signin.errors.emailInvalid
    );
    await expect(page).not.toHaveURL('/dashboard');
  });

  test('rejette un email invalide', async ({ page }) => {
    await page.fill('#email', 'pasunemail');
    await page.fill('#password', testPassword);
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.auth.signin.errors.emailInvalid
    );
    await expect(page).not.toHaveURL('/dashboard');
  });

  test('rejette si le mot de passe est vide', async ({ page }) => {
    await page.fill('#email', testEmail);
    await page.fill('#password', '');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.auth.signin.errors.passwordRequired
    );
    await expect(page).not.toHaveURL('/dashboard');
  });

  test('rejette avec des identifiants incorrects', async ({ page }) => {
    await page.fill('#email', 'wrong@example.com');
    await page.fill('#password', testPassword);
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.auth.signin.errors.invalidCredentials
    );
    await expect(page).not.toHaveURL('/dashboard');
  });

  test('rejette avec un bon email mais mauvais mot de passe', async ({ page }) => {
    await page.fill('#email', testEmail);
    await page.fill('#password', 'WrongP@ssw0rd!');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.auth.signin.errors.invalidCredentials
    );
    await expect(page).not.toHaveURL('/dashboard');
  });

  test('accepte avec des identifiants valides', async ({ page }) => {
    await page.fill('#email', testEmail);
    await page.fill('#password', correctPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
});
