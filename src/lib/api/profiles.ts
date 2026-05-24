import { fetcher } from "./client";
import { ApiResponse, Profile, Venue } from "@/types/api";

//GET PROFILE BY NAME
//Used by the profile page to fetch the logged-in user's profile data
export async function getProfile(name: string): Promise<Profile> {
  const response = await fetcher<ApiResponse<Profile>>(
    `/holidaze/profiles/${name}`,
    {
      params: {
        _venues: true,
        _bookings: true,
      },
    },
  );

  return response.data;
}

//update avatar
//called when a user updates their profile picture
export async function updateAvatar(
  name: string,
  avatarUrl: string,
  bio?: string,
): Promise<Profile> {
  const response = await fetcher<ApiResponse<Profile>>(
    `/holidaze/profiles/${name}`,
    {
      method: "PUT",
      body: JSON.stringify({
        avatar: { url: avatarUrl, alt: name },
        ...(bio !== undefined && { bio }),
      }),
    },
  );

  return response.data;
}

//Get venues by profile
// Used by the manager dashboard to fetch all venues owned by the logged-in manager
export async function getVenuesByProfile(name: string): Promise<Venue[]> {
  const response = await fetcher<ApiResponse<Venue[]>>(
    `/holidaze/profiles/${name}/venues`,
    {
      params: {
        _bookings: true,
      },
    },
  );

  return response.data;
}
