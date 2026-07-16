import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "../lib/paymentSchema";
import { MONTHS, PAYMENT_STATUSES, PAYMENT_METHODS } from "../constants/paymentOptions";

export default function PaymentForm({ defaultValues, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: defaultValues || {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      status: "pending",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Month</label>
          <select
            {...register("month")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Year</label>
          <input
            type="number"
            {...register("year")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900 mb-1">Amount (R)</label>
        <input
          type="number"
          step="0.01"
          {...register("amount")}
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
        />
        {errors.amount && <p className="text-danger text-xs mt-1">{errors.amount.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Status</label>
          <select
            {...register("status")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          >
            {PAYMENT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Method</label>
          <select
            {...register("payment_method")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          >
            <option value="">Not set</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Payment date</label>
          <input
            type="date"
            {...register("payment_date")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Reference number</label>
          <input
            {...register("reference_number")}
            className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-emerald text-white rounded-md py-2 text-sm font-medium hover:bg-emerald-dark transition-colors disabled:opacity-60"
      >
        {submitting ? "Saving..." : "Save payment"}
      </button>
    </form>
  );
}