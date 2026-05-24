"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/store";
import { useCustomerBookings } from "@/hooks/useCustomerBookings";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import AvatarUpdateForm from "@/features/profile/AvatarUpdateForm";

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { data: bookings, isLoading, isError } = useCustomerBookings();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  // Don't render anything while redirecting
  if (!isLoggedIn || !user) return null;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      {/* ── Page title ── */}
      <h1 className="mb-8 text-3xl font-bold text-gray-900">My Profile</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Profile card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            {/* Avatar */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar?.url || "https://placehold.co/96x96?text=?"}
              alt={user.name}
              className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-gray-100"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/96x96?text=?";
              }}
            />
            <h2 className="mb-1 text-xl font-bold text-gray-900">
              {user.name}
            </h2>
            <p className="mb-4 text-sm text-gray-400">{user.email}</p>

            {/* Role badge */}
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                user.venueManager
                  ? "bg-coral/10 text-coral"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {user.venueManager ? "Venue Manager" : "Customer"}
            </span>

            {/* Manager dashboard link */}
            {user.venueManager && (
              <div className="mt-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full rounded-full">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Avatar update form */}
          <AvatarUpdateForm />

          {/* Stats card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total bookings</span>
                <span className="font-semibold text-gray-900">
                  {bookings?.length ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Upcoming</span>
                <span className="font-semibold text-coral">
                  {bookings?.filter((b) => new Date(b.dateFrom) > new Date())
                    .length ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column — bookings ── */}
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Upcoming Bookings
          </h2>

          {/* Loading state — show 3 skeleton cards */}
          {isLoading && (
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
                >
                  <Skeleton className="h-24 w-24 shrink-0 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-5 w-1/2" />
                    <Skeleton className="mb-2 h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && (
            <p className="text-gray-400">
              Something went wrong loading your bookings.
            </p>
          )}

          {/* Empty state */}
          {!isLoading && !isError && bookings?.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-16 text-center">
              <p className="mb-4 text-gray-400">
                You have no upcoming bookings yet.
              </p>
              <Link href="/venues">
                <Button className="rounded-full bg-coral hover:bg-coral-hover text-white">
                  Browse venues
                </Button>
              </Link>
            </div>
          )}

          {/* Bookings list */}
          {!isLoading && !isError && bookings && bookings.length > 0 && (
            <div className="flex flex-col gap-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-md sm:flex-row"
                >
                  {/* Venue thumbnail */}
                  {booking.venue && (
                    <div className="shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          booking.venue.media?.[0]?.url ||
                          "https://placehold.co/96x96?text=?"
                        }
                        alt={booking.venue.name}
                        className="h-24 w-full rounded-lg object-cover sm:w-24"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://placehold.co/96x96?text=?";
                        }}
                      />
                    </div>
                  )}

                  {/* Booking details */}
                  <div className="flex-1">
                    {/* Venue name links to venue detail page */}
                    {booking.venue && (
                      <Link href={`/venues/${booking.venue.id}`}>
                        <h3 className="mb-2 font-semibold text-gray-900 hover:text-coral transition">
                          {booking.venue.name}
                        </h3>
                      </Link>
                    )}

                    <div className="space-y-1 text-sm text-gray-500">
                      <p>
                        <span className="font-medium text-gray-700">
                          Check-in:
                        </span>{" "}
                        {new Date(booking.dateFrom).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">
                          Check-out:
                        </span>{" "}
                        {new Date(booking.dateTo).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700">
                          Guests:
                        </span>{" "}
                        {booking.guests}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
