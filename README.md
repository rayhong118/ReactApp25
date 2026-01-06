# Doghead Portal 2025

A modern, multi-functional web platform built with React 19, Vite, and Firebase. This portal serves as a personal hub for tracking restaurant experiences, showcasing artwork, and hosting various technical experiments.

## 🚀 Features

### 🍽️ Eat (Restaurant Companion)

A comprehensive tool for foodies to log and review their dining experiences.

- **Log & Track**: Keep a detailed history of restaurants visited.
- **Ratings & Reviews**: Score meals and leave detailed notes.
- **AI Notes Summary**: Uses **Google Gemini** via Firebase Functions to generate concise summaries of your dining notes.
- **Interactive Search & Filter**: Powerful filtering and search capabilities powered by TanStack Query and Jotai.
- **Rating Histograms**: Visualize your rating distributions.
- **Google Maps Integration**: Seamless location lookups and mapping for restaurants.

### 🎨 Drawings

A digital gallery to showcase comics and other drawings.

### 🧪 Experiments

A playground for technical exploration regarding UI/UX technologies.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), Sass (SCSS)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **State Management**: [Jotai](https://jotai.org/) (Atoms), [TanStack Query v5](https://tanstack.com/query/latest)
- **Icons**: [FontAwesome](https://fontawesome.com/)
- **Data Visualization**: [D3.js](https://d3js.org/)
- **Localization**: [i18next](https://www.i18next.com/)

### Backend (Serverless)

- **Platform**: [Firebase](https://firebase.google.com/)
- **Database**: Firestore
- **Functions**: Cloud Functions for Firebase (Node 22)
- **AI**: [Google Gemini API](https://ai.google.dev/)
- **Storage**: Firebase Storage (for artworks and photos)

### Testing & Quality

- **Unit Testing**: [Vitest](https://vitest.dev/), [Jest](https://jestjs.io/) (for Functions)
- **UI Testing**: Testing Library (React/DOM)
- **Linting**: ESLint with TypeScript support
