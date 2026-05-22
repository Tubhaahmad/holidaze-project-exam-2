//this page shows all bookings for a specific venue.
//only the venue manager who owns the venue can access this page.
//it shows each booking with customer info, dates, and guest count.

"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/store";
import { useQuery } from "@tanstack/react-query";
import { getVenueBookings } from "@/lib/api/venue";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, Calendar } from "lucide-react";

export default function VenueBookingsPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { isLoggedIn, user } = useAuth();

  //redirect non-managers away
  useEffect(() => {
    if (!isLoggedIn || !user?.venueManager) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, user, router]);

  //then fetch the venue with all its bookings and customer info
  const {
    data: venue,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["venue-bookings", id],
    queryFn: () => getVenueBookings(id),
    enabled: !!id,
  });

  if (!isLoggedIn || !user?.venueManager) return null;

  //loading state
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <Skeleton className="mb-4 h-10 w-1/2" />
        <Skeleton className="mb-8 h-4 w-1/3" />
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  //error state
  if (isError || !venue) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-12 text-center">
        <p className="text-gray-500">Could not load bookings.</p>
      </div>
    );
  }

  const bookings = venue.bookings ?? [];

  // Sort bookings by dateFrom — nearest check-in first
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime(),
  );

  // Calculate stats
  const totalRevenue = sortedBookings.reduce((sum, booking) => {
    const nights = Math.round(
      (new Date(booking.dateTo).getTime() -
        new Date(booking.dateFrom).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return sum + nights * venue.price;
  }, 0);

  const totalGuests = sortedBookings.reduce(
    (sum, booking) => sum + booking.guests,
    0,
  );

  // Helper function to get booking status
  function getBookingStatus(dateFrom: string, dateTo: string) {
    const now = new Date();
    const start = new Date(dateFrom);
    const end = new Date(dateTo);

    if (now < start) return "upcoming";
    if (now > end) return "past";
    return "active";
  }

  // Helper to calculate nights between two dates
  function getNights(dateFrom: string, dateTo: string) {
    return Math.round(
      (new Date(dateTo).getTime() - new Date(dateFrom).getTime()) /
        (1000 * 60 * 60 * 24),
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      {/* Page header */}
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={venue.media?.[0]?.url || "https://placehold.co/80x80?text=?"}
            alt={venue.name}
            className="h-16 w-16 rounded-xl object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/80x80?text=?";
            }}
          />
          <div>
            <h1 className="mb-1 text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-500">{venue.name}</p>
            <p className="text-sm text-gray-500">${venue.price} / night</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/venues/${id}/edit`}>
            <Button variant="outline" size="sm">
              Edit venue
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Back to dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {sortedBookings.length}
          </p>
          <p className="text-sm text-gray-500">Total bookings</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">${totalRevenue}</p>
          <p className="text-sm text-gray-500">Total revenue</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{totalGuests}</p>
          <p className="text-sm text-gray-500">Total guests</p>
        </div>
      </div>

      {/* Empty state */}
      {sortedBookings.length === 0 && (
        <div className="rounded-xl border border-gray-200 p-16 text-center">
          <p className="mb-2 text-lg font-semibold text-gray-900">
            No bookings yet
          </p>
          <p className="text-gray-500">
            Bookings will appear here when customers reserve this venue.
          </p>
        </div>
      )}

      {/* Bookings list */}
      {sortedBookings.length > 0 && (
        <div className="flex flex-col gap-4">
          {sortedBookings.map((booking) => {
            const status = getBookingStatus(booking.dateFrom, booking.dateTo);
            const nights = getNights(booking.dateFrom, booking.dateTo);

            return (
              <div
                key={booking.id}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Customer info */}
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        booking.customer?.avatar?.url ||
                        "https://placehold.co/40x40?text=?"
                      }
                      alt={booking.customer?.name || "Customer"}
                      className="h-10 w-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/40x40?text=?";
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.customer?.name || "Unknown customer"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.customer?.email}
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      status === "upcoming"
                        ? "bg-blue-100 text-blue-700"
                        : status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {status === "upcoming"
                      ? "Upcoming"
                      : status === "active"
                        ? "Active"
                        : "Past"}
                  </span>
                </div>

                {/* Booking details */}
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(booking.dateFrom).toLocaleDateString()} →{" "}
                      {new Date(booking.dateTo).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {booking.guests}{" "}
                      {booking.guests === 1 ? "guest" : "guests"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>
                      {nights} {nights === 1 ? "night" : "nights"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">
                      ${nights * venue.price} revenue
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
