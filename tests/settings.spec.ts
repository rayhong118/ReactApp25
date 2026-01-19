import { test, expect } from "@playwright/test";

test.describe("Settings Page Integration", () => {
  test.beforeEach(async ({ page }) => {
    // Listen for console errors specifically on the Settings page
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        if (text.includes("Failed to load resource")) return;
        if (text.includes("the server responded with a status of 403")) return;

        throw new Error(`Console error detected on Settings page: ${text}`);
      }
    });

    page.on("pageerror", (exception) => {
      throw new Error(
        `Page crash detected on Settings page: ${exception.message}`,
      );
    });
  });

  test("should render the Settings page without crashing", async ({ page }) => {
    await page.goto("/settings");

    // Check for "Language" section which is public
    await expect(page.locator("h2", { hasText: "Language" })).toBeVisible();

    // Check for "Theme" section
    await expect(page.locator("h2", { hasText: "Theme" })).toBeVisible();
  });

  test("should allow changing the language", async ({ page }) => {
    await page.goto("/settings");

    const languageSelect = page.locator("select").first();
    await expect(languageSelect).toBeVisible();

    // Change to Chinese (simplified) if available or just check interaction
    await languageSelect.selectOption("zh");

    // Verify it doesn't crash after interaction
    await page.waitForTimeout(500);
  });
});
