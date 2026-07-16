import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export default function Login() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData) => {
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(formData);

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    toast.success("Welcome back.");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8">
        <h1 className="text-2xl font-serif font-semibold text-slate-900 mb-1">
          Welcome back
        </h1>
        <p className="text-slate-light text-sm mb-6">
          Log in to see your properties, payments, and requests.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            />
            {errors.password && (
              <p className="text-danger text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald text-white rounded-md py-2 text-sm font-medium hover:bg-emerald-dark transition-colors disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-slate-light mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-emerald font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}