export default function StatCard({ label, value, accent = "text-slate-900" }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-sm text-slate-light">{label}</p>
      <p className={`text-2xl font-serif font-semibold mt-1 ${accent}`}>{value}</p>
    </div>
  );
}