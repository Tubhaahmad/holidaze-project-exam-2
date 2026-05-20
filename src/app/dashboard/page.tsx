"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/store";
import { useManagerVenues } from "@/hooks/useManagerVenues";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Users, Calendar } from "lucide-react";

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-gray-900">
            My Dashboard
          </h1>
          <p className="text-gray-500">Manage your venues and view bookings</p>
        </div>

        <Link href="/dashboard/venues/new">
          <Button>Create venue</Button>
        </Link>
      </div>

      {/*loading state*/}
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

      {isError && (
        <p className="text-gray-500">
          Something went wrong loading your venues.
        </p>
      )}

      {!isLoading && !isError && venues?.length === 0 && (
        <div className="rounded-xl border border-gray-200 p-16 text-center">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            No venues yet
          </h2>
          <p className="mb-6 text-gray-500">
            Create your first venue to start accepting bookings.
          </p>
          <Link href="/dashboard/venues/new">
            <Button>Create your first venue</Button>
          </Link>
        </div>
      )}

      {/* venues grid*/}
      {!isLoading && !isError && venues && venues.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="relative h-48 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    venue.media?.[0]?.url ||
                    "https://placehold.co/400x200?text=No+Image"
                  }
                  alt={venue.media?.[0]?.alt || venue.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/400x200?text=No+Image";
                  }}
                />
              </div>

              {/*venue details */}
              <div className="p-4">
                <h3 className="mb-1 truncate font-semibold text-gray-900">
                  {venue.name}
                </h3>

                {/*stats row */}
                <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-500">
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
                <p className="mb-4 text-sm font-medium text-gray-900">
                  ${venue.price} / night
                </p>

                {/* action buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/venues/${venue.id}/edit`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Link
                    href={`/dashboard/venues/${venue.id}/bookings`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full" size="sm">
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
