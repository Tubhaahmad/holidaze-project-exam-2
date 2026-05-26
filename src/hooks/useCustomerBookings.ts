// custom hook that fetches all bookings for the logged-in customer.
// uses the getBookingsByProfile function from the API client

import { useQuery } from "@tanstack/react-query";
import { getBookingsByProfile } from "@/lib/api/bookings";
import { useAuth } from "@/features/auth/store";
import { Booking } from "@/types/api";

export function useCustomerBookings() {
  const { user } = useAuth();

  return useQuery<Booking[]>({
    // queryKey includes the user name so the cache is per user
    queryKey: ["bookings", user?.name],

    // queryFn calls the API function from src/lib/api/bookings.ts
    queryFn: async () => {
      if (!user?.name) throw new Error("Not logged in");

      const bookings = await getBookingsByProfile(user.name);

      // sort bookings ascending by dateFrom, nearest check-in first
      return bookings.sort(
        (a, b) =>
          new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime(),
      );
    },

    // only run the query if the user is logged in
    enabled: !!user?.name,
  });
}
