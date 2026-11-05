# Design Document: Bandung Tourism Platform

## Overview

Minimal MVP React + Vite frontend-only web app that displays Bandung tourism destinations as cards on a homepage, and shows full detail when a card is clicked. Uses React Router for client-side navigation, native Fetch API for data, React Context for global state, and pure CSS with CSS Modules for styling.

**Tech stack:** React 19, Vite, React Router DOM v6, native Fetch API, CSS Modules.

## Architecture

```
src/
├── components/
│   ├── layout/     Header, Footer
│   ├── tourism/    TourismCard, TourismList
│   └── ui/         Button, LoadingSpinner, ErrorMessage
├── pages/          HomePage, DetailPage, NotFoundPage
├── services/       api.js
├── context/        TourismContext.jsx
├── styles/         variables.css, global.css
├── App.jsx
└── main.jsx
```

### Data Flow

```
TourismContext (fetch + state)
       │
  TourismProvider wraps App
       │
  ┌────┴─────────────────┐
  │                      │
HomePage             DetailPage
  │                      │
TourismList      reads context by id
  │
TourismCard (×N)
```

### Route Map

| Path                | Component    |
| ------------------- | ------------ |
| `/`                 | HomePage     |
| `/destinations/:id` | DetailPage   |
| `*`                 | NotFoundPage |

## Components and Interfaces

### Pages

**HomePage** — fetches destinations via context on mount, renders `<Header>`, `<TourismList>`, `<Footer>`.

**DetailPage** — reads `:id` from route params, calls `getDestinationById(id)` from context. Renders full info or redirects to NotFoundPage when id is invalid.

**NotFoundPage** — static 404 page with a link back to `/`.

### Layout

**Header** — displays platform title. No props.

**Footer** — displays platform name. No props.

### Tourism

**TourismCard**

```
Props: { destination: Destination, onClick: (id) => void }
```

Displays: name, image (with fallback placeholder on error), category badge, short description. Navigates to detail on click.

**TourismList**

```
Props: { destinations: Destination[], loading: boolean, error: string|null, onRetry: () => void }
```

Shows `<LoadingSpinner>` while loading, `<ErrorMessage onRetry>` on error, or the card grid.

### UI

**Button**

```
Props: { variant: 'primary'|'secondary', onClick: () => void, children, disabled?: boolean }
```

**LoadingSpinner**

```
Props: { message?: string }
```

**ErrorMessage**

```
Props: { message: string, onRetry?: () => void }
```

## Data Models

```javascript
// Destination object returned by API
{
  id: string,
  name: string,
  description: string,
  category: string,
  image: string,              // single image URL
  location: {
    address: string,
    city: string
  },
  operatingHours?: string,    // free-form string, optional
  pricing?: {
    amount: number,
    currency: string          // e.g. "IDR"
  }
}
```

## Service Layer

**`src/services/api.js`**

```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAllDestinations() {
  const res = await fetch(`${BASE_URL}/destinations`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getDestinationById(id) {
  const res = await fetch(`${BASE_URL}/destinations/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

## Context

**`src/context/TourismContext.jsx`**

```javascript
// State shape
{
  destinations: Destination[],
  loading: boolean,
  error: string | null,
  fetchDestinations: () => void,   // callable to (re-)fetch / retry
  getDestinationById: (id) => Destination | undefined
}
```

`fetchDestinations` is called once on mount by `TourismProvider`. It is also passed to `ErrorMessage` as the retry handler. `getDestinationById` is a synchronous lookup on the already-fetched `destinations` array.

## CSS Architecture

**`src/styles/variables.css`** — defines CSS custom properties:

- `--color-primary`, `--color-secondary`
- spacing tokens: `--space-sm`, `--space-md`, `--space-lg`
- `--radius-md`, `--shadow-md`
- `--transition-base`

**`src/styles/global.css`** — box-sizing reset, body font, base typography.

Each component has a co-located `*.module.css` file for scoped styles.

### Responsive Grid

`TourismList.module.css` uses a CSS Grid layout:

```css
.grid {
  display: grid;
  gap: var(--space-lg);
  grid-template-columns: 1fr; /* mobile ≤768px: 1 column */
}

@media (min-width: 769px) {
  .grid {
    grid-template-columns: repeat(
      auto-fill,
      minmax(280px, 1fr)
    ); /* desktop: 2-3 cols */
  }
}
```

### Hover Effects

- `TourismCard`: `transform: translateY(-4px)` + elevated shadow on `:hover`
- `Button`: lighter/darker background shift on `:hover`

## Error Handling

| Scenario                    | Behavior                                         |
| --------------------------- | ------------------------------------------------ |
| API fetch fails on HomePage | Show `<ErrorMessage>` with a single retry button |
| Invalid `:id` on DetailPage | Render `<NotFoundPage>`                          |
| Unknown route               | React Router `*` catches → `<NotFoundPage>`      |
| Card image fails to load    | `onError` swaps `src` to placeholder image       |

## Testing Strategy

Unit tests cover component rendering and user interactions using Vitest + React Testing Library:

- `TourismCard` renders name, category, image, and triggers `onClick`
- `TourismList` shows spinner when `loading=true`, error message when `error` is set, and cards when data is present
- `ErrorMessage` renders retry button and calls `onRetry` on click
- `DetailPage` shows 404 page when `getDestinationById` returns null
- `TourismContext` calls `getAllDestinations` on mount and exposes correct state

PBT is not applied here because the feature consists primarily of UI rendering, data fetching orchestration, and routing — none of which benefit from property-based testing over example-based unit and integration tests.
