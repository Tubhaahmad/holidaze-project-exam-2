// hook fetches all venues owned by the logged-in venue manager.
// uses getVenuesByProfile from the API client which fetches the manager's
// profile with all their venues and booking counts included.

import { useQuery } from "@tanstack/react-query";
import { getVenuesByProfile } from "@/lib/api/profiles";
import { useAuth } from "@/features/auth/store";
import { Venue } from "@/types/api";

export function useManagerVenues() {
  const { user } = useAuth();

  return useQuery<Venue[]>({
    // queryKey includes the manager name so the cache is per manager
    queryKey: ["manager-venues", user?.name],

    queryFn: async () => {
      if (!user?.name) throw new Error("Not logged in");

      // return the venues array from the profile
      return getVenuesByProfile(user.name);
    },

    // only run the query if the user is logged in
    enabled: !!user?.name,
  });
}
