import { test, expect } from '@playwright/test';

test('should display file list on load and allow clicking first folder to see nested files', async ({ page }) => {
  await page.goto('/');

  // Wait for the file list to be visible
  await expect(page.locator('.file-list')).toBeVisible();

  // Verify root level file names are displayed (getMockData generates file1.txt, file2.txt, file3.txt, file4.txt, folder1, folder2)
  await expect(page.locator('text=file1.txt')).toBeVisible();
  await expect(page.locator('text=file2.txt')).toBeVisible();
  await expect(page.locator('text=file3.txt')).toBeVisible();
  await expect(page.locator('text=file4.txt')).toBeVisible();
  await expect(page.locator('text=folder1')).toBeVisible();
  await expect(page.locator('text=folder2')).toBeVisible();

  // Click on the first folder (folder1)
  const folder1Item = page.locator('.folder-item:has-text("folder1")').first();
  await folder1Item.click();

  // Wait for nested files to appear (clicking a folder calls getMockData() again, which generates the same pattern)
  // Find the nested-files container that appears after clicking folder1
  const nestedFilesContainer = page.locator('.file-item:has(.folder-item:has-text("folder1")) .nested-files');
  await expect(nestedFilesContainer).toBeVisible({ timeout: 5000 });

  // Verify nested file names are displayed within the nested files container
  await expect(nestedFilesContainer.locator('text=file1.txt')).toBeVisible();
  await expect(nestedFilesContainer.locator('text=file2.txt')).toBeVisible();
  await expect(nestedFilesContainer.locator('text=file3.txt')).toBeVisible();
  await expect(nestedFilesContainer.locator('text=file4.txt')).toBeVisible();
  await expect(nestedFilesContainer.locator('text=folder1')).toBeVisible();
  await expect(nestedFilesContainer.locator('text=folder2')).toBeVisible();
});
