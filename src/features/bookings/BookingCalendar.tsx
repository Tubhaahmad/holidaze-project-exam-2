"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { eachDayOfInterval, isBefore, parseISO, startOfDay } from "date-fns";
import { useAuth } from "@/features/auth/store";
import { useRouter } from "next/navigation";
import { createBooking } from "@/lib/api/bookings";

//types
interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
}

interface BookingCalendarProps {
  venueId: string;
  maxGuests: number;
  bookings: Booking[];
  venueName: string;
  price: number;
}

//booking compontent
export default function BookingCalendar({
  venueId,
  maxGuests,
  bookings,
  venueName,
  price,
}: BookingCalendarProps) {
  const { isLoggedIn } = useAuth();

  const router = useRouter();

  // checkIn and checkOut track the dates the user has selected
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();

  //guests tracks how many guests the user wants to bring
  const [guests, setGuests] = useState(1);

  // calculate number of nights between check-in and check-out
  // must be after useState declarations so checkIn and checkOut exist
  const nights =
    checkIn && checkOut
      ? Math.abs(
          Math.round(
            (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
          ),
        )
      : 0;

  // total price is nights multiplied by price per night
  const totalPrice = nights * price;

  const queryClient = useQueryClient();

  // useMutation handles the booking API call
  // gives us isPending, onSuccess and onError for free
  // much cleaner than managing isSubmitting state manually
  const { mutate: submitBooking, isPending } = useMutation({
    mutationFn: () =>
      createBooking({
        dateFrom: checkIn!.toISOString(),
        dateTo: checkOut!.toISOString(),
        guests,
        venueId,
      }),
    onSuccess: () => {
      toast.success("Booking confirmed!");
      // Invalidate the venue cache so the calendar refetches with updated bookings
      queryClient.invalidateQueries({ queryKey: ["venue", venueId] });
      setCheckIn(undefined);
      setCheckOut(undefined);
      router.push("/profile");
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    },
  });

  function handleBooking() {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (guests < 1 || guests > maxGuests) {
      toast.error(`Guests must be between 1 and ${maxGuests}`);
      return;
    }

    // Call the mutation
    submitBooking();
  }

  // flatMap expands each booking into individual dates and combines them into one flat array
  //[{dateFrom: Jan5, dateTo: Jan7}, {dateFrom: Jan10, dateTo: Jan11}]
  //becomes [Jan5, Jan6, Jan7, Jan10, Jan11]
  // eachDayOfInterval from date-fns does this expansion for us.

  const disabledDates = bookings.flatMap((booking) => {
    const start = parseISO(booking.dateFrom); // convert "05-07-2026" string to a Date object
    const end = parseISO(booking.dateTo); //convert "10-07-2026" string to a Date object

    return eachDayOfInterval({ start, end });
  });

  //handle date selction
  function handleDateSelect(date: Date | undefined) {
    if (!date) return;

    if (!checkIn || (checkIn && checkOut)) {
      // No check-in yet, or both dates already set — start fresh
      setCheckIn(date);
      setCheckOut(undefined);
      return;
    }

    if (isBefore(date, checkIn)) {
      // instead of showing an error, reset and use this date as the new check-in
      setCheckIn(date);
      setCheckOut(undefined);
      return;
    }

    const selectedRange = eachDayOfInterval({ start: checkIn, end: date });

    //check if the selected range overlaps any existing bookings
    const hasOverlap = selectedRange.some((day) =>
      disabledDates.some(
        (disabledDate) =>
          // startOfDay removes the time part so we're comparing dates only
          startOfDay(day).getTime() === startOfDay(disabledDate).getTime(),
      ),
    );

    if (hasOverlap) {
      toast.error("Your selected dates overlap with an existing booking");
      return;
    }

    //if everything is good, set the check-out date
    setCheckOut(date);
  }

  return (
    <div>
      {/* Calendar */}
      <Calendar
        mode="single"
        //pass the selected check-in date to the calendar
        selected={checkIn}
        // call our handler when a date is clicked
        onSelect={handleDateSelect}
        // disable all dates that are already booked
        // also disable all dates in the past
        disabled={[
          ...disabledDates,
          { before: new Date() }, // disables all past dates
        ]}
        //highlight the selected range between check-in and check-out
        modifiers={{
          range:
            checkIn && checkOut
              ? eachDayOfInterval({ start: checkIn, end: checkOut })
              : [],
        }}
        modifiersClassNames={{
          range: "bg-gray-100 rounded-none",
        }}
        className="rounded-lg border border-gray-200"
      />

      {/* Selected dates summary */}
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Check-in:</span>
          <span className="font-medium">
            {checkIn ? checkIn.toLocaleDateString() : "Not selected"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Check-out:</span>
          <span className="font-medium">
            {checkOut ? checkOut.toLocaleDateString() : "Not selected"}
          </span>
        </div>
      </div>

      {/* Booking summary — only shown when both dates are selected */}
      {checkIn && checkOut && (
        <div className="mt-4 rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="mb-3 font-semibold text-gray-900">Booking summary</h3>
          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>Venue</span>
              <span className="font-medium text-gray-900">{venueName}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-in</span>
              <span className="font-medium text-gray-900">
                {checkIn.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Check-out</span>
              <span className="font-medium text-gray-900">
                {checkOut.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Nights</span>
              <span className="font-medium text-gray-900">{nights}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-semibold text-gray-900">${totalPrice}</span>
            </div>
          </div>
        </div>
      )}

      {/* Guest count input */}
      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Guests
        </label>
        <input
          type="number"
          min={1}
          max={maxGuests}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <p className="mt-1 text-xs text-gray-400">Maximum {maxGuests} guests</p>
      </div>

      {/* Book Now button - only shown to logged-in users */}
      {isLoggedIn && (
        <Button
          className="mt-4 w-full"
          onClick={handleBooking}
          disabled={!checkIn || !checkOut || isPending}
        >
          {isPending ? "Booking..." : "Book Now"}
        </Button>
      )}
    </div>
  );
}
