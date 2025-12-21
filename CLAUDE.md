# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trip Scanner is a React + TypeScript frontend application that helps users find the cheapest departure airports for their destination. It searches multiple airports within a region and displays flight options sorted by price. Built with Vite, React 19, TanStack Query, and Tailwind CSS.

## Development Commands

```bash
# Development
npm run dev                 # Start dev server (http://localhost:5173)

# Build
npm run build              # Type check with TypeScript + Vite build
tsc -b                     # Type check only

# Code Quality
npm run lint               # Run ESLint
npm run preview            # Preview production build locally
```

## Backend Integration

- Backend API URL configured via `VITE_API_BASE_URL` environment variable
- Default: `http://localhost:8080` (see `.env`)
- Backend is expected to be a Spring Boot application with endpoints:
  - `POST /api/v1/search` - Search flights
  - `GET /actuator/health` - Health check

## Architecture

### State Management Strategy

**React Query (TanStack Query) for server state:**
- All flight search data managed via `useFlightSearch` hook
- Configuration in `src/lib/queryClient.ts`:
  - 1 retry for queries
  - No refetch on window focus
  - 5 minute stale time (flight prices change slowly)
  - 10 minute cache time

**URL Search Params for search criteria:**
- Search parameters (destination, region, maxResults) passed via URL query params
- Enables shareable search URLs
- Pattern: `/results?destination=BKK&region=EUROPE&maxResults=10`

**Local state only for form inputs:**
- Form validation and temporary UI state in components

### Data Flow

1. **SearchPage** (`src/pages/SearchPage.tsx`):
   - User enters search criteria (destination IATA code, region, max results)
   - Validates input (3-letter code, 5-50 results)
   - Navigates to `/results` with query params

2. **ResultsPage** (`src/pages/ResultsPage.tsx`):
   - Reads search params from URL
   - Triggers flight search via `useFlightSearch` hook
   - Displays loading state with skeletons
   - Shows results sorted by price (cheapest first)
   - Calculates statistics (cheapest, average price)
   - Highlights best deal

3. **API Layer** (`src/api/`):
   - `config.ts`: Axios instance with 30s timeout (flight searches are slow)
   - Interceptors handle auth tokens (future), logging (dev only), error messages
   - `flightService.ts`: Typed API methods

### Component Architecture

**Page Components** (`src/pages/`):
- Self-contained pages with data fetching
- Handle routing and layout
- Pass data down to presentational components

**UI Components** (`src/components/ui/`):
- Generic, reusable components (Button, Card, Badge, Skeleton)
- Built with Tailwind CSS via `class-variance-authority` pattern
- Use `cn()` utility for class merging (clsx + tailwind-merge)

**Feature Components** (`src/components/flight/`):
- Domain-specific components (FlightCard, FlightCardSkeleton)
- Contain flight-related presentation logic

### Styling System

- **Tailwind CSS 4.x** with custom theme configuration
- Custom color palette in `tailwind.config.js`:
  - `primary`: Blue shades (flight/travel theme)
  - `success`: Green (best deals, direct flights)
  - `warning`: Orange (booking deadlines)
  - `danger`: Red (errors)
- Global styles in `src/index.css`
- Custom animations: `animate-in` (fade), `slide-up`
- `cn()` utility for conditional classes with proper precedence

### TypeScript Types

All types in `src/types/flight.ts` mirror backend API response structure:
- `FlightSearchResponse`: Top-level search response
- `FlightOffer`: Individual flight with price, duration, stops, booking info
- `FlightSegment`, `Location`, `Layover`: Multi-segment flight support
- `BookingOption`: External booking links (Google Flights, airline direct, etc.)

**Important:** Backend fields may be nullable (phased rollout). Handle nulls gracefully.

### Routing

- React Router v7 with BrowserRouter
- Routes defined in `src/App.tsx`:
  - `/` - Search form (home)
  - `/results` - Flight results
  - `*` - Redirect to home (404 handling)

## Code Patterns

### API Error Handling

- Axios interceptors provide user-friendly error messages
- Network errors: "Unable to connect to server"
- HTTP errors: Contextual messages based on status code
- All errors logged to console with `[API]` prefix

### Component Patterns

- Functional components with hooks
- `forwardRef` for components that expose DOM refs (Button)
- Props interfaces defined inline or above component
- Loading states with dedicated skeleton components

### Formatting Utilities

`src/lib/formatters.ts` provides consistent formatting:
- `formatPrice(amount, currency)` - Localized price with currency symbol
- `formatDuration(minutes)` - Human-readable duration (e.g., "2h 15m")
- `formatStops(count)` - Flight stops (e.g., "Direct", "1 stop")
- `formatTime(isoString)` - Localized date/time

## Environment Variables

Required in `.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

Vite automatically loads `.env` files. Access via `import.meta.env.VITE_*`.

## Key Dependencies

- **React 19**: Latest stable with new features
- **Vite 7**: Build tool and dev server
- **TanStack Query v5**: Server state management
- **React Router v7**: Client-side routing
- **Axios**: HTTP client with interceptors
- **Tailwind CSS 4**: Utility-first styling
- **lucide-react**: Icon library
- **date-fns**: Date formatting utilities
- **zustand**: (installed but not yet used - for future client state if needed)

## Notes for Future Development

- Auth token handling is stubbed in `src/api/config.ts` (reads from localStorage)
- Backend may return null for certain FlightOffer fields (phased feature rollout)
- Flight search can take 10-30 seconds - timeouts set accordingly
- No tests currently - consider adding Vitest for unit tests
- Consider adding React Query DevTools in development for debugging
