# AI Log - Holidaze

AI assistance used during this project is documented here as required by the Noroff course brief.

## How AI was used in this project

- **Project planning** - AI was used to help structure and write GitHub issues and Kanban board tickets. The plans and ideas were my own, but AI helped organise my thoughts into clearer and more detailed ticket descriptions.
  
- **About page content** - AI assisted in writing the text content for the About page.
  
- **Debugging** - AI was used to help identify and understand bugs, explain error messages, and suggest fixes.
  
- **Explaining concepts** - AI helped explain new concepts and tools I encountered for the first time in this project, such as TanStack Query, Zod, and Zustand.
  
- **General assistance** - AI helpied with thinking through implementation approaches.

---

## 28 April 2026

**Purpose:** Understanding GitHub file size limits

**Fix:** Replaced local video file with a hosted Pexels URL.

**Outcome:** Learned that binary files like videos should never be committed to git. Use hosted URLs instead.

---

## 29 April 2026

**Purpose:** /venues page was initially built with server-side fetch, which conflicts with TanStack Query. Had to rebuild it as a client component after first creating the useVenues() custom hook.

**Fix:** Created the useVenues() custom hook first, then rewrote the page as a client component using useQuery instead of direct fetch.

**Outcome:** Page now has automatic caching, loading states, and error handling via TanStack Query. Learned that TanStack Query hooks only work in client components ("use client"). Correct order is: build the hook first, then the page that uses it.

---

## 30 April 2026

**Purpose:** Vercel build failing on /venues. useSearchParams() must be wrapped in a Suspense boundary in Next.js production builds.

**Fix:** Split the page into two components. VenuesPage with the logic, and VenuesPageWrapper that wraps it in Suspense. Only the wrapper is exported as default.

**Outcome:** Build passed. /venues page renders correctly with URL search params working as expected. Learned that useSearchParams() requires a Suspense boundary in Next.js production builds. Also learned to run npm run build locally before pushing to catch production errors the dev server misses.

---

## 30 April 2026

**Purpose:** Understanding state management vs raw browser storage.

**Fix:** Conceptual understanding through AI explanation.

**Outcome:** Learned that localStorage stores data but can't reactively update components. Zustand adds a reactive layer so components re-render on state changes, while the persist middleware handles the localStorage sync automatically.

---

## 30 April 2026

**Purpose:** Understanding when to use "use client".

**Fix:** Added "use client" to pages that need interactivity.

**Outcome:** Learned that server components fetch data on the server (faster, better SEO) but can't use React hooks. Client components run in the browser and can use hooks like useState and useQuery.

---

## 13 May 2026

**Purpose:** Implement Next.js middleware to protect routes and redirect unauthenticated users.

**Problem:** Middleware couldn't read auth state because Zustand persists to localStorage, not cookies. Middleware only has access to cookies, so isLoggedIn was always false, blocking all users including logged-in ones. Also discovered that middleware.ts is deprecated in Next.js 16 and must be renamed to proxy.ts with the exported function renamed from middleware to proxy.

**Fix:** Simplified proxy.ts to just pass requests through. Route protection handled in page components using useEffect and the Zustand store instead.

**Outcome:** Login, register, and logout all working correctly. Auth state reflected in Navbar. Learned that middleware/proxy can only read cookies. If you need to protect routes using localStorage-based auth, handle it client-side in the component instead.

---

## 15 May 2026

**Purpose:** Fix 401 Unauthorized error when submitting a booking.

**Fix:** Read the token directly from localStorage instead of relying on the Zustand store in the BookingCalendar component using a getToken() helper function.

**Outcome:** Booking submission worked. Learned that Zustand's persist middleware can sometimes have hydration timing issues where the store appears populated (isLoggedIn: true) but individual values like accessToken haven't fully rehydrated yet. Reading directly from localStorage is a reliable fallback in these cases.

---

## 16 May 2026

**Purpose:** Fix shadcn Calendar component breaking the production build.

**Problem:** The table property in the shadcn Calendar classNames object no longer exists in the current version of react-day-picker, causing a TypeScript type error only visible in production builds.

**Fix:** Removed the table line from calendar.tsx.

**Outcome:** Build passed. Learned that shadcn components are auto-generated and can sometimes be out of sync with the underlying library version.

---

## 19 May 2026

**Purpose:** Clean up the codebase by building a proper typed API client layer in src/lib/api/ so all API calls go through one centralised place instead of being scattered across hooks and components.

**Fix:** Built four API files: client.ts (base fetcher with ApiError class and automatic auth header injection), venue.ts, bookings.ts, and profiles.ts. Updated all hooks and components to import from the API client. Removed duplicate type definitions, all types now imported from src/types/api.ts.

**Outcome:** All API calls now go through one centralised place. Auth headers, error handling and base URL are configured once. Learned that hooks should only be responsible for connecting TanStack Query to API functions, not for making fetch calls directly.

---

## 19 May 2026

**Purpose:** Refactor BookingCalendar to use useMutation from TanStack Query instead of a manual fetch call with useState for loading state.

**Fix:** Replaced the raw fetch call and isSubmitting state with useMutation. The mutation function calls createBooking from the API client, and onSuccess/onError callbacks handle the toast notifications and redirect. isPending from useMutation replaces the manual isSubmitting state.

**Outcome:** Booking submission is now consistent with the rest of the app's data fetching pattern. Learned that useMutation is the TanStack Query way of handling API writes (POST, PUT, DELETE) - it gives you isPending, onSuccess, and onError for free without managing state manually.

---

## 19 May 2026

**Purpose:** Fix getToken() in client.ts returning undefined even though the user was logged in.

**Problem:** Console log showed token: undefined. Checking localStorage revealed the stored state had user and isLoggedIn: true but no accessToken. The token was never saved to the persisted state during the previous login session.

**Fix:** User logged out and back in to get a clean session with the updated store structure.

**Outcome:** Bookings and avatar update both worked after re-login. Learned that old sessions saved before a Zustand store change won't automatically have new fields. Users need to log out and back in to get a clean session.

---

## 20 May 2026

**Purpose:** Fix register flow. Venue managers were showing as customers after registration.

**Problem:** The Noroff /auth/register endpoint does not return an accessToken in the response. This meant after registration the user was saved to the Zustand store without a token, causing all authenticated requests to fail with 401.

**Fix:** Called the login endpoint immediately after a successful registration to get the token and venueManager flag, then saved both to the Zustand store.

**Outcome:** Registration now correctly saves the token and venueManager flag. Users are redirected to the correct page after registration based on their role.

---

## 24 May 2026

**Purpose:** Fix the shadcn Calendar component breaking the layout on tablet screen sizes.

**Problem:** The shadcn Calendar has a hardcoded minimum internal width. At the md breakpoint the booking card column was too narrow to fit the calendar, causing the layout to break and overflow horizontally.

**Fix:** Changed the grid breakpoint from md to lg so the sidebar only appears when there is enough horizontal space for the calendar. Updated all md: prefixes in the venue detail grid to lg:.

**Outcome:** Calendar displays correctly at all screen sizes. Learned that third-party UI components can have hardcoded minimum widths that conflict with responsive grid layouts, and that changing the breakpoint is often the cleanest solution.

---

## 24 May 2026

**Purpose:** Fix the homepage hero search bar overflowing on mobile screen sizes.

**Problem:** The search bar input was pushing outside its container on small screens because the input's default min-width was larger than the available space, and the submit button was shrinking the input further.

**Fix:** Added min-w-0 to both the input wrapper div and the input element itself. Added shrink-0 to the submit button to prevent it from being squished. Replaced the text Search button with a coral circle icon button to save horizontal space.

**Outcome:** Search bar works correctly on all screen sizes. Learned that min-w-0 is essential for flex children that contain text inputs. Without it, inputs ignore their flex container's width constraints.

---

## 24 May 2026

**Purpose:** Fix the homepage hero category card creating too much space between the search bar and the card on mobile.

**Problem:** Using justify-between on the hero flex container pushed the search bar to the top and the category card to the very bottom of the screen, creating a huge gap on shorter mobile screens.

**Fix:** Removed justify-between and used mt-auto on the category card wrapper instead.

**Outcome:** Category card sits naturally at the bottom of the hero on all screen sizes. Learned that mt-auto is more flexible than justify-between when only one element needs to be pushed to the bottom.

---

## 24 May 2026

**Purpose:** Fix the venue detail page carousel arrows overflowing outside the container on mobile.

**Problem:** The shadcn CarouselPrevious and CarouselNext components are positioned absolutely outside the carousel container by default, causing them to overflow on small screens.

**Fix:** Added new classes to the arrow buttons to position them inside the carousel image. 

**Outcome:** Carousel arrows are visible and functional on all screen sizes. Learned that shadcn carousel arrows need manual positioning classes to stay within the container bounds.

---

## 24 May 2026

**Purpose:** Improve Lighthouse scores for performance, accessibility and best practices.

**Problem:** Initial scores were Performance 84, Accessibility 90, Best Practices 77, SEO 100. Issues were low contrast text and icon-only buttons without accessible names.

**Fix:** Replaced text color across all pages. Added aria-label="Search venues" to the search button. Added HTTP security headers to next.config.ts: X-Frame-Options, X-Content-Type-Options, Referrer-Policy and Permissions-Policy.

**Outcome:** Final scores: Performance 95/96, Accessibility 96/96, Best Practices 77/77, SEO 100/100 on mobile and desktop. Best Practices 77 remains due to third-party cookies from Vercel's infrastructure which cannot be controlled. Learned that text-gray-400 on white backgrounds fails WCAG AA contrast requirements.

---

## 25 May 2026

**Purpose:** Fix venue filtering applying only to the current pagination page instead of all venues.

**Problem:** Filters and sort were applied client-side to only the 12 venues on the current page, instead of all venues. This meant filtering WiFi venues would only show WiFi venues from the current page, not all WiFi venues across the entire dataset.

**Fix:** Added a useAllVenues hook that fetches all 100 venues at once. When filters or sort are active, the app uses useAllVenues instead of the paginated useVenues. Client-side pagination is then applied to the filtered results using slice.

**Outcome:** Filtering and sorting now work correctly across all venues. Learned that client-side filtering requires all data to be available locally. Mixing server-side pagination with client-side filtering causes incorrect results.
