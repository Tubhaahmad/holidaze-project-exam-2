# Holidaze

**Find your perfect stay.**

Holidaze is a modern accommodation booking platform built as a front-end exam project for Noroff. Customers can browse, search and book unique venues around the world. Venue managers can list and manage their properties and view incoming bookings.

**Live:** [holidaze-project-exam-2-4b6e.vercel.app](https://holidaze-project-exam-2-4b6e.vercel.app)

**Course:** Front-End Development Year 2  Noroff

---

## Features

### All users (visitors)
- Browse and search all venues
- Filter venues by amenities (WiFi, Parking, Breakfast, Pets)
- Sort venues by price or rating
- View venue detail pages with image carousel and availability calendar
- Register as a customer or venue manager with a stud.noroff.no email

### Customers
- Log in and out
- Book a venue by selecting check-in and check-out dates
- View upcoming bookings on their profile page
- Update their avatar

### Venue Managers
- Log in and out
- Create, edit and delete venues they manage
- Upload up to 8 images per venue with live preview
- View all bookings for each venue with stats (total bookings, revenue, guests)
- Update their avatar

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16.2.4 | App Router, TypeScript, server-side rendering |
| React | 19 | UI library |
| TypeScript | 5.x | Type safety (strict mode) |
| Tailwind CSS | 4.x | Utility-first styling |
| shadcn/ui | latest | Accessible UI components |
| TanStack Query | 5.x | Data fetching, caching and mutations |
| Zustand | 5.x | Auth state management with localStorage persistence |
| React Hook Form | 7.x | Form state management |
| Zod | 3.x | Schema validation |
| Noroff API | v2 | Backend REST API |
| Vercel | — | Hosting, auto-deploys from `main` |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Tubhaahmad/holidaze-project-exam-2
cd holidaze-project-exam-2
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_BASE_URL=https://v2.api.noroff.dev
NEXT_PUBLIC_NOROFF_API_KEY=your_api_key_here
```

Get your API key from [Noroff API documentation](https://docs.noroff.dev/).

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

---

## Scripts

```bash
npm run dev        # Start dev server on localhost:3000
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
```

---

## Project Structure
```

src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage with hero, search and featured venues
│   ├── venues/
│   │   ├── page.tsx              # Venue listing with search, filters and pagination
│   │   └── [id]/page.tsx         # Venue detail with carousel and booking card
│   ├── login/page.tsx            # Login page
│   ├── register/page.tsx         # Register page
│   ├── profile/page.tsx          # Customer profile with bookings and avatar update
│   ├── about/page.tsx            # About page
│   └── dashboard/
│       ├── page.tsx              # Manager dashboard with venue grid and stats
│       └── venues/
│           ├── new/page.tsx      # Create venue form
│           └── [id]/
│               ├── edit/page.tsx     # Edit and delete venue form
│               └── bookings/page.tsx # Manager bookings view per venue
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Navbar
│   │   └── Footer.tsx            # Footer with stats and CTA
│   ├── venues/
│   │   └── VenueCard.tsx         # Venue card with rating badge
│   ├── providers/
│   │   └── QueryProvider.tsx     # TanStack Query provider
│   └── ui/                       # shadcn/ui components
├── features/
│   ├── auth/store.ts             # Zustand auth store with persist middleware
│   ├── bookings/
│   │   └── BookingCalendar.tsx   # Full booking flow with date selection
│   └── profile/
│       └── AvatarUpdateForm.tsx  # Avatar update form with live preview
├── hooks/
│   ├── useVenues.ts              # Fetch venues with search and pagination
│   ├── useVenue.ts               # Fetch single venue with owner and bookings
│   ├── useCustomerBookings.ts    # Fetch customer bookings
│   └── useManagerVenues.ts      # Fetch manager venues
├── lib/
│   └── api/
│       ├── client.ts             # Base fetcher with auth headers
│       ├── auth.ts               # Register and login
│       ├── venue.ts              # Venue CRUD operations
│       ├── bookings.ts           # Create booking, get bookings
│       └── profiles.ts           # Get profile, update avatar
└── types/
└── api.ts                    # TypeScript interfaces for all API responses
```
---

## Architecture Notes

**All API calls go through a central fetcher.** `src/lib/api/client.ts` exports a `fetcher()` function that automatically attaches the auth token from localStorage and the Noroff API key to every request. This means auth headers are never forgotten and the base URL is configured in one place.

**Auth token is read directly from localStorage.** Zustand's `persist` middleware saves the auth state to localStorage under the key `holidaze-auth`. The `getToken()` function in `client.ts` reads the token directly from localStorage rather than from the Zustand store to avoid hydration timing issues where the store might not have loaded yet.

**TanStack Query handles all data fetching.** Every API call uses `useQuery` or `useMutation` — never `useEffect` with raw `fetch`. This gives automatic caching, background refetching, loading and error states, and cache invalidation after mutations (e.g. creating a venue invalidates the manager venues cache so the dashboard updates immediately).

**The Noroff register endpoint does not return an access token.** After registration, the app immediately calls the login endpoint to get a token. The login endpoint requires `?_holidaze=true` to return the full profile including the `venueManager` flag.

---

## Lighthouse Scores

Tested on production deployment (mobile and desktop):

| Category | Mobile | Desktop |
|---|---|---|
| Performance | 95 | 96 |
| Accessibility | 96 | 96 |
| Best Practices | 77 | 77 |
| SEO | 100 | 100 |

> Best Practices score of 77 is caused by third-party cookies set by Vercel's infrastructure, outside of application control.

---

## AI Usage

All AI assistance used during this project is documented in `AI_LOG.md` as required by the course brief. AI was used for debugging, explaining concepts, and code review. All code was written, understood and reviewed by the developer.
