import { fetcher } from "./client";
import { ApiResponse, Booking } from "@/types/api";

// CREATE A BOOKING
// called when a customer clicks Book Now on a venue detail page
export interface CreateBookingData {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
}

export async function createBooking(data: CreateBookingData): Promise<Booking> {
  const response = await fetcher<ApiResponse<Booking>>("/holidaze/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response.data;
}

// get bookings by profile
// used by the profile page to show a customer's upcoming bookings
// the profile name is the user's username from the Zustand store
export async function getBookingsByProfile(
  profileName: string,
): Promise<Booking[]> {
  const response = await fetcher<ApiResponse<Booking[]>>(
    `/holidaze/profiles/${profileName}/bookings`,
    {
      params: {
        _venue: true,
      },
    },
  );

  return response.data;
}
