import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import {
  getLandlordDashboardData,
  getTenantDashboardData,
} from "../services/dashboardService";
import StatCard from "../components/StatCard";
import PriorityBadge from "../components/PriorityBadge";
import MaintenanceStatusBadge from "../components/MaintenanceStatusBadge";
import StatusBadge from "../components/StatusBadge";
import { MONTHS } from "../constants/paymentOptions";

export default function Dashboard() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (profileLoading || !profile) {
    return <p className="text-slate-light text-sm">Loading...</p>;
  }

  return profile.role === "landlord" ? (
    <LandlordDashboard landlordId={user.id} profile={profile} />
  ) : (
    <TenantDashboard tenantId={user.id} profile={profile} />
  );
}

// ---------- LANDLORD DASHBOARD ----------

function LandlordDashboard({ landlordId, profile }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLandlordDashboardData(landlordId)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [landlordId]);

  if (loading) return <p className="text-slate-light text-sm">Loading dashboard...</p>;
  if (!data) return <p className="text-slate-light text-sm">Could not load dashboard data.</p>;

  const { properties, payments, recentMaintenance, activeLeases } = data;

  const totalProperties = properties.length;
  const occupied = properties.filter((p) => p.status === "occupied").length;
  const vacant = properties.filter((p) => p.status === "available").length;

  const now = new Date();
  const monthlyIncome = payments
    .filter((p) => p.status === "paid" && p.month === now.getMonth() + 1 && p.year === now.getFullYear())
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const outstanding = payments
    .filter((p) => p.status !== "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  // Build last 6 months of paid income for the chart
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const total = payments
      .filter((p) => p.status === "paid" && p.month === month && p.year === year)
      .reduce((sum, p) => sum + Number(p.amount), 0);
    chartData.push({ name: `${MONTHS[month - 1].slice(0, 3)} '${String(year).slice(2)}`, income: total });
  }

  // Leases expiring within 30 days
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  const expiringLeases = activeLeases.filter(
    (l) => new Date(l.lease_end) <= thirtyDaysFromNow
  );

  return (
    <div>
      <h2 className="text-2xl font-serif font-semibold text-slate-900">
        Welcome back, {profile.full_name?.split(" ")[0] || "there"}
      </h2>
      <p className="text-slate-light mt-1 mb-6">
        Here's what needs your attention today.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total properties" value={totalProperties} />
        <StatCard label="Occupied" value={occupied} accent="text-emerald" />
        <StatCard label="Vacant" value={vacant} accent="text-warning" />
        <StatCard label="This month" value={`R${monthlyIncome.toLocaleString()}`} accent="text-emerald" />
        <StatCard label="Outstanding" value={`R${outstanding.toLocaleString()}`} accent="text-danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
          <h3 className="font-serif font-semibold text-slate-900 mb-4">Cash flow, last 6 months</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748B" />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748B" />
              <Tooltip formatter={(value) => `R${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="income" stroke="#065F46" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-serif font-semibold text-slate-900 mb-4">Lease expiry alerts</h3>
          {expiringLeases.length === 0 ? (
            <p className="text-sm text-slate-light">No leases expiring soon.</p>
          ) : (
            <div className="space-y-3">
              {expiringLeases.map((lease) => (
                <div key={lease.id} className="text-sm">
                  <p className="font-medium text-slate-900">{lease.properties?.title}</p>
                  <p className="text-slate-light">
                    {lease.tenant_email} — ends {new Date(lease.lease_end).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 mt-6">
        <h3 className="font-serif font-semibold text-slate-900 mb-4">Recent maintenance requests</h3>
        {recentMaintenance.length === 0 ? (
          <p className="text-sm text-slate-light">No maintenance requests yet.</p>
        ) : (
          <div className="space-y-3">
            {recentMaintenance.map((r) => (
              <div key={r.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-slate-900">{r.issue}</p>
                  <p className="text-slate-light">{r.properties?.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={r.priority} />
                  <MaintenanceStatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- TENANT DASHBOARD ----------

function TenantDashboard({ tenantId, profile }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTenantDashboardData(tenantId)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [tenantId]);

  if (loading) return <p className="text-slate-light text-sm">Loading dashboard...</p>;
  if (!data) return <p className="text-slate-light text-sm">Could not load dashboard data.</p>;

  const { lease, recentPayments, recentMaintenance } = data;

  return (
    <div>
      <h2 className="text-2xl font-serif font-semibold text-slate-900">
        Welcome back, {profile.full_name?.split(" ")[0] || "there"}
      </h2>
      <p className="text-slate-light mt-1 mb-6">
        Here's an overview of your rental.
      </p>

      {!lease ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-slate-light">No active lease found yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard label="Property" value={lease.properties?.title} />
          <StatCard label="Monthly rent" value={`R${Number(lease.monthly_rent).toLocaleString()}`} accent="text-emerald" />
          <StatCard label="Lease ends" value={new Date(lease.lease_end).toLocaleDateString()} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-serif font-semibold text-slate-900 mb-4">Recent payments</h3>
          {recentPayments.length === 0 ? (
            <p className="text-sm text-slate-light">No payment history yet.</p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <p className="text-slate-900">{MONTHS[p.month - 1]} {p.year}</p>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">R{Number(p.amount).toLocaleString()}</span>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-serif font-semibold text-slate-900 mb-4">Recent maintenance</h3>
          {recentMaintenance.length === 0 ? (
            <p className="text-sm text-slate-light">No maintenance requests yet.</p>
          ) : (
            <div className="space-y-3">
              {recentMaintenance.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <p className="text-slate-900">{r.issue}</p>
                  <MaintenanceStatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}