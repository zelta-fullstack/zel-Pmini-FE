# Design Document: Bandung Tourism Platform

## Overview

React + Vite frontend-only web app that displays Bandung tourism destinations with a calming nature theme, search and filter capabilities, and detailed information pages. The platform features a forest-inspired design system with earth tones, smooth animations, and comprehensive search/filter functionality to help visitors discover tourism destinations that match their interests and budget.

**Tech stack:** React 19, Vite, React Router DOM v6, native Fetch API, CSS Modules.

**Design Philosophy:** The interface draws inspiration from Bandung's natural landscape, using forest greens, earth tones, and organic shapes to create a calming, trustworthy experience that reflects the city's natural beauty.

## Architecture

```
src/
├── components/
│   ├── layout/       Header, Footer
│   ├── tourism/      TourismCard, TourismList
│   ├── search/       SearchBar, CategoryFilter, PriceFilter, FilterSummary
│   └── ui/           Button, LoadingSpinner, ErrorMessage
├── pages/            HomePage, DetailPage, NotFoundPage
├── services/         api.js (getAllDestinations, getDestinationById, searchDestinations)
├── context/          TourismContext.jsx (destinations, filters, search state)
├── hooks/            useDebounce.js
├── styles/
│   ├── variables.css         (nature theme tokens, spacing, animations)
│   ├── global.css            (reset, base typography)
│   └── animations.css        (reusable keyframes)
├── App.jsx
└── main.jsx
```

### Data Flow

```
TourismContext (fetch + filter state)
       │
  TourismProvider wraps App
       │
  ┌────┴───────────────────────┐
  │                            │
HomePage                   DetailPage
  │                            │
  ├─ SearchBar ────────────────┼─> updates searchQuery
  ├─ CategoryFilter ───────────┼─> updates selectedCategories[]
  ├─ PriceFilter ──────────────┼─> updates selectedPriceRange
  ├─ FilterSummary ────────────┘
  │
  └─ TourismList (filtered results)
       │
       └─ TourismCard (×N)
```

**Filter Flow:**
1. User interacts with SearchBar/CategoryFilter/PriceFilter
2. Component updates local state
3. Debounced hook (for search) or immediate (for filters) updates context
4. Context calls `searchDestinations(query, categories, priceRange)` API
5. API returns filtered results
6. TourismList re-renders with filtered destinations

### Route Map

| Path                | Component    |
| ------------------- | ------------ |
| `/`                 | HomePage     |
| `/destinations/:id` | DetailPage   |
| `*`                 | NotFoundPage |

## Phase 1: Nature Theme Design System

### Color Palette

The nature theme uses forest greens, earth tones, and natural neutrals to create a calming, trustworthy interface that reflects Bandung's natural landscape.

**Primary Colors:**
- `--color-forest-dark`: `#2D5016` — Deep forest green for primary actions, headings, active states
- `--color-sage`: `#8BA888` — Sage green for secondary elements, hover states, backgrounds

**Earth Tones:**
- `--color-earth-brown`: `#8B7355` — Warm brown for accents, borders
- `--color-earth-tan`: `#D4A574` — Light tan for secondary accents, subtle highlights

**Neutrals:**
- `--color-white`: `#FFFFFF` — Pure white for text on dark backgrounds, card backgrounds
- `--color-off-white`: `#F8F9F6` — Soft off-white with green tint for main background
- `--color-text-dark`: `#1A1A1A` — Near-black for primary text
- `--color-text-medium`: `#4A4A4A` — Medium gray for secondary text
- `--color-text-light`: `#7A7A7A` — Light gray for tertiary text, placeholder

**Semantic Colors:**
- `--color-error`: `#B85C50` — Muted red-brown for errors
- `--color-success`: `#6B8E65` — Muted green for success states
- `--color-info`: `#6B8E9E` — Muted blue-green for info

### Typography

**Font Families:**
```css
--font-primary: 'Inter', 'Segoe UI', system-ui, sans-serif;
--font-display: 'Plus Jakarta Sans', 'Inter', sans-serif; /* for headings */
```

**Font Sizes:** (fluid scale based on 16px base)
```css
--text-xs: 0.75rem;    /* 12px - labels, captions */
--text-sm: 0.875rem;   /* 14px - small body, metadata */
--text-base: 1rem;     /* 16px - body text */
--text-lg: 1.125rem;   /* 18px - lead text */
--text-xl: 1.25rem;    /* 20px - h4 */
--text-2xl: 1.5rem;    /* 24px - h3 */
--text-3xl: 1.875rem;  /* 30px - h2 */
--text-4xl: 2.25rem;   /* 36px - h1 */
```

**Font Weights:**
```css
--weight-normal: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
```

**Line Heights:**
```css
--leading-tight: 1.25;   /* headings */
--leading-snug: 1.375;   /* subheadings */
--leading-normal: 1.5;   /* body */
--leading-relaxed: 1.625; /* long-form content */
```

### Spacing System

Consistent spacing scale using 4px base unit:

```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
--space-3xl: 4rem;     /* 64px */
```

### Border Radius

Organic, nature-inspired rounded corners:

```css
--radius-sm: 8px;      /* small elements, chips */
--radius-md: 12px;     /* cards, buttons */
--radius-lg: 16px;     /* large cards, modals */
--radius-xl: 20px;     /* hero sections */
--radius-full: 9999px; /* pills, circular avatars */
```

### Shadows

Natural, soft shadow system for depth:

```css
--shadow-sm: 0 1px 2px rgba(45, 80, 22, 0.05);
--shadow-md: 0 4px 6px rgba(45, 80, 22, 0.08), 
             0 1px 3px rgba(45, 80, 22, 0.06);
--shadow-lg: 0 10px 15px rgba(45, 80, 22, 0.1), 
             0 4px 6px rgba(45, 80, 22, 0.05);
--shadow-xl: 0 20px 25px rgba(45, 80, 22, 0.12), 
             0 8px 10px rgba(45, 80, 22, 0.05);
--shadow-hover: 0 12px 20px rgba(45, 80, 22, 0.15), 
                0 6px 8px rgba(45, 80, 22, 0.08);
```

### Animation Specifications

**Timing Functions:**
```css
--ease-natural: cubic-bezier(0.4, 0.0, 0.2, 1);      /* smooth general purpose */
--ease-in-natural: cubic-bezier(0.4, 0.0, 1, 1);     /* entering elements */
--ease-out-natural: cubic-bezier(0.0, 0.0, 0.2, 1);  /* exiting elements */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* playful hover */
```

**Durations:**
```css
--duration-fast: 150ms;    /* micro-interactions, hover */
--duration-base: 300ms;    /* standard transitions */
--duration-slow: 500ms;    /* complex animations, page transitions */
--duration-slower: 700ms;  /* dramatic reveals */
```

**Standard Transitions:**
```css
--transition-base: all var(--duration-base) var(--ease-natural);
--transition-color: color var(--duration-fast) var(--ease-natural),
                    background-color var(--duration-fast) var(--ease-natural);
--transition-transform: transform var(--duration-base) var(--ease-natural);
--transition-shadow: box-shadow var(--duration-base) var(--ease-natural);
```

**Keyframe Animations:**

```css
/* Fade In (for content entering viewport) */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide Up (for cards appearing) */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Gentle Scale (for interactive elements) */
@keyframes gentleScale {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}
```

### Background Texture

Subtle nature-inspired gradient for main background:

```css
.app-background {
  background: 
    linear-gradient(
      135deg,
      var(--color-off-white) 0%,
      #f5f7f2 50%,
      var(--color-off-white) 100%
    );
  /* Optional: Add subtle noise texture via pseudo-element for organic feel */
}

.app-background::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  background-image: url('data:image/svg+xml;base64,...'); /* subtle noise pattern */
  pointer-events: none;
  z-index: 0;
}
```

### Component Visual Specifications

**TourismCard Nature Theme:**

```css
.tourismCard {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: var(--transition-transform), var(--transition-shadow);
  border: 1px solid rgba(45, 80, 22, 0.08);
}

.tourismCard:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
}

.tourismCard__category {
  background: var(--color-forest-dark);
  color: var(--color-white);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tourismCard__image {
  aspect-ratio: 16/9;
  object-fit: cover;
  transition: transform var(--duration-slow) var(--ease-natural);
}

.tourismCard:hover .tourismCard__image {
  transform: scale(1.05);
}
```

**Button Nature Theme:**

```css
.button--primary {
  background: var(--color-forest-dark);
  color: var(--color-white);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-lg);
  font-weight: var(--weight-semibold);
  transition: var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.button--primary:hover {
  background: #234010; /* slightly darker */
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.button--secondary {
  background: var(--color-sage);
  color: var(--color-forest-dark);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-lg);
  font-weight: var(--weight-semibold);
  transition: var(--transition-base);
}

.button--secondary:hover {
  background: #7a9d77;
}
```

**Header/Footer Nature Theme:**

```css
.header {
  background: linear-gradient(
    to bottom,
    var(--color-forest-dark) 0%,
    #3a6b1e 100%
  );
  color: var(--color-white);
  padding: var(--space-lg) var(--space-xl);
  box-shadow: var(--shadow-md);
}

.footer {
  background: var(--color-earth-brown);
  color: var(--color-white);
  padding: var(--space-xl);
  margin-top: var(--space-3xl);
}
```

### Icon System

Nature-themed icons using SVG sprites or inline SVG:

- **Leaf icon** for eco-friendly destinations
- **Mountain icon** for nature/adventure categories
- **Utensils icon** for culinary destinations
- **Camera icon** for photography spots
- **Search icon** for search bar
- **Filter icon** for filter controls
- **X icon** for clear/close actions

Store in `/public/icons.svg` as sprite, reference via `<use href="/icons.svg#leaf" />`

## Phase 2: Search & Filter Components

### SearchBar Component

**Purpose:** Allow visitors to search destinations by name or keyword with debounced API calls.

**Interface:**

```javascript
// Props
{
  onSearchChange: (query: string) => void,
  initialValue?: string,
  placeholder?: string
}

// Internal State
{
  inputValue: string,      // immediate input value
  debouncedValue: string   // debounced value sent to parent
}
```

**Pseudocode:**

```javascript
function SearchBar({ onSearchChange, initialValue = '', placeholder }) {
  const [inputValue, setInputValue] = useState(initialValue);
  const debouncedValue = useDebounce(inputValue, 400); // 400ms delay
  
  useEffect(() => {
    onSearchChange(debouncedValue);
  }, [debouncedValue]);
  
  const handleClear = () => {
    setInputValue('');
  };
  
  return (
    <div className="searchBar">
      <SearchIcon className="searchBar__icon" />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder || "Cari destinasi wisata..."}
        className="searchBar__input"
      />
      {inputValue && (
        <button onClick={handleClear} className="searchBar__clear">
          <XIcon />
        </button>
      )}
    </div>
  );
}
```

**CSS Class Names:**

```css
.searchBar               /* container */
.searchBar__icon         /* search icon (left) */
.searchBar__input        /* text input field */
.searchBar__clear        /* clear button (right, conditional) */
.searchBar--focused      /* modifier when input has focus */
```

**Styling Specifications:**

```css
.searchBar {
  display: flex;
  align-items: center;
  background: var(--color-white);
  border: 2px solid var(--color-sage);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  gap: var(--space-sm);
  transition: var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.searchBar--focused {
  border-color: var(--color-forest-dark);
  box-shadow: 0 0 0 3px rgba(45, 80, 22, 0.1);
}

.searchBar__icon {
  width: 20px;
  height: 20px;
  color: var(--color-text-medium);
  flex-shrink: 0;
}

.searchBar__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: var(--text-base);
  color: var(--color-text-dark);
  background: transparent;
}

.searchBar__input::placeholder {
  color: var(--color-text-light);
}

.searchBar__clear {
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-medium);
  cursor: pointer;
  transition: var(--transition-color);
}

.searchBar__clear:hover {
  color: var(--color-forest-dark);
}
```

### CategoryFilter Component

**Purpose:** Display category chips that can be toggled to filter destinations by category.

**Interface:**

```javascript
// Props
{
  categories: string[],           // ["Alam", "Budaya", "Kuliner", "Adventure", "Fotografi"]
  selectedCategories: string[],   // currently active categories
  onCategoryToggle: (category: string) => void
}
```

**Pseudocode:**

```javascript
function CategoryFilter({ categories, selectedCategories, onCategoryToggle }) {
  const isSelected = (category) => selectedCategories.includes(category);
  
  return (
    <div className="categoryFilter">
      <label className="categoryFilter__label">Kategori:</label>
      <div className="categoryFilter__chips">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategoryToggle(category)}
            className={`chip ${isSelected(category) ? 'chip--active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**CSS Class Names:**

```css
.categoryFilter              /* container */
.categoryFilter__label       /* "Kategori:" label */
.categoryFilter__chips       /* flex container for chips */
.chip                        /* individual category chip */
.chip--active                /* modifier for selected chip */
```

**Styling Specifications:**

```css
.categoryFilter {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.categoryFilter__label {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-dark);
}

.categoryFilter__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.chip {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  border: 2px solid var(--color-sage);
  background: var(--color-white);
  color: var(--color-text-dark);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: var(--transition-base);
  white-space: nowrap;
}

.chip:hover {
  border-color: var(--color-forest-dark);
  background: rgba(139, 168, 136, 0.1);
}

.chip--active {
  background: var(--color-forest-dark);
  color: var(--color-white);
  border-color: var(--color-forest-dark);
}

.chip--active:hover {
  background: #234010;
}

/* Responsive: stack vertically on mobile */
@media (max-width: 768px) {
  .categoryFilter__chips {
    flex-direction: column;
  }
  
  .chip {
    width: 100%;
    text-align: center;
  }
}
```

### PriceFilter Component

**Purpose:** Display price range options as radio-style chips (single selection).

**Interface:**

```javascript
// Props
{
  priceRanges: Array<{label: string, value: string}>,  
  // e.g., [{label: "Gratis", value: "free"}, {label: "<50k", value: "0-50000"}, ...]
  selectedRange: string | null,    // currently selected range value
  onRangeSelect: (value: string) => void
}
```

**Pseudocode:**

```javascript
function PriceFilter({ priceRanges, selectedRange, onRangeSelect }) {
  return (
    <div className="priceFilter">
      <label className="priceFilter__label">Rentang Harga:</label>
      <div className="priceFilter__options">
        {priceRanges.map(range => (
          <button
            key={range.value}
            onClick={() => onRangeSelect(range.value)}
            className={`priceChip ${selectedRange === range.value ? 'priceChip--active' : ''}`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**CSS Class Names:**

```css
.priceFilter              /* container */
.priceFilter__label       /* "Rentang Harga:" label */
.priceFilter__options     /* flex container for price chips */
.priceChip                /* individual price option */
.priceChip--active        /* modifier for selected option */
```

**Styling Specifications:**

```css
.priceFilter {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.priceFilter__label {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-dark);
}

.priceFilter__options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.priceChip {
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-sm);
  border: 2px solid var(--color-earth-tan);
  background: var(--color-white);
  color: var(--color-text-dark);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: var(--transition-base);
  white-space: nowrap;
}

.priceChip:hover {
  border-color: var(--color-sage);
  background: rgba(212, 165, 116, 0.1);
}

.priceChip--active {
  background: var(--color-sage);
  color: var(--color-forest-dark);
  border-color: var(--color-sage);
  font-weight: var(--weight-semibold);
}

.priceChip--active:hover {
  background: #7a9d77;
}

/* Responsive: stack vertically on mobile */
@media (max-width: 768px) {
  .priceFilter__options {
    flex-direction: column;
  }
  
  .priceChip {
    width: 100%;
    text-align: center;
  }
}
```

### FilterSummary Component

**Purpose:** Display results count and "Clear All Filters" button when filters are active.

**Interface:**

```javascript
// Props
{
  resultCount: number,
  totalCount: number,
  hasActiveFilters: boolean,
  onClearAll: () => void
}
```

**Pseudocode:**

```javascript
function FilterSummary({ resultCount, totalCount, hasActiveFilters, onClearAll }) {
  return (
    <div className="filterSummary">
      <p className="filterSummary__count">
        Menampilkan <strong>{resultCount}</strong> dari {totalCount} destinasi
      </p>
      {hasActiveFilters && (
        <button onClick={onClearAll} className="filterSummary__clear">
          Hapus Semua Filter
        </button>
      )}
    </div>
  );
}
```

**CSS Class Names:**

```css
.filterSummary           /* container */
.filterSummary__count    /* results count text */
.filterSummary__clear    /* clear all button */
```

**Styling Specifications:**

```css
.filterSummary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background: rgba(139, 168, 136, 0.05);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-lg);
}

.filterSummary__count {
  font-size: var(--text-sm);
  color: var(--color-text-medium);
  margin: 0;
}

.filterSummary__count strong {
  color: var(--color-forest-dark);
  font-weight: var(--weight-bold);
}

.filterSummary__clear {
  padding: var(--space-xs) var(--space-md);
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-white);
  color: var(--color-forest-dark);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.filterSummary__clear:hover {
  background: var(--color-forest-dark);
  color: var(--color-white);
  box-shadow: var(--shadow-md);
}

/* Responsive: stack vertically on mobile */
@media (max-width: 768px) {
  .filterSummary {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }
  
  .filterSummary__clear {
    width: 100%;
  }
}
```

### EmptyState Component

**Purpose:** Display when no results match the current filters.

**Interface:**

```javascript
// Props
{
  message: string,
  suggestion?: string,
  onReset?: () => void
}
```

**Pseudocode:**

```javascript
function EmptyState({ message, suggestion, onReset }) {
  return (
    <div className="emptyState">
      <div className="emptyState__icon">
        {/* SVG illustration or icon */}
      </div>
      <h3 className="emptyState__title">{message}</h3>
      {suggestion && <p className="emptyState__text">{suggestion}</p>}
      {onReset && (
        <button onClick={onReset} className="button--secondary">
          Hapus Filter
        </button>
      )}
    </div>
  );
}
```

**CSS Class Names:**

```css
.emptyState           /* container */
.emptyState__icon     /* illustration/icon wrapper */
.emptyState__title    /* heading */
.emptyState__text     /* suggestion text */
```

**Styling Specifications:**

```css
.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3xl) var(--space-lg);
  text-align: center;
  animation: fadeIn var(--duration-base) var(--ease-natural);
}

.emptyState__icon {
  width: 120px;
  height: 120px;
  margin-bottom: var(--space-lg);
  opacity: 0.4;
  color: var(--color-sage);
}

.emptyState__title {
  font-size: var(--text-2xl);
  color: var(--color-text-dark);
  margin-bottom: var(--space-sm);
  font-weight: var(--weight-semibold);
}

.emptyState__text {
  font-size: var(--text-base);
  color: var(--color-text-medium);
  margin-bottom: var(--space-lg);
  max-width: 500px;
}
```

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

// Get all destinations (initial load)
export async function getAllDestinations() {
  const res = await fetch(`${BASE_URL}/destinations`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Get single destination by ID
export async function getDestinationById(id) {
  const res = await fetch(`${BASE_URL}/destinations/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Search and filter destinations
export async function searchDestinations(searchQuery, categories, priceRange) {
  const params = new URLSearchParams();
  
  if (searchQuery) {
    params.append('search', searchQuery);
  }
  
  if (categories && categories.length > 0) {
    params.append('categories', categories.join(','));
  }
  
  if (priceRange) {
    params.append('priceRange', priceRange);
  }
  
  const url = `${BASE_URL}/destinations/search?${params.toString()}`;
  const res = await fetch(url);
  
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
```

**API Request Examples:**

```
GET /destinations/search?search=tangkuban
GET /destinations/search?categories=Alam,Adventure
GET /destinations/search?priceRange=0-50000
GET /destinations/search?search=bandung&categories=Kuliner&priceRange=free
```

## Context and State Management

**`src/context/TourismContext.jsx`**

```javascript
// State shape
{
  // Data
  destinations: Destination[],           // all destinations
  filteredDestinations: Destination[],   // current filtered results
  loading: boolean,
  error: string | null,
  
  // Filter state
  searchQuery: string,
  selectedCategories: string[],
  selectedPriceRange: string | null,
  
  // Actions
  fetchDestinations: () => void,           // initial fetch all
  applyFilters: (query, categories, priceRange) => void,
  setSearchQuery: (query: string) => void,
  toggleCategory: (category: string) => void,
  setPrice Range: (range: string | null) => void,
  clearAllFilters: () => void,
  getDestinationById: (id) => Destination | undefined
}
```

**Implementation Notes:**

1. **Initial Load:** `fetchDestinations()` calls `getAllDestinations()` API on mount
2. **Filter Application:** When any filter changes, `applyFilters()` calls `searchDestinations()` API with current filter state
3. **Debouncing:** SearchBar component handles debouncing internally before calling `setSearchQuery()`
4. **Filter Persistence:** When navigating to DetailPage and back, filter state is preserved in context
5. **Clear All:** `clearAllFilters()` resets all filter state and fetches all destinations again

**Pseudocode:**

```javascript
function TourismProvider({ children }) {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  
  // Initial fetch
  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDestinations();
      setDestinations(data);
      setFilteredDestinations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters via API
  const applyFilters = async (query, categories, priceRange) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchDestinations(query, categories, priceRange);
      setFilteredDestinations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Update search query and apply filters
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    applyFilters(query, selectedCategories, selectedPriceRange);
  };
  
  // Toggle category selection
  const toggleCategory = (category) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
    applyFilters(searchQuery, updated, selectedPriceRange);
  };
  
  // Update price range
  const handlePriceChange = (range) => {
    setSelectedPriceRange(range);
    applyFilters(searchQuery, selectedCategories, range);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    setFilteredDestinations(destinations); // show all
  };
  
  // Get by ID (sync lookup)
  const getDestinationById = (id) => {
    return destinations.find(dest => dest.id === id);
  };
  
  useEffect(() => {
    fetchDestinations();
  }, []);
  
  const value = {
    destinations,
    filteredDestinations,
    loading,
    error,
    searchQuery,
    selectedCategories,
    selectedPriceRange,
    fetchDestinations,
    setSearchQuery: handleSearchChange,
    toggleCategory,
    setPriceRange: handlePriceChange,
    clearAllFilters,
    getDestinationById
  };
  
  return (
    <TourismContext.Provider value={value}>
      {children}
    </TourismContext.Provider>
  );
}
```

## Custom Hooks

**`src/hooks/useDebounce.js`**

```javascript
import { useState, useEffect } from 'react';

/**
 * Debounce hook - delays updating value until after specified delay
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {any} - The debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    // Set timeout to update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // Cleanup: clear timeout if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}
```

**Usage Example:**

```javascript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 400);

useEffect(() => {
  // This will only fire 400ms after user stops typing
  if (debouncedSearchTerm) {
    performSearch(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

## CSS Architecture

**`src/styles/variables.css`** — defines CSS custom properties for nature theme:

- Color palette (forest greens, earth tones, neutrals)
- Typography scale and font families
- Spacing tokens: `--space-xs` through `--space-3xl`
- Border radius: `--radius-sm` through `--radius-full`
- Shadows: `--shadow-sm` through `--shadow-hover`
- Animation timings: `--duration-fast`, `--duration-base`, `--duration-slow`
- Easing functions: `--ease-natural`, `--ease-in-natural`, `--ease-out-natural`
- Transitions: `--transition-base`, `--transition-color`, `--transition-transform`

**`src/styles/global.css`** — box-sizing reset, body font, base typography, background gradient.

**`src/styles/animations.css`** — reusable `@keyframes` (fadeIn, slideUp, gentleScale).

Each component has a co-located `*.module.css` file for scoped styles.

### Responsive Breakpoints

```css
/* Mobile-first approach */
/* Default: mobile styles (≤768px) */

@media (min-width: 769px) {
  /* Tablet and desktop styles */
}

@media (min-width: 1024px) {
  /* Large desktop styles */
}
```

### HomePage Filter Layout

**Mobile (≤768px):**
```
┌─────────────────────────┐
│  SearchBar (full width) │
├─────────────────────────┤
│  Kategori:              │
│  [Alam        ]         │
│  [Budaya      ]         │
│  [Kuliner     ]         │
│  [Adventure   ]         │
│  [Fotografi   ]         │
├─────────────────────────┤
│  Rentang Harga:         │
│  [Gratis      ]         │
│  [<50k        ]         │
│  [50k-100k    ]         │
│  [>100k       ]         │
├─────────────────────────┤
│  Filter Summary         │
│  (stacked)              │
└─────────────────────────┘
```

**Desktop (>768px):**
```
┌───────────────────────────────────────────────┐
│  SearchBar (full width)                       │
├───────────────────────────────────────────────┤
│  Kategori: [Alam] [Budaya] [Kuliner] ...     │
├───────────────────────────────────────────────┤
│  Rentang Harga: [Gratis] [<50k] [50k-100k]...│
├───────────────────────────────────────────────┤
│  Results: 12/50          [Clear All Filters]  │
└───────────────────────────────────────────────┘
```

### Responsive Grid

`TourismList.module.css` uses a CSS Grid layout:

```css
.grid {
  display: grid;
  gap: var(--space-lg);
  grid-template-columns: 1fr; /* mobile ≤768px: 1 column */
  animation: fadeIn var(--duration-base) var(--ease-natural);
}

@media (min-width: 769px) {
  .grid {
    grid-template-columns: repeat(
      auto-fill,
      minmax(280px, 1fr)
    ); /* desktop: 2-3 cols */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(
      auto-fill,
      minmax(320px, 1fr)
    ); /* large desktop: 3-4 cols */
  }
}
```

### Staggered Card Animation

```css
.tourismCard {
  animation: slideUp var(--duration-base) var(--ease-out-natural);
}

/* Stagger effect - each card delays slightly */
.tourismCard:nth-child(1) { animation-delay: 0ms; }
.tourismCard:nth-child(2) { animation-delay: 50ms; }
.tourismCard:nth-child(3) { animation-delay: 100ms; }
.tourismCard:nth-child(4) { animation-delay: 150ms; }
.tourismCard:nth-child(5) { animation-delay: 200ms; }
.tourismCard:nth-child(6) { animation-delay: 250ms; }
/* Additional cards continue pattern or cap at max delay */
```

## Error Handling

| Scenario                           | Behavior                                                            |
| ---------------------------------- | ------------------------------------------------------------------- |
| API fetch fails on HomePage        | Show `<ErrorMessage>` with retry button                             |
| Search/filter API call fails       | Show error message above results, preserve previous results         |
| No results match filters           | Show `<EmptyState>` with suggestion to adjust/clear filters         |
| Invalid `:id` on DetailPage        | Render `<NotFoundPage>`                                             |
| Unknown route                      | React Router `*` catches → `<NotFoundPage>`                         |
| Card image fails to load           | `onError` swaps `src` to placeholder image                          |
| Network timeout (>30s)             | Show timeout error with retry button                                |
| Debounce prevents rapid API calls  | Only final search term (after 400ms pause) triggers API             |

## Testing Strategy

Unit tests cover component rendering and user interactions using Vitest + React Testing Library:

**Existing Components:**
- `TourismCard` renders name, category, image, and triggers `onClick`
- `TourismList` shows spinner when `loading=true`, error message when `error` is set, and cards when data is present
- `ErrorMessage` renders retry button and calls `onRetry` on click
- `DetailPage` shows 404 page when `getDestinationById` returns null
- `TourismContext` calls `getAllDestinations` on mount and exposes correct state

**Phase 1: Nature Theme Components:**
- `Header` applies nature theme gradient and color palette correctly
- `Footer` uses earth tone background from design system
- `TourismCard` applies hover animation (transform and shadow) on mouse enter
- `Button` primary/secondary variants use correct nature theme colors
- CSS animations (fadeIn, slideUp) execute with correct timing

**Phase 2: Search & Filter Components:**
- `SearchBar` updates input value immediately and debounces API calls by 400ms
- `SearchBar` clear button appears when input has value and clears on click
- `CategoryFilter` toggles chip active state and calls `onCategoryToggle` correctly
- `CategoryFilter` allows multiple chips to be active simultaneously
- `PriceFilter` allows only one chip to be active at a time
- `PriceFilter` calls `onRangeSelect` with correct value when chip clicked
- `FilterSummary` displays correct result count and total count
- `FilterSummary` only shows "Clear All" button when `hasActiveFilters` is true
- `EmptyState` renders message, suggestion, and reset button when provided
- `useDebounce` hook delays value update by specified milliseconds
- `useDebounce` hook cancels previous timeout when value changes before delay

**Integration Tests:**
- Applying search filter triggers API call with search parameter
- Selecting categories triggers API call with category parameters
- Selecting price range triggers API call with priceRange parameter
- Combining multiple filters sends single API request with all parameters
- Clearing all filters resets state and displays all destinations
- Filter state persists when navigating to detail page and back
- Empty state appears when API returns zero results
- Error state appears and preserves previous results when filter API fails

**Accessibility Tests:**
- All interactive elements have proper ARIA labels
- Keyboard navigation works for all filters (Tab, Enter, Space)
- Screen reader announces filter changes and result counts
- Focus indicators visible on all interactive elements
- Color contrast meets WCAG AA standards for nature theme palette

**Why No Property-Based Testing:**

PBT is not applied here because the feature consists primarily of:
- **UI rendering** (cards, buttons, filters) — best tested with snapshots and example-based tests
- **Data fetching orchestration** — best tested with mocked API responses
- **Client-side routing** — best tested with React Router testing utilities
- **User interaction flows** — best tested with integration tests simulating user actions

None of these benefit from property-based testing over example-based unit and integration tests. PBT excels at testing pure functions with universal properties (parsers, algorithms, transformations), not UI components and side-effect-heavy React features.
