"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/store";
import { updateVenue, deleteVenue } from "@/lib/api/venue";
import { useVenue } from "@/hooks/useVenue";
import { Button } from "@/components/ui/button";

//zod schema, same rules as the create venue form

const venueSchema = z.object({
  // must be a string with at least 1 character
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),

  // must be a number AND greater than 0
  // invalid_type_error shows when the field is empty
  // positive() shows when the number is 0 or negative
  price: z
    .number({ invalid_type_error: "Price is required" })
    .positive("Price must be greater than 0"),

  // must be a number, a whole number, and greater than 0
  // .int() means no 2.5 guests allowed, only 1, 2, 3 etc.
  maxGuests: z
    .number({ invalid_type_error: "Max guests is required" })
    .int()
    .positive("Must be greater than 0"),

  // must be an array of strings
  // each string must either be a valid URL OR an empty string ""
  // .or(z.literal("")) allows empty inputs (not all 8 images are required)
  // .max(8) means maximum 8 images
  images: z
    .array(z.string().url("Must be a valid URL").or(z.literal("")))
    .max(8),

  // must be true or false (checkboxes)
  wifi: z.boolean(),
  parking: z.boolean(),
  breakfast: z.boolean(),
  pets: z.boolean(),

  // .optional() means the field can be left empty
  // these are location fields, not required
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  continent: z.string().optional(),
});

type VenueFormData = z.infer<typeof venueSchema>;

// page component

export default function EditVenuePage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { isLoggedIn, user } = useAuth();
  const queryClient = useQueryClient();

  // fetch the existing venue so we can pre-fill the form
  const { data: venue, isLoading } = useVenue(id);

  // redirect non-managers away
  useEffect(() => {
    if (!isLoggedIn || !user?.venueManager) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, user, router]);

  const {
    register, // connects an input to the form
    handleSubmit, // wraps your onSubmit function and runs validation first
    watch, // lets you read the current value of a field in real time
    reset, // lets you fill all fields with new values at once (used to pre fill with existing venue data)
    formState: { errors },
    //creates the form
  } = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      images: ["", "", "", "", "", "", "", ""],
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
  });

  // once venue data loads, pre-fill the form with existing values
  useEffect(() => {
    if (venue) {
      const images = [
        ...venue.media.map((m) => m.url),
        ...Array(8 - venue.media.length).fill(""),
      ].slice(0, 8);

      reset({
        name: venue.name,
        description: venue.description,
        price: venue.price,
        maxGuests: venue.maxGuests,
        images,
        wifi: venue.meta.wifi,
        parking: venue.meta.parking,
        breakfast: venue.meta.breakfast,
        pets: venue.meta.pets,
        address: venue.location?.address ?? "",
        city: venue.location?.city ?? "",
        country: venue.location?.country ?? "",
        continent: venue.location?.continent ?? "",
      });
    }
  }, [venue, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const imageValues = watch("images");

  // update venue mutation
  const { mutate: submitUpdate, isPending: isUpdating } = useMutation({
    mutationFn: (data: VenueFormData) =>
      updateVenue(id, {
        name: data.name,
        description: data.description,
        price: data.price,
        maxGuests: data.maxGuests,
        media: data.images
          .filter((url) => url.trim() !== "")
          .map((url) => ({ url, alt: data.name })),
        meta: {
          wifi: data.wifi,
          parking: data.parking,
          breakfast: data.breakfast,
          pets: data.pets,
        },
        location: {
          address: data.address,
          city: data.city,
          country: data.country,
          continent: data.continent,
        },
      }),
    onSuccess: () => {
      toast.success("Venue updated!");
      queryClient.invalidateQueries({ queryKey: ["manager-venues"] });
      queryClient.invalidateQueries({ queryKey: ["venue", id] });
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    },
  });

  // delete venue mutation
  const { mutate: submitDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteVenue(id),
    onSuccess: () => {
      toast.success("Venue deleted!");
      queryClient.invalidateQueries({ queryKey: ["manager-venues"] });
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    },
  });

  // ask for confirmation before deleting
  function handleDelete() {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      submitDelete();
    }
  }

  if (!isLoggedIn || !user?.venueManager) return null;

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-12">
        <p className="text-gray-500">Loading venue...</p>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-12">
        <p className="text-gray-500">Venue not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto w-full max-w-2xl px-6">
        <div className="mb-8">
          <p className="mb-1 text-sm font-medium text-coral">
            Manager Dashboard
          </p>
          <h1 className="mb-1 text-3xl font-bold text-gray-900">Edit venue</h1>
          <p className="text-gray-500">{venue.name}</p>
        </div>

        <form
          onSubmit={handleSubmit((data) => submitUpdate(data))}
          className="flex flex-col gap-6"
        >
          {/* basic info */}
          <div
            className="rounded-2xl bg-white p-6 flex flex-col gap-4"
            style={{ boxShadow: "0 0 30px 0 rgba(0,0,0,0.08)" }}
          >
            <h2 className="text-lg font-semibold text-gray-900">Basic info</h2>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                {...register("name")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coral"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coral"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Price per night ($)
                </label>
                <input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  min={1}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coral"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Max guests
                </label>
                <input
                  {...register("maxGuests", { valueAsNumber: true })}
                  type="number"
                  min={1}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coral"
                />
                {errors.maxGuests && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.maxGuests.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* images */}
          <div
            className="rounded-2xl bg-white p-6 flex flex-col gap-4"
            style={{ boxShadow: "0 0 30px 0 rgba(0,0,0,0.08)" }}
          >
            <h2 className="text-lg font-semibold text-gray-900">Images</h2>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <div key={index} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    imageValues?.[index] || "https://placehold.co/48x48?text=?"
                  }
                  alt={`Preview ${index + 1}`}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/48x48?text=?";
                  }}
                />
                <input
                  {...register(`images.${index}`)}
                  placeholder={`Image URL ${index + 1}`}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coral"
                />
              </div>
            ))}
          </div>

          {/* amenities */}
          <div
            className="rounded-2xl bg-white p-6 flex flex-col gap-4"
            style={{ boxShadow: "0 0 30px 0 rgba(0,0,0,0.08)" }}
          >
            <h2 className="text-lg font-semibold text-gray-900">Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "wifi", label: "WiFi" },
                { name: "parking", label: "Parking" },
                { name: "breakfast", label: "Breakfast" },
                { name: "pets", label: "Pets allowed" },
              ].map((amenity) => (
                <label
                  key={amenity.name}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    {...register(
                      amenity.name as "wifi" | "parking" | "breakfast" | "pets",
                    )}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* location */}
          <div
            className="rounded-2xl bg-white p-6 flex flex-col gap-4"
            style={{ boxShadow: "0 0 30px 0 rgba(0,0,0,0.08)" }}
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Location{" "}
              <span className="text-sm font-normal text-gray-500">
                (optional)
              </span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "address", label: "Address" },
                { name: "city", label: "City" },
                { name: "country", label: "Country" },
                { name: "continent", label: "Continent" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    {...register(
                      field.name as
                        | "address"
                        | "city"
                        | "country"
                        | "continent",
                    )}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coral"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* action buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-coral hover:bg-coral-hover text-white"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save changes"}
            </Button>
          </div>

          {/* delete venue, at the bottom to avoid accidental clicks */}
          <div className="border-t border-gray-100 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete venue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
