"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/api/auth";
import { useAuth } from "@/features/auth/store";

// validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// page component

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, login: saveToStore } = useAuth();

  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/profile");
    }
  }, [isLoggedIn, router]);

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      });

      saveToStore(response.accessToken, {
        name: response.name,
        email: response.email,
        bio: response.bio,
        avatar: response.avatar,
        banner: response.banner,
        venueManager: response.venueManager,
      });

      toast.success("Welcome back!");

      if (response.venueManager) {
        router.push("/dashboard");
      } else {
        router.push("/profile");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Incorrect email or password";
      toast.error(message);
    }
  }

  return (
    <div className="relative flex min-h-screen -mt-20 items-center justify-center">
      {/* background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/19570521/pexels-photo-19570521.jpeg')",
        }}
      />
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* form card */}
      <div className="relative z-10 w-full max-w-md px-6 py-8 pt-24">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* header */}
          <div className="mb-8">
            <p className="mb-1 text-sm font-medium text-coral">Welcome back</p>
            <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
              Log in to Holidaze
            </h1>
            <p className="text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-coral hover:text-coral-hover transition"
              >
                Register
              </Link>
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...field("email")}
                type="email"
                placeholder="name@stud.noroff.no"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...field("password")}
                type="password"
                placeholder="Your password"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-coral hover:bg-coral-hover text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
