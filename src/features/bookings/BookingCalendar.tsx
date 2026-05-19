"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { eachDayOfInterval, isBefore, parseISO, startOfDay } from "date-fns";
import { useAuth } from "@/features/auth/store";
import { useRouter } from "next/navigation";

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
}

//booking compontent
export default function BookingCalendar({
  venueId,
  maxGuests,
  bookings,
}: BookingCalendarProps) {
  const { isLoggedIn } = useAuth();

  const getToken = () => {
    try {
      const stored = localStorage.getItem("holidaze-auth");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed?.state?.accessToken ?? null;
    } catch {
      return null;
    }
  };

  const router = useRouter();

  // checkIn and checkOut track the dates the user has selected
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();

  //guests tracks how many guests the user wants to bring
  const [guests, setGuests] = useState(1);

  //isSubmitting tracks whether the booking request is in progress
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleBooking() {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/holidaze/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // The booking endpoint requires authentication
            Authorization: `Bearer ${getToken()}`,
            "X-Noroff-API-Key": process.env.NEXT_PUBLIC_NOROFF_API_KEY!,
          },
          body: JSON.stringify({
            dateFrom: checkIn.toISOString(),
            dateTo: checkOut.toISOString(),
            guests,
            venueId,
          }),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.errors?.[0]?.message ?? "Booking failed");
      }

      toast.success("Booking confirmed!");

      //reset the selected dates after a successful booking
      setCheckIn(undefined);
      setCheckOut(undefined);

      //redirect to profile to see upcoming bookings
      router.push("/profile");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Book Now button */}
      {isLoggedIn ? (
        <Button
          className="mt-4 w-full"
          onClick={handleBooking}
          disabled={!checkIn || !checkOut || isSubmitting}
        >
          {isSubmitting ? "Booking..." : "Book Now"}
        </Button>
      ) : (
        //show this if the user is not logged in
        <p className="mt-4 text-center text-sm text-gray-500">
          Please log in to book this venue
        </p>
      )}
    </div>
  );
}
