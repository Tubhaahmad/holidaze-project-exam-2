"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/store";
import { createVenue } from "@/lib/api/venue";
import { Button } from "@/components/ui/button";

// zod schema

const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .positive("Price must be greater than 0"),
  maxGuests: z
    .number({ invalid_type_error: "Max guests is required" })
    .int()
    .positive("Max guests must be greater than 0"),

  // up to 8 image URLs, each is optional but must be a valid URL if provided
  images: z
    .array(z.string().url("Please enter a valid URL").or(z.literal("")))
    .max(8),

  // amenities, all default to false
  wifi: z.boolean(),
  parking: z.boolean(),
  breakfast: z.boolean(),
  pets: z.boolean(),

  // location, all optional
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  continent: z.string().optional(),
});

type VenueFormData = z.infer<typeof venueSchema>;

// component
export default function CreateVenuePage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const queryClient = useQueryClient();

  // redirect if not a venue manager
  useEffect(() => {
    if (!isLoggedIn || !user?.venueManager) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, user, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
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

  // watch image URLs for live preview
  // eslint-disable-next-line react-hooks/incompatible-library
  const imageValues = watch("images");

  // useMutation handles the POST request to create the venue
  const { mutate: submitVenue, isPending } = useMutation({
    mutationFn: (data: VenueFormData) => {
      // Filter out empty image URLs before sending to API
      const media = data.images
        .filter((url) => url.trim() !== "")
        .map((url) => ({ url, alt: data.name }));

      return createVenue({
        name: data.name,
        description: data.description,
        price: data.price,
        maxGuests: data.maxGuests,
        media,
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
      });
    },
    onSuccess: () => {
      toast.success("Venue created successfully!");
      // unvalidate the manager venues cache so the dashboard updates
      queryClient.invalidateQueries({ queryKey: ["manager-venues"] });
      router.push("/dashboard");
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    },
  });

  function onSubmit(data: VenueFormData) {
    submitVenue(data);
  }

  if (!isLoggedIn || !user?.venueManager) return null;

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto w-full max-w-2xl px-6">
        {/* page header */}
        <div className="mb-8">
          <p className="mb-1 text-sm font-medium text-coral">
            Manager Dashboard
          </p>
          <h1 className="mb-1 text-3xl font-bold text-gray-900">
            Create venue
          </h1>
          <p className="text-gray-500">
            Fill in the details for your new venue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* basic info */}
          <div
            className="rounded-2xl bg-white p-6 flex flex-col gap-4"
            style={{ boxShadow: "0 0 30px 0 rgba(0,0,0,0.08)" }}
          >
            <h2 className="text-lg font-semibold text-gray-900">Basic info</h2>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Venue name
              </label>
              <input
                {...register("name")}
                placeholder="e.g. Cozy Cabin in the Woods"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
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
                placeholder="Describe your venue..."
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
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
                  placeholder="e.g. 150"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
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
                  placeholder="e.g. 4"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
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
            <p className="text-sm text-gray-500">
              Add up to 8 image URLs. A preview will appear when a valid URL is
              entered.
            </p>

            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <div key={index} className="flex items-center gap-3">
                {/* live preview thumbnail */}
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
                  type="text"
                  placeholder={`Image URL ${index + 1}`}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
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
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  {...register("address")}
                  placeholder="e.g. 123 Main St"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  {...register("city")}
                  placeholder="e.g. Oslo"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  {...register("country")}
                  placeholder="e.g. Norway"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Continent
                </label>
                <input
                  {...register("continent")}
                  placeholder="e.g. Europe"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
                />
              </div>
            </div>
          </div>

          {/* submit */}
          <Button
            type="submit"
            className="w-full rounded-full bg-coral hover:bg-coral-hover text-white"
            disabled={isPending}
          >
            {isPending ? "Creating venue..." : "Create venue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
