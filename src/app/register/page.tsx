"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v3";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { register, login } from "@/lib/api/auth";
import { useAuth } from "@/features/auth/store";

// validation schema
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

// this will create a TypeScript type from the schema above
// so our form data is fully typed
type RegisterFormData = z.infer<typeof registerSchema>;

// page component

export default function RegisterPage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isLoggedIn, login: saveToStore } = useAuth();

  // useForm sets up the form with the Zod schema for validation
  // watch lets us read the current value of a field
  // setValue lets us update a fields value manually
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

  // eslint-disable-next-line react-hooks/incompatible-library
  const isVenueManager = watch("venueManager");

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
    <div className="relative flex min-h-screen -mt-20 items-center justify-center py-8">
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
            <p className="mb-1 text-sm font-medium text-coral">Get started</p>
            <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
              Create an account
            </h1>
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-coral hover:text-coral-hover transition"
              >
                Log in
              </Link>
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                {...field("name")}
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
              />
              {/* show the error message if name validation fails */}
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                placeholder="Minimum 8 characters"
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* account type toggle */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Account type
              </label>
              <div className="flex rounded-xl border border-gray-200 p-1">
                <button
                  type="button"
                  onClick={() => setValue("venueManager", false)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
                    !isVenueManager
                      ? "bg-coral text-white"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setValue("venueManager", true)}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
                    isVenueManager
                      ? "bg-coral text-white"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Venue Manager
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full bg-coral hover:bg-coral-hover text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
