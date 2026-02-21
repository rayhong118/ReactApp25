import { test, expect } from "@playwright/experimental-ct-react";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";

test("primary button", async ({ mount }) => {
  const primaryButton = await mount(<PrimaryButton>Button</PrimaryButton>);

  await expect(primaryButton).toHaveText("Button");
  await expect(primaryButton).toHaveAttribute("data-testid", "primary-button");
});

test("primary button hover state", async ({ mount }) => {
  const component = await mount(<PrimaryButton>Hover Me</PrimaryButton>);

  // Simulate hover
  await component.hover();

  // Verify background color changes to brand-vibrant (rgb(249, 115, 22))
  await expect(component).toHaveCSS("background-color", "rgb(249, 115, 22)");
});

test("primary button disabled state", async ({ mount }) => {
  const component = await mount(
    <PrimaryButton disabled>Disabled</PrimaryButton>,
  );

  // Verify element is disabled
  await expect(component).toBeDisabled();

  // Verify background color is gray-400 (rgb(156, 163, 175))
  await expect(component).toHaveCSS("background-color", "rgb(156, 163, 175)");
});

test("secondary button", async ({ mount }) => {
  const secondaryButton = await mount(
    <SecondaryButton>Button</SecondaryButton>,
  );

  await expect(secondaryButton).toHaveText("Button");
  await expect(secondaryButton).toHaveAttribute(
    "data-testid",
    "secondary-button",
  );
});

test("secondary button hover state", async ({ mount }) => {
  const component = await mount(<SecondaryButton>Hover Me</SecondaryButton>);

  // Simulate hover
  await component.hover();

  // Verify background color changes to brand-vibrant (rgb(249, 115, 22))
  await expect(component).toHaveCSS("background-color", "rgb(249, 115, 22)");
});

test("secondary button disabled state", async ({ mount }) => {
  const component = await mount(
    <SecondaryButton disabled>Disabled</SecondaryButton>,
  );

  // Verify element is disabled
  await expect(component).toBeDisabled();

  // Verify background color is gray-400 (rgb(156, 163, 175))
  await expect(component).toHaveCSS("background-color", "rgb(156, 163, 175)");
});
