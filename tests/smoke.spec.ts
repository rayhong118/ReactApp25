import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/auth",
  "/settings",
  "/about",
  "/eat",
  "/drawings",
  "/experiments/fileUpload",
  "/experiments/formValidation",
  "/experiments/moveLists",
  "/experiments/stopWatch",
  "/experiments/imageCarousels",
  "/experiments/ticTacToe",
  "/gifts",
];

test.describe("Smoke Tests - Navigation and Errors", () => {
  routes.forEach((route) => {
    test(`should navigate to ${route} without console errors`, async ({
      page,
    }) => {
      const errors: string[] = [];

      // Listen for console errors
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const text = msg.text();
          // Filter out common network noise that isn't a React crash
          if (text.includes("Failed to load resource")) return;
          if (text.includes("the server responded with a status of 403"))
            return;
          if (text.includes("window[S2][Cc()] is undefined")) return;
          if (text.includes("window[") && text.includes("] is undefined"))
            return;
          if (
            text.includes("can't access property") &&
            text.includes("is undefined")
          )
            return;
          if (text.includes("Missing required parameters: sitekey")) return;
          if (
            text.toLowerCase().includes("content security policy") &&
            text.toLowerCase().includes("report-only")
          )
            return;

          errors.push(text);
        }
      });

      // Listen for uncaught exceptions
      page.on("pageerror", (exception) => {
        errors.push(exception.message);
      });

      await page.goto(route);

      // Wait for the navigation logo to be visible, ensuring the page has rendered
      await expect(page.getByLabel("Go to home")).toBeVisible();

      // Assert that no errors were caught
      expect(
        errors,
        `Found console errors during navigation:\n${errors.join("\n")}`,
      ).toEqual([]);
    });
  });
});
