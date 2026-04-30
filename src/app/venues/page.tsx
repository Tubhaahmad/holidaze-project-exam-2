"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import VenueCard from "@/components/venues/VenueCard";
import { useVenues } from "@/hooks/useVenues";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "use-debounce";

function VenuesPage() {
  const searchParams = useSearchParams();
  //search will track what the user has typed in the search input
  const [search, setSearch] = useState(searchParams.get("search") || "");

  // debouncedSearch waits 300ms after the user stops typing before updating
  // This prevents a new API request on every single keystroke
  const [debouncedSearch] = useDebounce(search, 300);

  //useVenues fetches the venues from the API via Tanstack query
  const {
    data: venues,
    isLoading,
    isError,
  } = useVenues(debouncedSearch || undefined);

  return (
    <div className="">
      <div className="">
        <h1 className="">
          {" "}
          {search ? `Results for "${search}"` : "All Venues"}
        </h1>
        {/* */}
        {venues && (
          <p className="text-gray-500">
            {venues.length} {venues.length === 1 ? "venue" : "venues"}
          </p>
        )}
      </div>

      {/* search input */}
      {/* onChange updates search state as the user types, tanstack will automatically refetch when search changes */}
      <div className="mb-10 max-w-lg">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search venues..."
          className=""
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* an array of 8 numbers and looping over them */}
          {/* for each number rendering, one placeholder card */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <Skeleton className="h-52 w-full" />
              <div className="p-4">
                {/* Skeleton text placeholders */}
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="mb-4 h-3 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div>
          <p>Something went wrong. Please try again.</p>
        </div>
      )}

      {/*show this when venues have loaded but none match the search query */}
      {!isLoading && !isError && venues?.length === 0 && (
        <div>
          <p>{`No venues found for "${search}"`}</p>

          <button onClick={() => setSearch("")} className="">
            Clear search
          </button>
        </div>
      )}

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
