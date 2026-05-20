import { User } from "@/features/auth/store";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_NOROFF_API_KEY;

//the data we send to the API when registering
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  venueManager: boolean;
}

//the data we send to the API when logging in
export interface LoginData {
  email: string;
  password: string;
}

//the shape of ther response we get back from login and register
//this includes the user profile and the accessToken
export interface AuthResponse {
  accessToken: string;
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

//REGISTER

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY!,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message ?? "Registration failed");
  }

  return json.data;
}

//LOGIN
export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/login?_holidaze=true`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY!,
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message ?? "Login failed");
  }

  return json.data;
}
