import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema } from "../lib/propertySchema";
import { PROPERTY_TYPES, PROPERTY_STATUSES, SA_PROVINCES } from "../constants/propertyOptions";

export default function PropertyForm({ defaultValues, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: defaultValues || {
      property_type: "apartment",
      status: "available",
      parking: 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-1">Title</label>
        <input
          {...register("title")}
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          placeholder="Modern 2-bed apartment in Umhlanga"
        />
        {errors.title && <p className="text-danger text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900 mb-1">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Property type</label>
          <select
            {...register("property_type")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Status</label>
          <select
            {...register("status")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          >
            {PROPERTY_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900 mb-1">Address</label>
        <input
          {...register("address")}
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
        />
        {errors.address && <p className="text-danger text-xs mt-1">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">City</label>
          <input
            {...register("city")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
          {errors.city && <p className="text-danger text-xs mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Province</label>
          <select
            {...register("province")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          >
            <option value="">Select...</option>
            {SA_PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.province && <p className="text-danger text-xs mt-1">{errors.province.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Postal code</label>
          <input
            {...register("postal_code")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Monthly rent (R)</label>
          <input
            type="number"
            step="0.01"
            {...register("monthly_rent")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
          {errors.monthly_rent && <p className="text-danger text-xs mt-1">{errors.monthly_rent.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Deposit (R)</label>
          <input
            type="number"
            step="0.01"
            {...register("deposit")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Bedrooms</label>
          <input
            type="number"
            {...register("bedrooms")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Bathrooms</label>
          <input
            type="number"
            {...register("bathrooms")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Parking</label>
          <input
            type="number"
            {...register("parking")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">m²</label>
          <input
            type="number"
            step="0.01"
            {...register("square_meters")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-emerald text-white rounded-md py-2 text-sm font-medium hover:bg-emerald-dark transition-colors disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Save property"}
      </button>
    </form>
  );
}