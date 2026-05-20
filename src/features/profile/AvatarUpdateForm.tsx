"use client";

import { useState } from "react";
import { z } from "zod/v3";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateAvatar } from "@/lib/api/profiles";
import { useAuth } from "@/features/auth/store";

//zod schema — validates the input is a valid URL
const avatarSchema = z.string().url("Please enter a valid image URL");

export default function AvatarUpdateForm() {
  const { user, updateUser } = useAuth();

  // url tracks what the user has typed in the input
  const [url, setUrl] = useState(user?.avatar?.url || "");

  //isSubmitting tracks whether the PATCH request is in progress
  const [isSubmitting, setIsSubmitting] = useState(false);

  //error shows the Zod validation error if the URL is invalid
  const [error, setError] = useState<string | null>(null);

  //isValidUrl checks if the current URL passes Zod validation
  //we use this to show/hide the preview image
  const isValidUrl = avatarSchema.safeParse(url).success;

  async function handleSave() {
    // validate the URL with Zod before sending to the API
    const result = avatarSchema.safeParse(url);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (!user?.name) throw new Error("Not logged in");

      //send the PATCH request to the Noroff API
      await updateAvatar(user.name, url);

      //sync the new avatar URL to the Zustand store
      // this updates the navbar avatar immediately without a page refresh
      updateUser({ avatar: { url, alt: user.name } });

      toast.success("Avatar updated successfully!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Update Avatar
      </h2>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Live image preview */}
        <div className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={isValidUrl ? url : "https://placehold.co/80x80?text=?"}
            alt="Avatar preview"
            className="h-20 w-20 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/80x80?text=?";
            }}
          />
        </div>

        {/* URL input and save button */}
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            placeholder="https://example.com/avatar.jpg"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          {/* Zod validation error */}
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

          <Button
            className="mt-3"
            onClick={handleSave}
            disabled={isSubmitting || !url}
          >
            {isSubmitting ? "Saving..." : "Save avatar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
