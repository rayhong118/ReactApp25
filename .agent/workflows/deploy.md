---
description: How to build and deploy the monorepo to Firebase
---

# Firebase Deployment Workflow

To deploy the monorepo (Web App and Functions) to Firebase, follow these steps:

1. **Ensure dependencies are up to date**
   Run this in the root directory if you've recently added or changed packages:

   ```powershell
   node common/scripts/install-run-rush.js update
   ```

2. **Build all projects**
   This handles the dependency graph (e.g., building `@shared/types` before `functions`).

   ```powershell
   node common/scripts/install-run-rush.js build
   ```

3. **Deploy to Firebase**
   Run the standard Firebase CLI command from the root:
   ```powershell
   firebase deploy
   ```

> [!TIP]
> You can also deploy specific parts if you only changed one:
>
> - `firebase deploy --only hosting`
> - `firebase deploy --only functions`

> [!IMPORTANT]
> Always run `rush build` before deploying to ensure that the `dist` folders and compiled function libraries are current.
