import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Users } from "lucide-react";

// This describes the shape of the data this component expects to receive.
// We only include the fields we actually use in this card.
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
  // Use the first image in the media array if it exists.
  // If the venue has no images, fall back to a placeholder.
  const image = media?.[0]?.url || "/placeholder.jpg";
  const imageAlt = media?.[0]?.alt || name;

  // .filter(Boolean) removes any null or undefined values from the array
  // so we don't end up with ", Norway" if city is null
  const locationString = [location?.city, location?.country]
    .filter(Boolean)
    .join(", ");

  return (
    // Wrapping the entire card in a Link so the whole thing is clickable
    <Link href={`/venues/${id}`}>
      <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg">
        {/* Image container — relative and fill is how Next.js Image works inside a sized div */}
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          {/* Venue name — truncate cuts off long names with "..." */}
          <h3 className="mb-1 truncate font-semibold text-gray-900">{name}</h3>

          {/* Location — only render this if we have a location string */}
          {locationString && (
            <div className="mb-3 flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{locationString}</span>
            </div>
          )}

          {/* Bottom row: price on the left, rating and guests on the right */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">
              ${price}{" "}
              <span className="text-sm font-normal text-gray-500">/ night</span>
            </span>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              {/* Star rating */}
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {/* toFixed(1) formats the number to 1 decimal place e.g. 4.5 */}
                <span>{rating.toFixed(1)}</span>
              </div>

              {/* Max guests */}
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{maxGuests}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
