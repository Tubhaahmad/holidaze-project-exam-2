// custom hook that fetches a single venue by its ID.
// we pass _owner=true and _bookings=true in the API call so the response
// also includes the venue owner's profile and all existing bookings.

// we need bookings to show which dates are already taken on the calendar.
// we need the owner to show host information on the venue detail page.

// the actual API call lives in src/lib/api/venue.ts — this hook just connects TanStack Query to that function.

import { useQuery } from "@tanstack/react-query";
import { getVenue } from "@/lib/api/venue";
import { Venue } from "@/types/api";

export function useVenue(id: string) {
  return useQuery<Venue>({
    // queryKey includes the id so each venue gets its own cache entry
    queryKey: ["venue", id],

    // queryFn calls the API function from src/lib/api/venue.ts
    queryFn: () => getVenue(id),
  });
}
