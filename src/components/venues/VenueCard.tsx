import Link from "next/link";
import { MapPin, Star, Users } from "lucide-react";

// this describes the shape of the data this component expects to receive.
// we only include the fields we actually use in this card.
interface VenueCardProps {
  id: string;
  name: string;
  media: { url: string; alt: string }[];
  price: number;
  maxGuests: number;
  rating: number;
  location: {
    city: string | null;
    country: string | null;
  };
}

export default function VenueCard({
  id,
  name,
  media,
  price,
  maxGuests,
  rating,
  location,
}: VenueCardProps) {
  // use the first image in the media array if it exists.
  // if the venue has no images, fall back to a placeholder.
  const image = media?.[0]?.url || "https://placehold.co/600x400?text=No+Image";
  const imageAlt = media?.[0]?.alt || name;

  // .filter(Boolean) removes any null or undefined values from the array
  // so we don't end up with ", Norway" if city is null
  const locationString = [location?.city, location?.country]
    .filter(Boolean)
    .join(", ");

  return (
    // wrapping the entire card in a Link so the whole thing is clickable
    <Link href={`/venues/${id}`}>
      <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md">
        {/* image container */}
        <div className="relative h-48 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={(e) => {
              // if the image fails to load, hide it and show a gray background
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />

          {/* rating badge — floating on top of the image */}
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold text-gray-900">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="p-4">
          {/* venue name - truncate cuts off long names with "..." */}
          <h3 className="mb-1 truncate font-semibold text-gray-900 group-hover:text-coral transition">
            {name}
          </h3>

          {/* location — only render this if we have a location string */}
          {locationString && (
            <div className="mb-3 flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{locationString}</span>
            </div>
          )}

          {/* bottom row: price on the left, guests on the right */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">
              ${price}{" "}
              <span className="text-sm font-normal text-gray-500">/ night</span>
            </span>

            <div className="flex items-center gap-1 text-sm text-gray-500">
              {/* max guests */}
              <Users className="h-3 w-3" />
              <span>{maxGuests} guests</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
