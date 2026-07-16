import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leaseSchema } from "../lib/leaseSchema";

export default function LeaseForm({ defaultValues, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leaseSchema),
    defaultValues: defaultValues || {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-1">
          Tenant email
        </label>
        <input
          {...register("tenant_email")}
          type="email"
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          placeholder="tenant@example.com"
        />
        {errors.tenant_email && (
          <p className="text-danger text-xs mt-1">{errors.tenant_email.message}</p>
        )}
        <p className="text-xs text-slate-light mt-1">
          If they don't have an account yet, the lease will link automatically once they register with this email.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">
            Lease start
          </label>
          <input
            {...register("lease_start")}
            type="date"
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
          {errors.lease_start && (
            <p className="text-danger text-xs mt-1">{errors.lease_start.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">
            Lease end
          </label>
          <input
            {...register("lease_end")}
            type="date"
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
          {errors.lease_end && (
            <p className="text-danger text-xs mt-1">{errors.lease_end.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">
            Monthly rent (R)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("monthly_rent")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
          {errors.monthly_rent && (
            <p className="text-danger text-xs mt-1">{errors.monthly_rent.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">
            Deposit (R)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("deposit")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">
            Emergency contact name
          </label>
          <input
            {...register("emergency_contact_name")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">
            Emergency contact phone
          </label>
          <input
            {...register("emergency_contact_phone")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-emerald text-white rounded-md py-2 text-sm font-medium hover:bg-emerald-dark transition-colors disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Save lease"}
      </button>
    </form>
  );
}