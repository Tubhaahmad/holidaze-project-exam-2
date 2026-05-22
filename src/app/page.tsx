"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useVenues } from "@/hooks/useVenues";
import VenueCard from "@/components/venues/VenueCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { data: venues, isLoading } = useVenues();
  const featuredVenues = venues?.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* ── Hero section ── */}
      <section className="-mt-20 relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="https://www.pexels.com/download/video/4782135/"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl">
            Find Your Next
            <br />
            Destination
          </h1>
          <p className="mb-10 max-w-lg text-lg text-white/70">
            Discover unique venues and book your next adventure with Holidaze
          </p>

          {/* Search bar */}
          <div className="w-full max-w-2xl rounded-2xl bg-white p-3 shadow-2xl">
            <form action="/venues" method="get" className="flex w-full gap-2">
              <input
                type="text"
                name="search"
                placeholder="Search destinations..."
                className="flex-1 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              <Button
                type="submit"
                size="lg"
                className="rounded-xl bg-coral hover:bg-coral-hover text-white px-8"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Featured venues ── */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Popular venues</h2>
            <Link href="/venues">
              <Button variant="outline" className="rounded-full">
                View all
              </Button>
            </Link>
          </div>

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-gray-100"
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

          {/* Venues grid */}
          {!isLoading && featuredVenues && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredVenues.map((venue) => (
                <VenueCard key={venue.id} {...venue} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
