import { fetcher } from "./client";
import { ApiResponse, Venue } from "@/types/api";

// get venues with optional search, pagination and fetchAll flag
// fetchAll fetches all venues at once for client-side filtering
export async function getVenues(
  search?: string,
  page: number = 1,
  fetchAll: boolean = false,
): Promise<{ venues: Venue[]; totalCount: number; pageCount: number }> {
  const endpoint = search
    ? `/holidaze/venues/search?q=${search}&limit=100&page=1`
    : `/holidaze/venues`;

  const response = await fetcher<ApiResponse<Venue[]>>(endpoint, {
    params: search
      ? undefined
      : fetchAll
        ? { limit: "100", page: "1" }
        : { limit: "12", page: String(page) },
  });

  return {
    venues: response.data,
    totalCount: response.meta?.totalCount ?? 0,
    pageCount: response.meta?.pageCount ?? 1,
  };
}

// GET SINGLE VENUE
// used by the venue detail page (/venues/[id])
// requests owner and bookings data alongside the venue
export async function getVenue(id: string): Promise<Venue> {
  const response = await fetcher<ApiResponse<Venue>>(`/holidaze/venues/${id}`, {
    params: {
      _owner: true,
      _bookings: true,
    },
  });

  return response.data;
}

// create a venue
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

// update venue
// used by the edit venue page
export async function updateVenue(
  id: string,
  data: CreateVenueData,
): Promise<Venue> {
  const response = await fetcher<ApiResponse<Venue>>(`/holidaze/venues/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  return response.data;
}

// delete venue
export async function deleteVenue(id: string): Promise<void> {
  await fetcher<void>(`/holidaze/venues/${id}`, {
    method: "DELETE",
  });
}

// get bookings for a venue
// used by the manager bookings view
// returns all bookings for a specific venue including customer info
export async function getVenueBookings(id: string): Promise<Venue> {
  const response = await fetcher<ApiResponse<Venue>>(`/holidaze/venues/${id}`, {
    params: {
      _bookings: true,
      _customer: true,
    },
  });

  return response.data;
}
