"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { register, login } from "@/lib/api/auth";
import { useAuth } from "@/features/auth/store";

// Validation schema
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),

  email: z
    .string()
    .email("Please enter valid email address")
    // regex is used to validate that a string matches a specific regular expression
    .regex(/@stud\.noroff\.no$/, "Email must end in @stud.noroff.no"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  // venueManager is a boolean, true means Venue Manager, false means Customer.
  venueManager: z.boolean(),
});

// This will crfeate a TypeScript type from the schema above
// so our form data is fully typed
type RegisterFormData = z.infer<typeof registerSchema>;

// PAGE COMPONENT

export default function RegisterPage() {
  const router = useRouter();

  const { isLoggedIn, login: saveToStore } = useAuth();

  //useForm sets up the form with the Zod schema for validation
  //watch lets us read the current value of a field
  //setValue lets us update a fields value manually
  const {
    register: field,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      venueManager: false,
    },
  });

  const isVenueManager = watch("venueManager");

  // Redirect to profile if user is already logged in
  // This prevents logged-in users from accessing the register page
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/profile");
    }
  }, [isLoggedIn, router]);

  async function onSubmit(data: RegisterFormData) {
    try {
      // register the user
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        venueManager: data.venueManager,
      });

      const loginResponse = await login({
        email: data.email,
        password: data.password,
      });

      // save the token and user profile to the Zustand store
      saveToStore(loginResponse.accessToken, {
        name: loginResponse.name,
        email: loginResponse.email,
        bio: loginResponse.bio,
        avatar: loginResponse.avatar,
        banner: loginResponse.banner,
        venueManager: loginResponse.venueManager,
      });

      toast.success("Account created! Welcome to Holidaze.");

      router.push("/profile");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Create account
        </h1>
        <p className="text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-gray-900 underline">
            Log in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...field("name")}
            placeholder="Your name"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {/* Show the error message if name validation fails */}
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

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
            placeholder="Minimum 8 characters"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Account type
          </label>
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              type="button"
              onClick={() => setValue("venueManager", false)}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                !isVenueManager
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {" "}
              Customer
            </button>
            <button
              type="button"
              onClick={() => setValue("venueManager", true)}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                isVenueManager
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {" "}
              Venue Manager
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}
