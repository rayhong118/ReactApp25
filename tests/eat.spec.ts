import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Eat Page - Menu Upload Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Append testMode=true to bypass auth checks for the upload UI
    await page.goto("/eat?testMode=true");
  });

  test("should navigate to a restaurant and show upload options", async ({
    page,
  }) => {
    // Wait for the restaurant list to load
    const restaurantCard = page.locator(".eat-card").first();
    await expect(restaurantCard).toBeVisible();

    // Click on the specific "Menu" button inside the card to open the dialog
    await restaurantCard.getByTestId("menu-button").click();

    // Check for the "Submit Menu Image" button
    const uploadImageButton = page.getByRole("button", {
      name: /submit menu image/i,
    });
    await expect(uploadImageButton).toBeVisible();

    await uploadImageButton.click();

    // Verify "Select Image" button appears
    await expect(
      page.getByRole("button", { name: /select image/i }),
    ).toBeVisible();
  });

  test("should simulate selecting a menu image and show preview", async ({
    page,
  }) => {
    const restaurantCard = page.locator(".eat-card").first();
    await restaurantCard.getByTestId("menu-button").click();

    await page.getByRole("button", { name: /submit menu image/i }).click();

    // Use the logo as a dummy image for the upload test
    const dummyImagePath = path.resolve(
      __dirname,
      "../apps/web/public/2017dh.png",
    );

    // Playwright file chooser simulation
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: /select image/i }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(dummyImagePath);

    // Verify image preview is displayed
    const previewImage = page.locator("img[alt='Menu']");
    await expect(previewImage).toBeVisible();

    // Verify the "Submit" button is now enabled/visible
    const submitButton = page
      .getByRole("button", { name: /submit/i })
      .filter({ hasText: /^Submit$/ });
    await expect(submitButton).toBeEnabled();
  });
});
