# Implementation Plan: Bandung Tourism Platform

## Overview

Build a minimal React + Vite frontend-only app that displays Bandung tourism destinations as cards on a homepage and shows full detail when a card is clicked. Uses React Router for client-side navigation, native Fetch API for data, React Context for global state, and pure CSS Modules for styling.

## Tasks

- [x] 1. Setup project dependencies and folder structure
  - Install `react-router-dom` via npm
  - Create directory structure: `src/components/layout`, `src/components/tourism`, `src/components/ui`, `src/pages`, `src/services`, `src/context`, `src/styles`
  - Create `.env` and `.env.example` each containing `VITE_API_BASE_URL=`
  - _Requirements: 3.1, 4.1_

- [x] 2. Create global CSS files
  - [x] 2.1 Create `src/styles/variables.css` with CSS custom properties: `--color-primary`, `--color-secondary`, `--space-sm`, `--space-md`, `--space-lg`, `--radius-md`, `--shadow-md`, `--transition-base`
    - _Requirements: 5.2_
  - [x] 2.2 Create `src/styles/global.css` with box-sizing reset, body font, and base typography; import `variables.css`
    - _Requirements: 5.1_

- [x] 3. Create API service
  - Create `src/services/api.js` reading `import.meta.env.VITE_API_BASE_URL` as the base URL
  - Implement `getAllDestinations()`: GET `/destinations`, throw on non-ok response
  - Implement `getDestinationById(id)`: GET `/destinations/:id`, return `null` on 404, throw on other non-ok responses
  - _Requirements: 4.1, 4.3, 4.4_

- [x] 4. Create TourismContext
  - Create `src/context/TourismContext.jsx` exporting `TourismProvider` and `useTourism` hook
  - State shape: `{ destinations: [], loading: false, error: null }`
  - Expose `fetchDestinations()` to (re-)trigger the API call and update state accordingly
  - Expose `getDestinationById(id)` as a synchronous lookup on the already-fetched `destinations` array
  - Call `fetchDestinations` once on provider mount
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 5. Create UI components
  - [x] 5.1 Create `src/components/ui/LoadingSpinner.jsx` and `LoadingSpinner.module.css`
    - Renders a centered animated spinner with an optional `message` prop
    - _Requirements: 1.2, 4.2_
  - [x] 5.2 Create `src/components/ui/ErrorMessage.jsx` and `ErrorMessage.module.css`
    - Accepts `message` and optional `onRetry` props
    - Renders error text and a retry button when `onRetry` is provided
    - _Requirements: 1.4, 4.4, 4.5_
  - [x] 5.3 Create `src/components/ui/Button.jsx` and `Button.module.css`
    - Accepts `variant` (`'primary'` | `'secondary'`), `onClick`, `children`, and optional `disabled` props
    - Apply hover effect via CSS (lighter/darker background shift on `:hover`)
    - _Requirements: 5.6_

- [x] 6. Create Layout components
  - [x] 6.1 Create `src/components/layout/Header.jsx` and `Header.module.css`
    - Renders the platform title; no props required
    - _Requirements: 1.1_
  - [x] 6.2 Create `src/components/layout/Footer.jsx` and `Footer.module.css`
    - Renders the platform name; no props required
    - _Requirements: 1.7_

- [x] 7. Create TourismCard component
  - Create `src/components/tourism/TourismCard.jsx` and `TourismCard.module.css`
  - Props: `{ destination: Destination, onClick: (id) => void }`
  - Display destination image; on `onError` swap `src` to a placeholder image
  - Display destination name, category badge, and short description
  - Apply hover effect via CSS: `transform: translateY(-4px)` + elevated shadow on `:hover`
  - Call `onClick(destination.id)` when the card is clicked
  - _Requirements: 1.3, 1.5, 1.6, 5.5_

- [x] 8. Create TourismList component
  - Create `src/components/tourism/TourismList.jsx` and `TourismList.module.css`
  - Props: `{ destinations, loading, error, onRetry }`
  - Render `<LoadingSpinner>` when `loading` is true
  - Render `<ErrorMessage onRetry>` when `error` is set
  - Render a CSS Grid of `<TourismCard>` components otherwise
  - Grid: single column at ≤768 px; `auto-fill minmax(280px, 1fr)` above 768 px
  - _Requirements: 1.2, 1.3, 1.4, 5.3, 5.4_

- [x] 9. Create HomePage
  - Create `src/pages/HomePage.jsx` and `HomePage.module.css`
  - Consume `useTourism` context to get `destinations`, `loading`, `error`, and `fetchDestinations`
  - On mount, trigger destination fetch via context (context already fetches on mount; ensure no double-fetch)
  - Pass `onRetry={fetchDestinations}` to `<TourismList>`
  - Handle card click: navigate to `/destinations/:id` using React Router `useNavigate`
  - Render: `<Header>` → `<TourismList>` → `<Footer>`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.7, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 10. Create DetailPage
  - Create `src/pages/DetailPage.jsx` and `DetailPage.module.css`
  - Read `:id` from route params via `useParams`
  - Look up destination with `getDestinationById(id)` from context; render `<NotFoundPage>` when result is `null`
  - Display: destination name as page title, main image (with placeholder fallback on error), full description, location address, operating hours (only when available), ticket pricing (only when available)
  - Include a back button using `<Button variant="secondary">` that navigates to `/` on click
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 3.2, 3.3_

- [x] 11. Create NotFoundPage
  - Create `src/pages/NotFoundPage.jsx` and `NotFoundPage.module.css`
  - Display a clear 404 message
  - Include a link (or `<Button>`) that navigates back to `/`
  - _Requirements: 2.2, 3.3, 3.4_

- [x] 12. Setup routing in App.jsx
  - Replace existing `App.jsx` content with React Router `<BrowserRouter>` + `<Routes>`
  - Route `/` → `<HomePage>`
  - Route `/destinations/:id` → `<DetailPage>`
  - Route `*` → `<NotFoundPage>`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 13. Update main.jsx
  - Import and apply global styles (`src/styles/global.css`)
  - Wrap `<App>` with `<TourismProvider>` so context is available application-wide
  - _Requirements: 4.1, 5.1, 5.2_

## Notes

- Tasks are ordered so each step builds on the previous one — context depends on the service, components depend on context, pages depend on components.
- All styling is done with CSS Modules and the global variables defined in Task 2; no external CSS frameworks.
- The `.env` file must be populated with a real API base URL before the app can fetch data.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.2"] },
    { "id": 2, "tasks": ["3"] },
    { "id": 3, "tasks": ["4"] },
    { "id": 4, "tasks": ["5.1", "5.2", "5.3", "6.1", "6.2"] },
    { "id": 5, "tasks": ["7", "8"] },
    { "id": 6, "tasks": ["11"] },
    { "id": 7, "tasks": ["9", "10"] },
    { "id": 8, "tasks": ["12"] },
    { "id": 9, "tasks": ["13"] }
  ]
}
```
