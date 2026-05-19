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

//Validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

//page component

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
      console.log("Login response:", response);

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
    <div className="mx-auto w-full max-w-md px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-gray-900 underline">
            Register
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...field("email")}
            type="email"
            placeholder="name@stud.noroff.no"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            {...field("password")}
            type="password"
            placeholder="Your password"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </div>
  );
}
