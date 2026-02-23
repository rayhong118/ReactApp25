import { test, expect } from "@playwright/test";

test.describe("Authentication Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth");
  });

  test("should display login options", async ({ page }) => {
    // Verify title is visible (using a generic locator for the heading)
    await expect(page.locator("h2")).toBeVisible();

    // Verify Google sign-in button is present
    // We search by text since it's translated, typically "Google" is a stable part of the key or text
    const googleButton = page.getByRole("button", { name: /google/i });
    await expect(googleButton).toBeVisible();

    // Verify GitHub sign-in button is present
    const githubButton = page.getByRole("button", { name: /github/i });
    await expect(githubButton).toBeVisible();
  });

  test("should have a functional logo link to home", async ({ page }) => {
    const logoButton = page.getByLabel("Go to home");
    await expect(logoButton).toBeVisible();
    await logoButton.click();
    await expect(page).toHaveURL("/");
  });
});
