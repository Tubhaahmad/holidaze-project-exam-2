"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useVenues } from "@/hooks/useVenues";
import VenueCard from "@/components/venues/VenueCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Wifi, Car, Coffee, PawPrint } from "lucide-react";
import { useState, useMemo } from "react";

// category definitions based on amenities
const categories = [
  { label: "All", key: "all", icon: null },
  { label: "Pet Friendly", key: "pets", icon: PawPrint },
  { label: "Breakfast", key: "breakfast", icon: Coffee },
  { label: "Free Parking", key: "parking", icon: Car },
  { label: "WiFi", key: "wifi", icon: Wifi },
];

export default function HomePage() {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  // fetch venues for the featured section
  const { data, isLoading } = useVenues();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allVenues = data?.venues ?? [];

  // filter venues based on active category
  const filteredVenues = useMemo(() => {
    if (activeCategories.length === 0) return allVenues.slice(0, 6);
    return allVenues
      .filter((v) =>
        activeCategories.every((cat) => v.meta[cat as keyof typeof v.meta]),
      )
      .slice(0, 6);
  }, [allVenues, activeCategories]);
  // count venues per category
  function getCategoryCount(key: string) {
    return allVenues.filter((v) => v.meta[key as keyof typeof v.meta]).length;
  }
  return (
    <div className="flex flex-col">
      {/* hero section */}
      <section className="-mt-20 relative min-h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="https://www.pexels.com/download/video/30093012/"
            type="video/mp4"
          />
        </video>

        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* hero content */}
        <div className="relative z-10 flex h-full min-h-screen flex-col items-center justify-between px-6 pt-40 pb-0 md:px-20">
          {/* headline and search */}
          <div className="flex flex-col items-center text-center max-w-3xl">
            <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-7xl">
              Find Your Next
              <br />
              Destination
            </h1>
            <p className="mb-8 text-base md:text-lg text-white/70 max-w-md">
              Discover unique venues and book your next adventure with Holidaze
            </p>

            {/* search bar */}
            <form
              action="/venues"
              method="get"
              className="mb-8 flex w-full max-w-xl items-center overflow-hidden rounded-full bg-white shadow-2xl"
            >
              <input
                type="text"
                name="search"
                placeholder="Search destinations..."
                className="min-w-0 flex-1 py-4 pl-6 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              {/* coral circle search button */}
              <button
                type="submit"
                aria-label="Search"
                className="m-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral text-white transition hover:bg-coral-hover"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* floating category card at the bottom of the hero */}
          <div className="w-full max-w-7xl self-center rounded-t-2xl bg-white px-4 pt-6 pb-0 shadow-2xl md:px-8 overflow-x-auto">
            <div className="mb-4">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 md:text-2xl">
                    Great stays for your next trip
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Browse our most loved stays
                  </p>
                </div>
              </div>
            </div>

            {/* category tabs */}
            <div className="flex flex-wrap gap-3 pb-6">
              {categories
                .filter((c) => c.key !== "all")
                .map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategories.includes(cat.key);
                  const count = getCategoryCount(cat.key);
                  return (
                    <button
                      key={cat.key}
                      onClick={() =>
                        setActiveCategories((prev) =>
                          prev.includes(cat.key)
                            ? prev.filter((c) => c !== cat.key)
                            : [...prev, cat.key],
                        )
                      }
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "border-coral bg-coral text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-coral hover:text-coral"
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {cat.label}
                      <span
                        className={`text-xs ${isActive ? "text-white/70" : "text-gray-400"}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}

              {/* clear button — only shown when filters are active */}
              {activeCategories.length > 0 && (
                <button
                  onClick={() => setActiveCategories([])}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:text-coral transition"
                >
                  Clear
                </button>
              )}

              {/* view all — at the end of the chips row */}
              <Link href="/venues">
                <button className="rounded-full border border-coral px-4 py-2 text-sm font-medium text-coral transition hover:bg-coral hover:text-white">
                  View all →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* venues grid — continues below the hero */}
      <section className="bg-white py-8">
        <div className="mx-auto w-full max-w-7xl px-6">
          {/* loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-gray-200"
                >
                  <Skeleton className="h-52 w-full" />
                  <div className="p-4">
                    <Skeleton className="mb-2 h-4 w-3/4" />
                    <Skeleton className="mb-4 h-3 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* empty state */}
          {!isLoading && filteredVenues.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-500">No venues found in this category.</p>
            </div>
          )}

          {/* venues grid */}
          {!isLoading && filteredVenues.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVenues.map((venue) => (
                <VenueCard key={venue.id} {...venue} />
              ))}
            </div>
          )}

          {/* see more button */}
          {!isLoading && filteredVenues.length > 0 && (
            <div className="mt-10 text-center">
              <Link
                href={
                  activeCategories.length === 0
                    ? "/venues"
                    : `/venues?filter=${activeCategories.join(",")}`
                }
              >
                <Button variant="outline" className="rounded-full px-8">
                  See more{" "}
                  {activeCategories.length === 0 ? "venues" : "filtered venues"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
