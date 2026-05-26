import { create } from "zustand";
import { persist } from "zustand/middleware";

// types

// profile - logged in user
export interface User {
  name: string;
  email: string;
  bio: string;
  avatar: {
    url: string;
    alt: string;
  };
  banner: {
    url: string;
    alt: string;
  };
  venueManager: boolean;
}

// what the auth store holds
interface AuthState {
  // to authenticate requests
  accessToken: string | null;

  // the logged-in user's profile data
  user: User | null;

  // a boolean to check if the user is logged in
  isLoggedIn: boolean;

  // actions - functions that will update the store

  // saves the token and user profile to the store after login/register
  login: (token: string, user: User) => void;

  // clears the token and user profile from store and localStorage
  logout: () => void;

  // Partial<User> - we can pass in just the fields we want to change/update instead of the entire user object
  // called when the user updates their profile (e.g. avatar)
  updateUser: (partial: Partial<User>) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // initial state-no user is logged in
      accessToken: null,
      user: null,
      isLoggedIn: false,

      // logging in saves the token and user to the store
      login: (token, user) =>
        set({
          accessToken: token,
          user,
          isLoggedIn: true,
        }),

      // clears everything from the store
      // persist middlewear will also clear it from localStorage
      logout: () =>
        set({
          accessToken: null,
          user: null,
          isLoggedIn: false,
        }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      // this is the key used to save the store in localStorage
      name: "holidaze-auth",
    },
  ),
);

// hook - what components call to read from the store
export function useAuth() {
  return useAuthStore();
}

export { useAuthStore };
