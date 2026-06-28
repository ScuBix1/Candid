import { expect, test } from '@playwright/test';
import fr from '../messages/fr.json';

const testPassword = 'Test12345!';
const testEmail = 'bastian.monnin@gmail.com';

test.describe('Edit Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/dashboard');

    await page
      .locator('[data-slot="kanban-card"]')
      .first()
      .locator('button:has-text("Modifier")')
      .click();
    await page.waitForSelector('[role="dialog"]');
    await page.waitForTimeout(300);
  });

  test('le modal est pré-rempli avec les données de la candidature', async ({ page }) => {
    const company = await page.locator('#company').inputValue();
    const role = await page.locator('#role').inputValue();
    expect(company).not.toBe('');
    expect(role).not.toBe('');
  });

  test('rejette si company est vide', async ({ page }) => {
    await page.fill('#company', '');
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.dashboard.application.form.errors.companyRequired
    );
  });

  test('rejette si role est vide', async ({ page }) => {
    await page.fill('#role', '');
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.dashboard.application.form.errors.roleRequired
    );
  });

  test('accepte la modification avec des données valides', async ({ page }) => {
    await page.fill('#company', `Doctrine-edited-${Date.now()}`);
    await page.fill('#role', 'Senior Frontend Developer');
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('ferme le modal après succès', async ({ page }) => {
    await page.fill('#company', `Edited-${Date.now()}`);
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});
