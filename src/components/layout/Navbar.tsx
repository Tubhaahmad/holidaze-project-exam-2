"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/features/auth/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    toast.success("You have been logged out.");
    router.push("/");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl bg-white/80 backdrop-blur-lg border border-white/40 shadow-lg px-6 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-gray-900"
        >
          Holidaze
        </Link>

        {/* Desktop nav links — hidden on mobile */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/venues"
            className="text-sm font-medium text-gray-500 transition hover:text-coral"
          >
            Venues
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-gray-500 transition hover:text-coral"
          >
            About Us
          </Link>
        </nav>

        {/* Desktop auth buttons — hidden on mobile */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              {user?.venueManager && (
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium text-gray-500 hover:text-coral"
                  >
                    Dashboard
                  </Button>
                </Link>
              )}
              {/* Avatar links to profile */}
              <Link href="/profile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user?.avatar?.url || "https://placehold.co/32x32?text=?"}
                  alt={user?.name || "Avatar"}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-100 hover:ring-coral transition"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/32x32?text=?";
                  }}
                />
              </Link>
              <Button
                size="sm"
                onClick={handleLogout}
                className="rounded-full bg-coral hover:bg-coral-hover text-white text-sm font-medium px-5"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium text-gray-500 hover:text-coral"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="rounded-full bg-coral hover:bg-coral-hover text-white text-sm font-medium px-5"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger — only visible on mobile */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5 text-gray-600" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <SheetTitle className="text-left text-lg font-semibold text-gray-900">
                Holidaze
              </SheetTitle>

              {/* Mobile nav links */}
              <nav className="mt-8 flex flex-col gap-4">
                <Link
                  href="/venues"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-gray-600 transition hover:text-coral"
                >
                  Venues
                </Link>
                <Link
                  href="/about"
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-gray-600 transition hover:text-coral"
                >
                  About Us
                </Link>
              </nav>

              {/* Mobile auth buttons */}
              <div className="mt-8 flex flex-col gap-3">
                {isLoggedIn ? (
                  <>
                    {/* Mobile avatar + name */}
                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          user?.avatar?.url ||
                          "https://placehold.co/32x32?text=?"
                        }
                        alt={user?.name || "Avatar"}
                        className="h-8 w-8 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://placehold.co/32x32?text=?";
                        }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </span>
                    </div>
                    {user?.venueManager && (
                      <Link href="/dashboard" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <Link href="/profile" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Profile
                      </Button>
                    </Link>
                    <Button
                      className="w-full rounded-full bg-coral hover:bg-coral-hover text-white"
                      onClick={() => {
                        handleLogout();
                        setOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)}>
                      <Button className="w-full rounded-full bg-coral hover:bg-coral-hover text-white">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
