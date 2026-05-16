import { useQuery } from "@tanstack/react-query";

//types

interface MediaObject {
  url: string;
  alt: string;
}

interface Profile {
  name: string;
  email: string;
  bio: string;
  avatar: MediaObject;
  banner: MediaObject;
}

interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  customer?: Profile;
}

interface VenueMeta {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
}

interface VenueLocation {
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  continent: string | null;
  lat: number;
  lng: number;
}

export interface SingleVenue {
  id: string;
  name: string;
  description: string;
  media: MediaObject[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: VenueMeta;
  location: VenueLocation;
  owner?: Profile;
  bookings?: Booking[];
}

//fetch function

async function fetchVenue(id: string): Promise<SingleVenue> {
  //requesting owner and bookings data alongside the venue
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/holidaze/venues/${id}?_owner=true&_bookings=true`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Venue not found");
  }

  const json = await response.json();
  return json.data;
}

//hook
export function useVenue(id: string) {
  return useQuery({
    // queryKey includes the id so each venue gets its own cache entry
    queryKey: ["venue", id],
    queryFn: () => fetchVenue(id),
  });
}
