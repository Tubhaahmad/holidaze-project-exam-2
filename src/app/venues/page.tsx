"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import VenueCard from "@/components/venues/VenueCard";
import { useVenues, useAllVenues } from "@/hooks/useVenues";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "use-debounce";
import { Search, Wifi, Car, Coffee, PawPrint } from "lucide-react";

// filter chip options
const filters = [
  { label: "WiFi", key: "wifi", icon: Wifi },
  { label: "Parking", key: "parking", icon: Car },
  { label: "Breakfast", key: "breakfast", icon: Coffee },
  { label: "Pets", key: "pets", icon: PawPrint },
];

// sort options
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating", value: "rating" },
];

// how many venues to show per page
const VENUES_PER_PAGE = 12;

function VenuesPage() {
  const searchParams = useSearchParams();
  // search will track what the user has typed in the search input
  const [search, setSearch] = useState(searchParams.get("search") || "");

  // debouncedSearch waits 300ms after the user stops typing before updating
  // This prevents a new API request on every single keystroke
  const [debouncedSearch] = useDebounce(search, 300);

  // activeFilters tracks which amenity filters are active
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // sort tracks the current sort option
  const [sort, setSort] = useState("newest");

  // page tracks the current pagination page
  const [page, setPage] = useState(1);

  // when filters or sort are active, fetch all venues for accurate filtering
  // otherwise use paginated fetch
  const hasFilters = true;

  const paginatedResult = useVenues(debouncedSearch || undefined, page);
  const allResult = useAllVenues(debouncedSearch || undefined);

  const { data, isLoading, isError } = hasFilters ? allResult : paginatedResult;

  const venues = data?.venues ?? [];
  const pageCount = data?.pageCount ?? 1;

  // Toggle a filter on or off
  function toggleFilter(key: string) {
    setPage(1);
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key],
    );
  }

  // Filter and sort venues client-side
  // useMemo recalculates only when venues, activeFilters or sort changes
  const filteredVenues = useMemo(() => {
    if (!venues) return [];

    let result = [...venues];

    // Apply amenity filters — only show venues that have ALL selected amenities
    if (activeFilters.length > 0) {
      result = result.filter((venue) =>
        activeFilters.every(
          (filter) => venue.meta[filter as keyof typeof venue.meta],
        ),
      );
    }

    // Apply sort
    if (sort === "newest") {
      result.sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
      );
    } else if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [venues, activeFilters, sort]);

  // slice the filtered venues array to only show the current page
  const paginatedFilteredVenues = hasFilters
    ? filteredVenues.slice((page - 1) * VENUES_PER_PAGE, page * VENUES_PER_PAGE)
    : filteredVenues;

  // Math.ceil rounds up: 20 venues/12 per page = 1.67, rounds up to 2 pages
  const totalFilteredPages = hasFilters
    ? Math.ceil(filteredVenues.length / VENUES_PER_PAGE)
    : pageCount;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-gray-900">
          {search ? `Results for "${search}"` : "All Venues"}
        </h1>
        {venues && (
          <p className="text-sm text-gray-500">
            {filteredVenues.length}{" "}
            {filteredVenues.length === 1 ? "venue" : "venues"} found
          </p>
        )}
      </div>

      {/* Search and sort row */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search venues..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
          />
        </div>

        {/* Sort dropdown */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-coral"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilters.includes(filter.key);
          return (
            <button
              key={filter.key}
              onClick={() => toggleFilter(filter.key)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-coral bg-coral text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-coral hover:text-coral"
              }`}
            >
              <Icon className="h-4 w-4" />
              {filter.label}
            </button>
          );
        })}

        {/* Clear filters button, only shown when filters are active */}
        {activeFilters.length > 0 && (
          <button
            onClick={() => setActiveFilters([])}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:text-coral transition"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* An array of 8 numbers, looping over them */}
          {/* For each number rendering one skeleton card */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
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

      {/* Empty state */}
      {!isLoading && !isError && paginatedFilteredVenues.length === 0 && (
        <div className="py-20 text-center">
          <p className="mb-4 text-gray-500">
            {activeFilters.length > 0
              ? "No venues match your filters."
              : `No venues found for "${search}"`}
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveFilters([]);
            }}
            className="text-sm text-coral underline hover:text-coral-hover"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Venue grid */}
      {!isLoading && !isError && paginatedFilteredVenues.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedFilteredVenues.map((venue) => (
            <VenueCard key={venue.id} {...venue} />
          ))}
        </div>
      )}

      {/* Pagination controls, only shown when there are multiple pages */}
      {totalFilteredPages > 1 && !isLoading && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-coral hover:text-coral disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalFilteredPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalFilteredPages, p + 1))}
            disabled={page === totalFilteredPages}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-coral hover:text-coral disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
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
