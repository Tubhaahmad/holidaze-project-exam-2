import { fetcher } from "./client";
import { ApiResponse, Venue } from "@/types/api";

export async function getVenues(search?: string): Promise<Venue[]> {
  const endpoint = search
    ? `/holidaze/venues/search?q=${search}`
    : `/holidaze/venues`;

  const response = await fetcher<ApiResponse<Venue[]>>(endpoint, {
    params: search ? undefined : { limit: "100" },
  });

  return response.data;
}

//GET ALL VENUES
//used by the venue detail page (/venues/[id])
//requests owner and bookings data alongside the venue

export async function getVenue(id: string): Promise<Venue> {
  const response = await fetcher<ApiResponse<Venue>>(`/holidaze/venues/${id}`, {
    params: {
      _owner: true,
      _bookings: true,
    },
  });

  return response.data;
}

// Create a venue
// used by the create venue form on /dashboard/venues/new

export interface CreateVenueData {
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  media?: { url: string; alt: string }[];
  meta?: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location?: {
    address?: string;
    city?: string;
    country?: string;
    continent?: string;
  };
}

export async function createVenue(data: CreateVenueData): Promise<Venue> {
  const response = await fetcher<ApiResponse<Venue>>("/holidaze/venues", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.data;
}
