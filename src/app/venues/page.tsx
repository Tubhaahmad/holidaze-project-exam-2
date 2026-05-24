"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import VenueCard from "@/components/venues/VenueCard";
import { useVenues } from "@/hooks/useVenues";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "use-debounce";
import { Search } from "lucide-react";

function VenuesPage() {
  const searchParams = useSearchParams();
  // search will track what the user has typed in the search input
  const [search, setSearch] = useState(searchParams.get("search") || "");

  // debouncedSearch waits 300ms after the user stops typing before updating
  // This prevents a new API request on every single keystroke
  const [debouncedSearch] = useDebounce(search, 300);

  // useVenues fetches the venues from the API via TanStack Query
  const {
    data: venues,
    isLoading,
    isError,
  } = useVenues(debouncedSearch || undefined);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-gray-900">
          {search ? `Results for "${search}"` : "All Venues"}
        </h1>
        {venues && (
          <p className="text-gray-400 text-sm">
            {venues.length} {venues.length === 1 ? "venue" : "venues"} found
          </p>
        )}
      </div>

      {/* Search input */}
      {/* onChange updates search state as the user types, TanStack Query will automatically refetch when search changes */}
      <div className="mb-10 max-w-lg">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venues..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* An array of 8 numbers, looping over them */}
          {/* For each number rendering one skeleton card */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl">
              <Skeleton className="h-56 w-full rounded-2xl" />
              <div className="pt-3">
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="mb-4 h-3 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="py-20 text-center">
          <p className="text-gray-500">
            Something went wrong. Please try again.
          </p>
        </div>
      )}

      {/* Show this when venues have loaded but none match the search query */}
      {!isLoading && !isError && venues?.length === 0 && (
        <div className="py-20 text-center">
          <p className="mb-4 text-gray-500">{`No venues found for "${search}"`}</p>
          <button
            onClick={() => setSearch("")}
            className="text-sm text-coral underline hover:text-coral-hover"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Venue grid */}
      {!isLoading && !isError && venues && venues.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {venues.map((venue) => (
            <VenueCard key={venue.id} {...venue} />
          ))}
        </div>
      )}
    </div>
  );
}

// We wrap VenuesPage in Suspense because useSearchParams() requires it in Next.js
export default function VenuesPageWrapper() {
  return (
    <Suspense>
      <VenuesPage />
    </Suspense>
  );
}
