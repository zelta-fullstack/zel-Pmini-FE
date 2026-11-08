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

- [ ] 14. Checkpoint - Verify basic functionality
  - Ensure all tests pass, ask the user if questions arise.

## Phase 1: Nature Theme Redesign

- [ ] 15. Create nature theme design tokens
  - [ ] 15.1 Update `src/styles/variables.css` with nature theme color palette
    - Add primary colors: `--color-forest-dark: #2D5016`, `--color-sage: #8BA888`
    - Add earth tones: `--color-earth-brown: #8B7355`, `--color-earth-tan: #D4A574`
    - Add neutrals: `--color-white: #FFFFFF`, `--color-off-white: #F8F9F6`, `--color-text-dark: #1A1A1A`, `--color-text-medium: #4A4A4A`, `--color-text-light: #7A7A7A`
    - Add semantic colors: `--color-error: #B85C50`, `--color-success: #6B8E65`, `--color-info: #6B8E9E`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ] 15.2 Add typography and spacing tokens to `src/styles/variables.css`
    - Add font families: `--font-primary`, `--font-display`
    - Add font sizes: `--text-xs` through `--text-4xl`
    - Add font weights: `--weight-normal`, `--weight-medium`, `--weight-semibold`, `--weight-bold`
    - Add line heights: `--leading-tight`, `--leading-snug`, `--leading-normal`, `--leading-relaxed`
    - Update spacing scale: `--space-xs` through `--space-3xl` using 4px base unit
    - _Requirements: 6.7_
  
  - [ ] 15.3 Add visual effect tokens to `src/styles/variables.css`
    - Add border radius: `--radius-sm: 8px`, `--radius-md: 12px`, `--radius-lg: 16px`, `--radius-xl: 20px`, `--radius-full: 9999px`
    - Add shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-hover` with forest green tint
    - Add timing functions: `--ease-natural`, `--ease-in-natural`, `--ease-out-natural`, `--ease-bounce`
    - Add durations: `--duration-fast: 150ms`, `--duration-base: 300ms`, `--duration-slow: 500ms`, `--duration-slower: 700ms`
    - Add standard transitions: `--transition-base`, `--transition-color`, `--transition-transform`, `--transition-shadow`
    - _Requirements: 6.8, 6.9, 6.13_

- [ ] 16. Create animation keyframes
  - Create `src/styles/animations.css` with reusable keyframe animations
  - Add `@keyframes fadeIn` (opacity 0→1, translateY 12px→0)
  - Add `@keyframes slideUp` (opacity 0→1, translateY 24px→0)
  - Add `@keyframes gentleScale` (scale 1→1.02→1)
  - _Requirements: 6.13, 6.14_

- [ ] 17. Update global styles with nature theme
  - [ ] 17.1 Update `src/styles/global.css` to use nature theme colors
    - Apply nature-inspired gradient background to body using `--color-off-white`
    - Update base typography to use `--font-primary` and nature theme text colors
    - Import `animations.css`
    - _Requirements: 6.6, 6.7_
  
  - [ ] 17.2 Add background texture to `src/styles/global.css`
    - Create pseudo-element with subtle noise texture (opacity 0.03)
    - Use CSS gradient for organic background effect
    - _Requirements: 6.6, 6.12_

- [ ] 18. Redesign TourismCard with nature theme
  - Update `TourismCard.module.css` to use nature theme tokens
  - Apply `--radius-lg` border radius and `--shadow-md` shadow
  - Update category badge styling: `--color-forest-dark` background, pill shape, uppercase text
  - Implement enhanced hover effect: `translateY(-6px)` + `--shadow-hover` + image scale(1.05)
  - Add `slideUp` animation with staggered delay (nth-child delays: 0ms, 50ms, 100ms, 150ms, 200ms, 250ms)
  - Add border: 1px solid rgba(45, 80, 22, 0.08)
  - _Requirements: 6.8, 6.9, 6.10, 6.13, 6.14_

- [ ] 19. Redesign Button component with nature theme
  - Update `Button.module.css` to use nature theme tokens
  - Primary variant: `--color-forest-dark` background, white text, `--shadow-sm`
  - Secondary variant: `--color-sage` background, `--color-forest-dark` text
  - Add hover effects: darken background, `--shadow-md`, `translateY(-1px)`
  - Apply `--radius-md` and `--transition-base`
  - _Requirements: 6.1, 6.2, 6.8, 6.13_

- [ ] 20. Redesign Header with nature theme
  - Update `Header.module.css` to use forest green gradient
  - Apply gradient: `linear-gradient(to bottom, --color-forest-dark 0%, #3a6b1e 100%)`
  - Use white text color and `--shadow-md`
  - Add appropriate padding using spacing tokens
  - _Requirements: 6.1, 6.15_

- [ ] 21. Redesign Footer with nature theme
  - Update `Footer.module.css` to use earth tone background
  - Apply `--color-earth-brown` background and white text
  - Add generous padding using `--space-xl` and top margin using `--space-3xl`
  - _Requirements: 6.3, 6.16_

- [ ] 22. Add icon system setup (optional)
  - Create `/public/icons.svg` sprite with nature-themed icons: leaf, mountain, utensils, camera, search, filter, x
  - Update components to reference icons via `<use href="/icons.svg#icon-name" />`
  - _Requirements: 6.11_

- [ ] 23. Checkpoint - Test nature theme visual design
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: Search & Filter UI

- [ ] 24. Create useDebounce custom hook
  - Create `src/hooks/useDebounce.js`
  - Accept `value` and `delay` (default 500ms) parameters
  - Return debounced value that updates only after delay expires
  - Clear timeout on cleanup when value changes
  - _Requirements: 7.10_

- [ ] 25. Update API service for search and filter
  - Add `searchDestinations(searchQuery, categories, priceRange)` function to `src/services/api.js`
  - Build URLSearchParams with `search`, `categories` (comma-separated), and `priceRange` parameters
  - Make GET request to `/destinations/search?...` endpoint
  - _Requirements: 7.4, 8.8, 9.8, 10.1_

- [ ] 26. Create SearchBar component
  - [ ] 26.1 Create `src/components/search/SearchBar.jsx` and `SearchBar.module.css`
    - Accept `onSearchChange`, `initialValue`, and `placeholder` props
    - Implement local `inputValue` state for immediate updates
    - Use `useDebounce` hook with 400ms delay on input value
    - Call `onSearchChange` when debounced value changes
    - Display search icon on left side
    - _Requirements: 7.1, 7.2, 7.3, 7.10_
  
  - [ ] 26.2 Add clear button to SearchBar
    - Display X icon button when input has text
    - Clear input value when clicked
    - Apply nature theme styling: sage border, forest-dark focus border with shadow
    - _Requirements: 7.8, 7.9_

- [ ] 27. Create CategoryFilter component
  - Create `src/components/search/CategoryFilter.jsx` and `CategoryFilter.module.css`
  - Accept `categories`, `selectedCategories`, and `onCategoryToggle` props
  - Render label "Kategori:" and row of category chips
  - Categories: ["Alam", "Budaya", "Kuliner", "Adventure", "Fotografi"]
  - Inactive chips: sage border, white background
  - Active chips: forest-dark background, white text
  - Allow multiple chips to be active simultaneously
  - Apply responsive layout: stack vertically on mobile (≤768px), horizontal on desktop
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.10, 10.9_

- [ ] 28. Create PriceFilter component
  - Create `src/components/search/PriceFilter.jsx` and `PriceFilter.module.css`
  - Accept `priceRanges`, `selectedRange`, and `onRangeSelect` props
  - Render label "Rentang Harga:" and row of price chips
  - Price ranges: [{label: "Gratis", value: "free"}, {label: "<50k", value: "0-50000"}, {label: "50k-100k", value: "50000-100000"}, {label: ">100k", value: "100000-999999"}]
  - Inactive chips: earth-tan border, white background
  - Active chips: sage background, forest-dark text
  - Allow only one chip to be active at a time (radio behavior)
  - Apply responsive layout: stack vertically on mobile, horizontal on desktop
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 10.9_

- [ ] 29. Create FilterSummary component
  - Create `src/components/search/FilterSummary.jsx` and `FilterSummary.module.css`
  - Accept `resultCount`, `totalCount`, `hasActiveFilters`, and `onClearAll` props
  - Display results count: "Menampilkan **X** dari Y destinasi"
  - Show "Hapus Semua Filter" button only when filters are active
  - Apply nature theme styling with sage background tint
  - Apply responsive layout: stack vertically on mobile
  - _Requirements: 10.3, 10.4, 10.9_

- [ ] 30. Create EmptyState component
  - Create `src/components/search/EmptyState.jsx` and `EmptyState.module.css`
  - Accept `message`, `suggestion`, and `onReset` props
  - Display centered illustration/icon (120px, sage color, 40% opacity)
  - Display message as heading and suggestion as body text
  - Include reset button when `onReset` provided
  - Apply `fadeIn` animation
  - _Requirements: 7.7, 10.7_

- [ ] 31. Update TourismContext for filter state
  - [ ] 31.1 Add filter state to TourismContext
    - Add state: `searchQuery`, `selectedCategories[]`, `selectedPriceRange`
    - Add `filteredDestinations` array separate from `destinations`
    - _Requirements: 10.1, 10.8_
  
  - [ ] 31.2 Add filter actions to TourismContext
    - Add `setSearchQuery(query)` action
    - Add `toggleCategory(category)` action
    - Add `setPriceRange(range)` action
    - Add `clearAllFilters()` action
    - Add `applyFilters(query, categories, priceRange)` that calls `searchDestinations()` API
    - Update `filteredDestinations` when API returns results
    - _Requirements: 7.4, 7.5, 7.6, 8.8, 8.9, 9.8, 9.9, 10.1, 10.2, 10.5, 10.6_

- [ ] 32. Integrate search and filter in HomePage
  - [ ] 32.1 Add filter UI components to HomePage
    - Import and render `<SearchBar>`, `<CategoryFilter>`, `<PriceFilter>`, `<FilterSummary>` above `<TourismList>`
    - Connect components to TourismContext filter state and actions
    - Pass `filteredDestinations` instead of `destinations` to `<TourismList>`
    - _Requirements: 7.1, 8.1, 9.1, 10.3_
  
  - [ ] 32.2 Implement combined filter logic in HomePage
    - Calculate `hasActiveFilters` from context state
    - Calculate result count and total count for FilterSummary
    - Handle empty state: render `<EmptyState>` when `filteredDestinations.length === 0`
    - Connect "Clear All Filters" button to `clearAllFilters()` action
    - _Requirements: 10.1, 10.2, 10.4, 10.7_

- [ ] 33. Manual testing - Search functionality
  - Test debounced search input (400ms delay)
  - Test search with various keywords
  - Test clear button functionality
  - Test empty state when no results found
  - Verify loading indicator appears during search
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10_

- [ ] 34. Manual testing - Category filter functionality
  - Test single category selection
  - Test multiple category selection
  - Test category deselection
  - Test visual active/inactive states
  - Test responsive layout on mobile and desktop
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 10.9_

- [ ] 35. Manual testing - Price filter functionality
  - Test price range selection (radio behavior)
  - Test switching between price ranges
  - Test visual active/inactive states
  - Test responsive layout on mobile and desktop
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 10.9_

- [ ] 36. Manual testing - Combined filter integration
  - Test search + category filter combination
  - Test search + price filter combination
  - Test category + price filter combination
  - Test all three filters combined
  - Test "Clear All Filters" button
  - Test filter state persistence when navigating to detail page and back
  - Test empty state with suggestion
  - Test results count display
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10_

- [ ] 37. Final checkpoint - Complete feature verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks are ordered so each step builds on the previous one — context depends on the service, components depend on context, pages depend on components.
- All styling is done with CSS Modules and the global variables defined in Task 2; no external CSS frameworks.
- The `.env` file must be populated with a real API base URL before the app can fetch data.

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Phase 1 adds nature theme visual design (forest greens, animations, organic shapes)
- Phase 2 adds search bar, category filters, price filters with debounced API calls
- Manual testing tasks verify user-facing functionality without automated test coverage

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
    { "id": 9, "tasks": ["13"] },
    { "id": 10, "tasks": ["15.1", "15.2", "15.3"] },
    { "id": 11, "tasks": ["16", "17.1"] },
    { "id": 12, "tasks": ["17.2"] },
    { "id": 13, "tasks": ["18", "19", "20", "21"] },
    { "id": 14, "tasks": ["22"] },
    { "id": 15, "tasks": ["24", "25"] },
    { "id": 16, "tasks": ["26.1"] },
    { "id": 17, "tasks": ["26.2", "27", "28", "29", "30"] },
    { "id": 18, "tasks": ["31.1"] },
    { "id": 19, "tasks": ["31.2"] },
    { "id": 20, "tasks": ["32.1"] },
    { "id": 21, "tasks": ["32.2"] },
    { "id": 22, "tasks": ["33", "34", "35", "36"] }
  ]
}
```
