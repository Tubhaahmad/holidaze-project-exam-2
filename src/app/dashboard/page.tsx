"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/store";
import { useManagerVenues } from "@/hooks/useManagerVenues";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star, Users, Calendar, Plus } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { data: venues, isLoading, isError } = useManagerVenues();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else if (!user?.venueManager) {
      router.push("/profile");
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || !user?.venueManager) return null;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      {/* page header */}
      <div className="mb-10">
        <p className="mb-1 text-sm font-medium text-coral">Manager Dashboard</p>
        <h1 className="mb-1 text-3xl font-bold text-gray-900">My Venues</h1>
        <p className="mb-4 text-gray-400">
          Manage your venues and view bookings
        </p>
        <Link href="/dashboard/venues/new">
          <Button className="flex items-center gap-2 rounded-full bg-coral hover:bg-coral-hover text-white">
            <Plus className="h-4 w-4" />
            Create venue
          </Button>
        </Link>
      </div>

      {/* stats row */}
      {!isLoading && venues && venues.length > 0 && (
        <div className="mb-10 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{venues.length}</p>
            <p className="text-sm text-gray-400">Total venues</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {venues.reduce((sum, v) => sum + (v.bookings?.length ?? 0), 0)}
            </p>
            <p className="text-sm text-gray-400">Total bookings</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-coral">
              $
              {(venues.reduce((sum, v) => sum + v.price, 0) / venues.length) |
                0}
            </p>
            <p className="text-sm text-gray-400">Avg. price / night</p>
          </div>
        </div>
      )}

      {/* loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="mb-2 h-5 w-3/4" />
                <Skeleton className="mb-4 h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* error state */}
      {isError && (
        <p className="text-gray-400">
          Something went wrong loading your venues.
        </p>
      )}

      {/* empty state */}
      {!isLoading && !isError && venues?.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-coral/10">
            <Plus className="h-6 w-6 text-coral" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            No venues yet
          </h2>
          <p className="mb-6 text-gray-400">
            Create your first venue to start accepting bookings.
          </p>
          <Link href="/dashboard/venues/new">
            <Button className="rounded-full bg-coral hover:bg-coral-hover text-white">
              Create your first venue
            </Button>
          </Link>
        </div>
      )}

      {/* venues grid */}
      {!isLoading && !isError && venues && venues.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
            >
              {/* img clicking goes to venue detail page */}
              <Link href={`/venues/${venue.id}`}>
                <div className="relative h-48 w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      venue.media?.[0]?.url ||
                      "https://placehold.co/400x200?text=No+Image"
                    }
                    alt={venue.media?.[0]?.alt || venue.name}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/400x200?text=No+Image";
                    }}
                  />
                </div>
              </Link>

              {/* venue details */}
              <div className="p-4">
                <Link href={`/venues/${venue.id}`}>
                  <h3 className="mb-1 truncate font-semibold text-gray-900 hover:text-coral transition">
                    {venue.name}
                  </h3>
                </Link>

                {/* stats row */}
                <div className="mb-3 flex flex-wrap gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{venue.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{venue.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {/* show total booking count */}
                    <span>{venue.bookings?.length ?? 0} bookings</span>
                  </div>
                </div>

                {/* price */}
                <p className="mb-4 text-sm font-semibold text-gray-900">
                  <span className="text-coral">${venue.price}</span>
                  <span className="font-normal text-gray-400"> / night</span>
                </p>

                {/* action buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/venues/${venue.id}/edit`}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-full"
                      size="sm"
                    >
                      Edit
                    </Button>
                  </Link>
                  <Link
                    href={`/dashboard/venues/${venue.id}/bookings`}
                    className="flex-1"
                  >
                    <Button
                      className="w-full rounded-full bg-coral hover:bg-coral-hover text-white"
                      size="sm"
                    >
                      Bookings
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
