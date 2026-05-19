//this is the base API client for the entire app.
//all API calls go through the fetcher() function below.

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

//read environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_NOROFF_API_KEY;

//getToken reads the JWT token from localStorage
//we read it here so every authenticated request gets the token automatically
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("holidaze-auth");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.state?.accessToken ?? null;
  } catch {
    return null;
  }
}

//requestOptions extends the standard fetch RequestInit options
//asnd adds an optional params object for query parameters
interface RequestOptions extends RequestInit {
  params?: Record<string, string | boolean>;
}

export async function fetcher<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, ...init } = options;

  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const url = new URL(`${BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const token = getToken();

  const response = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",

      ...(API_KEY ? { "X-Noroff-API-Key": API_KEY } : {}),

      ...(token ? { Authorization: `Bearer ${token}` } : {}),

      ...init.headers,
    },
  });

  //DELETE endpoints return 204 No Content with no body
  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      json.errors?.[0]?.message ?? "Something went wrong",
    );
  }

  return json as T;
}
