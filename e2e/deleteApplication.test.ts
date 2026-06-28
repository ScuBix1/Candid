import { expect, test } from '@playwright/test';
import fr from '../messages/fr.json';

const testPassword = 'Test12345!';
const testEmail = 'bastian.monnin@gmail.com';

test.describe('Delete Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
    await page.fill('#email', testEmail);
    await page.fill('#password', testPassword);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('/dashboard');

    await page.click('button:has-text("+ Candidature")');
    await page.waitForSelector('[role="dialog"]');
    await page.waitForTimeout(300);
    await page.fill('#company', `ToDelete-${Date.now()}`);
    await page.fill('#role', 'Test Role');
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await page.waitForSelector('[role="dialog"]', { state: 'hidden' });

    await page
      .locator('[data-slot="kanban-card"]')
      .first()
      .locator('button:has-text("Supprimer")')
      .click();
    await page.waitForSelector('[role="dialog"]');
    await page.waitForTimeout(300);
  });

  test('affiche le modal de confirmation', async ({ page }) => {
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('[role="dialog"]')).toContainText(
      fr.dashboard.application.deleteModal.message
    );
  });

  test('annule la suppression avec le bouton annuler', async ({ page }) => {
    await page
      .locator('[role="dialog"]')
      .getByRole('button', { name: fr.dashboard.application.deleteModal.cancel })
      .click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('supprime la candidature après confirmation', async ({ page }) => {
    await page
      .locator('[role="dialog"]')
      .getByRole('button', { name: fr.dashboard.application.deleteModal.confirmButton })
      .click();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });
});
