import { expect, test } from '@playwright/test';
import fr from '../messages/fr.json';

const testPassword = 'TestP@ssw0rd!';

test.describe('Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test("rejette si le nom d'affichage fait moins de 2 caractères", async ({ page }) => {
    await page.fill('#displayName', 'J');
    await page.fill('#email', 'john@example.com');
    await page.fill('#password', testPassword);
    await page.fill('#confirmPassword', testPassword);
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.auth.signup.errors.displayNameTooShort
    );
    await expect(page).not.toHaveURL('/dashboard');
  });

  test('rejette un email invalide', async ({ page }) => {
    await page.fill('#displayName', 'John Doe');
    await page.fill('#email', 'pasunemail@');
    await page.fill('#password', testPassword);
    await page.fill('#confirmPassword', testPassword);
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.auth.signup.errors.emailInvalid
    );
    await expect(page).not.toHaveURL('/dashboard');
  });

  test('rejette si les mots de passe ne correspondent pas', async ({ page }) => {
    await page.fill('#displayName', 'John Doe');
    await page.fill('#email', 'john@example.com');
    await page.fill('#password', testPassword);
    await page.fill('#confirmPassword', 'Différent1!');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.auth.signup.errors.passwordMismatch
    );
    await expect(page).not.toHaveURL('/dashboard');
  });

  test('rejette si le mot de passe fait moins de 8 caractères', async ({ page }) => {
    await page.fill('#displayName', 'John Doe');
    await page.fill('#email', 'john@example.com');
    await page.fill('#password', 'Passw1!');
    await page.fill('#confirmPassword', 'Passw1!');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.auth.signup.errors.passwordTooShort
    );
    await expect(page).not.toHaveURL('/dashboard');
  });

  test("rejette si le mot de passe n'a pas de caractère spécial", async ({ page }) => {
    await page.fill('#displayName', 'John Doe');
    await page.fill('#email', 'john@example.com');
    await page.fill('#password', 'Password1');
    await page.fill('#confirmPassword', 'Password1');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.auth.signup.errors.passwordNoSpecialChar
    );
    await expect(page).not.toHaveURL('/dashboard');
  });

  test("rejette si le mot de passe n'a pas de majuscule", async ({ page }) => {
    await page.fill('#displayName', 'John Doe');
    await page.fill('#email', 'john@example.com');
    await page.fill('#password', 'password1!');
    await page.fill('#confirmPassword', 'password1!');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.auth.signup.errors.passwordNoUppercase
    );
    await expect(page).not.toHaveURL('/dashboard');
  });

  test("rejette si le mot de passe n'a pas de chiffre", async ({ page }) => {
    await page.fill('#displayName', 'John Doe');
    await page.fill('#email', 'john@example.com');
    await page.fill('#password', 'Password!');
    await page.fill('#confirmPassword', 'Password!');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.auth.signup.errors.passwordNoNumber
    );
    await expect(page).not.toHaveURL('/dashboard');
  });

  test('accepte si toutes les données sont valides', async ({ page }) => {
    await page.fill('#displayName', 'John Doe');
    await page.fill('#email', `test-${Date.now()}@example.com`);
    await page.fill('#password', testPassword);
    await page.fill('#confirmPassword', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
});
