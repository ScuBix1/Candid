import { expect, test } from '@playwright/test';
import fr from '../messages/fr.json';

const testPassword = 'Test12345!';
const testEmail = 'bastian.monnin@gmail.com';

test.describe('Application Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/dashboard');
    await page.click('button:has-text("+ Candidature")');
    await page.waitForSelector('[role="dialog"]');
    await page.waitForTimeout(300);
  });

  // ===========================
  // Champs requis
  // ===========================

  test('rejette si company est vide', async ({ page }) => {
    await page.fill('#role', 'Frontend Developer');
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.dashboard.application.form.errors.companyRequired
    );
  });

  test('rejette si role est vide', async ({ page }) => {
    await page.fill('#company', 'Doctrine');
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.dashboard.application.form.errors.roleRequired
    );
  });

  // ===========================
  // Dépassement de longueur
  // ===========================

  test('rejette si company dépasse 100 caractères', async ({ page }) => {
    await page.fill('#company', 'A'.repeat(101));
    await page.fill('#role', 'Frontend Developer');
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.dashboard.application.form.errors.fieldTooLong.replace('{max}', '100')
    );
  });

  test('rejette si role dépasse 100 caractères', async ({ page }) => {
    await page.fill('#company', 'Doctrine');
    await page.fill('#role', 'A'.repeat(101));
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.dashboard.application.form.errors.fieldTooLong.replace('{max}', '100')
    );
  });

  test('rejette si notes dépasse 2000 caractères', async ({ page }) => {
    await page.fill('#company', 'Doctrine');
    await page.fill('#role', 'Frontend Developer');
    await page.fill('#notes', 'A'.repeat(2001));
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.dashboard.application.form.errors.fieldTooLong.replace('{max}', '2000')
    );
  });

  test('rejette si salary dépasse 50 caractères', async ({ page }) => {
    await page.fill('#company', 'Doctrine');
    await page.fill('#role', 'Frontend Developer');
    await page.fill('#salary', 'A'.repeat(51));
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expect(page.locator('[data-slot="field-error"]')).toHaveText(
      fr.dashboard.application.form.errors.fieldTooLong.replace('{max}', '50')
    );
  });

  // ===========================
  // Cas de succès
  // ===========================

  test('accepte avec les champs requis seulement', async ({ page }) => {
    await page.fill('#company', `Doctrine-${Date.now()}`);
    await page.fill('#role', 'Frontend Developer');
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('accepte avec tous les champs remplis', async ({ page }) => {
    await page.fill('#company', `Doctrine-${Date.now()}`);
    await page.fill('#role', 'Frontend Developer');
    await page.fill('#location', 'Paris');
    await page.fill('#source', 'LinkedIn');
    await page.fill('#salary', '45k');
    await page.fill('#notes', 'Très bonne opportunité');
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('ferme le modal après succès', async ({ page }) => {
    await page.fill('#company', `Doctrine-${Date.now()}`);
    await page.fill('#role', 'Frontend Developer');
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});
