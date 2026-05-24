"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/store";
import { toast } from "sonner";

export default function Footer() {
  const { isLoggedIn, user } = useAuth();

  function handleBecomeHost() {
    toast.info(
      "To become a host, please log out first and register a new venue manager account.",
    );
  }

  return (
    <>
      {(!isLoggedIn || (isLoggedIn && !user?.venueManager)) && (
        <>
          {/* stats section */}
          ...
          {/* cta section */}
          <section className="bg-gray-900 py-20">
            <div className="mx-auto w-full max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-white">
                  Ready to list your venue?
                </h2>
                <p className="text-gray-500">
                  {isLoggedIn
                    ? "You need a venue manager account to list your property."
                    : "Join thousands of hosts and start earning from your property today."}
                </p>
              </div>

              {isLoggedIn ? (
                <Button
                  size="lg"
                  onClick={handleBecomeHost}
                  className="rounded-full bg-coral hover:bg-coral-hover text-white px-10 shrink-0"
                >
                  Become a host
                </Button>
              ) : (
                <Link href="/register">
                  <Button
                    size="lg"
                    className="rounded-full bg-coral hover:bg-coral-hover text-white px-10 shrink-0"
                  >
                    Become a host
                  </Button>
                </Link>
              )}
            </div>
          </section>
        </>
      )}

      {/* main footer */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="mx-auto w-full max-w-7xl px-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            © 2026 Holidaze. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/venues" className="hover:text-coral transition">
              Venues
            </Link>
            <Link href="/about" className="hover:text-coral transition">
              About
            </Link>
            <Link href="/register" className="hover:text-coral transition">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
