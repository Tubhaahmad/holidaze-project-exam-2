// This is a custom hook that fetches all venues from the Noroff API.
// We extract the fetching logic here so that:
// The venues page stays clean and only handles displaying data
// If we need venues anywhere else in the app, we just call useVenues()
// All the loading/error states are handled in one place

// This is fetching data using TanStack Query, no useEffect is needed.

import { useQuery } from "@tanstack/react-query";

// The shape of a single venue from the Noroff API
interface Venue {
  id: string;
  name: string;
  media: { url: string; alt: string }[];
  price: number;
  maxGuests: number;
  rating: number;
  location: {
    city: string | null;
    country: string | null;
  };
}

// fetch function: fetches venues from the API
// keeping it seperate from the hook so it is easy to test and reuse.
// the search parameter is optional, if its provided it uses the search endpoint, otherwise it will fetch all venues.
async function fetchVenues(search?: string): Promise<Venue[]> {
  const url = search
    ? `https://v2.api.noroff.dev/holidaze/venues/search?q=${search}`
    : `https://v2.api.noroff.dev/holidaze/venues?limit=100`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch venues");
  }

  const json = await response.json();

  return json.data;
}

// this hook will be called by components.
//returns venue data, loading state and error state

export function useVenues(search?: string) {
  return useQuery({
    //with queryKey, Tanstack query identifies and caches the request.
    // Including search in the key means a new request is made when search changes.
    queryKey: ["venues", search],

    //queryFn is the function that fetches the data.
    queryFn: () => fetchVenues(search),
  });
}
