"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useVenue } from "@/hooks/useVenue";
import { useAuth } from "@/features/auth/store";
import { MapPin, Star, Users, Wifi, Car, Coffee, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BookingCalendar from "@/features/bookings/BookingCalendar";

export default function VenueDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: venue, isLoading, isError } = useVenue(id);
  const { isLoggedIn, user } = useAuth();

  //Update the page title dynamically when venue data loads
  useEffect(() => {
    if (venue) {
      document.title = `${venue.name} | Holidaze`;
    }
  }, [venue]);

  //loading state
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <Skeleton className="mb-4 h-96 w-full rounded-xl" />
        <Skeleton className="mb-2 h-8 w-1/2" />
        <Skeleton className="mb-6 h-4 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  //error state

  if (isError || !venue) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Venue not found
        </h1>
        <p className="mb-8 text-gray-500">
          This venue does not exist or has been removed.
        </p>
        <Link href="/venues">
          <Button variant="outline">Browse all venues</Button>
        </Link>
      </div>
    );
  }

  const locationString = [
    venue.location?.address,
    venue.location?.city,
    venue.location?.zip,
    venue.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const isOwner = user?.name === venue.owner?.name;
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      {/* Image carousel */}
      {venue.media && venue.media.length > 0 ? (
        <Carousel className="relative mb-8 w-full">
          <CarouselContent>
            {venue.media.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-96 w-full overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt || venue.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (
                        target.src !==
                        "https://placehold.co/800x400?text=No+Image"
                      ) {
                        target.src =
                          "https://placehold.co/800x400?text=No+Image";
                      }
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-3 flex justify-center gap-2">
            {venue.media.map((_, index) => (
              <div key={index} className="h-2 w-2 rounded-full bg-gray-300" />
            ))}
          </div>
          {venue.media.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      ) : (
        // No images fallback
        <div className="mb-8 flex h-96 w-full items-center justify-center rounded-xl bg-gray-100">
          <p className="text-gray-400">No images available</p>
        </div>
      )}

      {/* page content here */}

      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{venue.name}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {locationString && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{locationString}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{venue.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Up to {venue.maxGuests} guests</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              About this venue
            </h2>
            <p className="leading-relaxed text-gray-600">{venue.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Amenities
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Each amenity only shows if it's available */}
              {venue.meta.wifi && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Wifi className="h-5 w-5" />
                  <span>WiFi</span>
                </div>
              )}
              {venue.meta.parking && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Car className="h-5 w-5" />
                  <span>Parking</span>
                </div>
              )}
              {venue.meta.breakfast && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Coffee className="h-5 w-5" />
                  <span>Breakfast</span>
                </div>
              )}
              {venue.meta.pets && (
                <div className="flex items-center gap-2 text-gray-600">
                  <PawPrint className="h-5 w-5" />
                  <span>Pets allowed</span>
                </div>
              )}
              {/* Show message if no amenities are available */}
              {!venue.meta.wifi &&
                !venue.meta.parking &&
                !venue.meta.breakfast &&
                !venue.meta.pets && (
                  <p className="text-gray-400">No amenities listed</p>
                )}
            </div>
          </div>

          {venue.owner && (
            <div className="mb-8">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                Hosted by
              </h2>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    venue.owner.avatar?.url ||
                    "https://placehold.co/48x48?text=?"
                  }
                  alt={venue.owner.name}
                  className="h-12 w-12 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/48x48?text=?";
                  }}
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {venue.owner.name}
                  </p>
                  <p className="text-sm text-gray-500">{venue.owner.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-6 rounded-xl border border-gray-200 p-6">
            {/* Price */}
            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-900">
                ${venue.price}
              </span>
              <span className="text-gray-500"> / night</span>
            </div>

            {/* Booking calendar, shown to all  */}
            <BookingCalendar
              venueId={venue.id}
              maxGuests={venue.maxGuests}
              bookings={venue.bookings ?? []}
              venueName={venue.name}
              price={venue.price}
            />

            {!isLoggedIn && (
              <div className="mt-4 text-center">
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Log in to book
                  </Button>
                </Link>
              </div>
            )}

            {/* Show message if owner */}
            {isLoggedIn && isOwner && (
              <p className="mt-4 text-center text-sm text-gray-500">
                You cannot book your own venue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
