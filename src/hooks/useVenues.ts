// custom hook that fetches all venues from the Noroff API.
// uses the typed API client from src/lib/api/venue.ts
// instead of fetching directly, this keeps all API logic in one place

// this uses TanStack Query — no useEffect needed.
// the actual API call lives in src/lib/api/venue.ts — this hook
// just connects TanStack Query to that function.

import { useQuery } from "@tanstack/react-query";
import { getVenues } from "@/lib/api/venue";

export function useVenues(search?: string, page: number = 1) {
  return useQuery({
    // queryKey includes search and page so a new request is made when either changes
    queryKey: ["venues", search, page],
    queryFn: () => getVenues(search, page),
  });
}

// fetches all venues at once for client-side filtering
export function useAllVenues(search?: string) {
  return useQuery({
    queryKey: ["venues-all", search],
    queryFn: () => getVenues(search, 1, true),
  });
}
