import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["landlord", "tenant"], {
      required_error: "Choose a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "tenant" },
  });

  const onSubmit = async (formData) => {
    setSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.fullName },
      },
    });

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    // Our trigger created the profile row with default role 'tenant' —
    // update it here if the user chose 'landlord'
    if (formData.role === "landlord" && data.user) {
      await supabase
        .from("profiles")
        .update({ role: "landlord" })
        .eq("id", data.user.id);
    }

    toast.success("Account created. Check your email to confirm.");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8">
        <h1 className="text-2xl font-serif font-semibold text-slate-900 mb-1">
          Create your account
        </h1>
        <p className="text-slate-light text-sm mb-6">
          Start managing your properties or track your lease in one place.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Full name
            </label>
            <input
              {...register("fullName")}
              type="text"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
              placeholder="Thabo Nkosi"
            />
            {errors.fullName && (
              <p className="text-danger text-xs mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-danger text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              I am a
            </label>
            <select
              {...register("role")}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
              placeholder="At least 8 characters"
            />
            {errors.password && (
              <p className="text-danger text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Confirm password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            />
            {errors.confirmPassword && (
              <p className="text-danger text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald text-white rounded-md py-2 text-sm font-medium hover:bg-emerald-dark transition-colors disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-slate-light mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}