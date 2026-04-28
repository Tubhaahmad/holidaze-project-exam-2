import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay so text is readable over the video */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero content — sits on top of the video and overlay */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
            Find Your Perfect Stay
          </h1>
          <p className="mb-8 max-w-xl text-lg text-white/80">
            Discover unique venues and book your next adventure with Holidaze
          </p>

          {/* search bar - will navigate to /venues with the search query  */}
          <div className="w-full max-w-2xl rounded-2xl bg-white p-4 shadow-2xl">
            <form action="/venues" method="get" className="flex w-full gap-2">
              <input
                type="text"
                name="search"
                placeholder="Search destinations..."
                className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <Button type="submit" size="lg">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Placehlder - replacing this with real API data when the venue listing page is built */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">
          Featured Venues
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/venues">
            <Button variant="outline" size="lg">
              Browse all venues
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
