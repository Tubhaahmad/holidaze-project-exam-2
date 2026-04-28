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

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gray-900"
        >
          Holidaze
        </Link>

        {/* Desktop nav links — hidden on mobile */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/venues"
            className="text-sm text-gray-600 transition hover:text-gray-900"
          >
            Venues
          </Link>
          <Link
            href="/about"
            className="text-sm text-gray-600 transition hover:text-gray-900"
          >
            About Us
          </Link>
        </nav>

        {/* Desktop auth buttons — hidden on mobile */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Register</Button>
          </Link>
        </div>

        {/* Mobile hamburger — only visible on mobile */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <SheetTitle className="text-left text-lg font-bold">
                Holidaze
              </SheetTitle>

              {/* Mobile nav links */}
              <nav className="mt-8 flex flex-col gap-4">
                <Link
                  href="/venues"
                  onClick={() => setOpen(false)}
                  className="text-base text-gray-600 transition hover:text-gray-900"
                >
                  Venues
                </Link>
                <Link
                  href="/about"
                  onClick={() => setOpen(false)}
                  className="text-base text-gray-600 transition hover:text-gray-900"
                >
                  About Us
                </Link>
              </nav>

              {/* Mobile auth buttons */}
              <div className="mt-8 flex flex-col gap-3">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
