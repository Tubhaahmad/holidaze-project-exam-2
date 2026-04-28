//image object used across venues, profiles, and banners//
export interface MediaObject {
  url: string;
  alt: string;
}

//pagination info returned on all list endpoints (venues, bookings, profiles)//
export interface ApiMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

//generic wrapper for every API response. Data is the actual content, meta is pagination
//usage: ApiResponse<Venue>, ApiResponse<Booking[]>, ApiResponse<Profile> etc//
export interface ApiResponse<T> {
  data: T;
  meta: ApiMeta | Record<string, never>;
}

//PROFILE//

//A registered user — either a customer or a venue manager//
//venues and bookings are optional because they only appear when _venues=true or _bookings=true is passed//
export interface Profile {
  name: string;
  email: string;
  bio: string;
  avatar: MediaObject;
  banner: MediaObject;
  venueManager: boolean;
  _count?: {
    venues: number;
    bookings: number;
  };
  venues?: Venue[];
  bookings?: Booking[];
}

//VENUE//

//the amenities a venue can offer - all booleans, all default to false
export interface VenueMeta {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
}

//Physical location of a venue, all fields are optional from the API side
export interface VenueLocation {
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  continent: string | null;
  lat: number;
  lng: number;
}

// A venue listing — the core model of the app
//Owner only appears when _owner=true is passed, bookings only when _bookings=true is passed
export interface Venue {
  id: string;
  name: string;
  description: string;
  media: MediaObject[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: VenueMeta;
  location: VenueLocation;
  owner?: Profile;
  bookings?: Booking[];
}

//BOOKING//

//a booking made by a customer at a venue
// venue only appears when _venue=true is passed, customer only when _customer=true is passed
export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue?: Venue;
  customer?: Profile;
}

//AUTH//

//the  response shape when a user registers or logs in
//accessToken is the JWT used in the Authorization header for all authenticated requests
export interface AuthResponse {
  name: string;
  email: string;
  bio: string;
  avatar: MediaObject;
  banner: MediaObject;
  accessToken: string;
  venueManager: boolean;
}
