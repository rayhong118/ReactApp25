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

          errors.push(text);
        }
      });

      // Listen for uncaught exceptions
      page.on("pageerror", (exception) => {
        errors.push(exception.message);
      });

      await page.goto(route);

      // Wait a bit for lazy-loaded components and potential hook errors to surface
      await page.waitForTimeout(1000);

      // Assert that no errors were caught
      expect(
        errors,
        `Found console errors during navigation:\n${errors.join("\n")}`,
      ).toEqual([]);
    });
  });
});
