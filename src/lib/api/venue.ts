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
