import { supabase } from "../lib/supabase";

export async function getLandlordDashboardData(landlordId) {
  const [propertiesRes, paymentsRes, maintenanceRes, leasesRes] = await Promise.all([
    supabase.from("properties").select("id, status").eq("landlord_id", landlordId),
    supabase
      .from("payments")
      .select("amount, month, year, status")
      .eq("landlord_id", landlordId),
    supabase
      .from("maintenance_requests")
      .select("id, issue, priority, status, created_at, properties(title)")
      .eq("landlord_id", landlordId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("leases")
      .select("id, lease_end, tenant_email, properties(title)")
      .eq("landlord_id", landlordId)
      .eq("status", "active")
      .order("lease_end", { ascending: true }),
  ]);

  if (propertiesRes.error) throw propertiesRes.error;
  if (paymentsRes.error) throw paymentsRes.error;
  if (maintenanceRes.error) throw maintenanceRes.error;
  if (leasesRes.error) throw leasesRes.error;

  return {
    properties: propertiesRes.data,
    payments: paymentsRes.data,
    recentMaintenance: maintenanceRes.data,
    activeLeases: leasesRes.data,
  };
}

export async function getTenantDashboardData(tenantId) {
  const [leaseRes, paymentsRes, maintenanceRes] = await Promise.all([
    supabase
      .from("leases")
      .select("*, properties(title, address, city)")
      .eq("tenant_id", tenantId)
      .eq("status", "active")
      .maybeSingle(),
    supabase
      .from("payments")
      .select("*, properties(title)")
      .eq("tenant_id", tenantId)
      .order("year", { ascending: false })
      .order("month", { ascending: false })
      .limit(3),
    supabase
      .from("maintenance_requests")
      .select("id, issue, status, created_at")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  if (leaseRes.error) throw leaseRes.error;
  if (paymentsRes.error) throw paymentsRes.error;
  if (maintenanceRes.error) throw maintenanceRes.error;

  return {
    lease: leaseRes.data,
    recentPayments: paymentsRes.data,
    recentMaintenance: maintenanceRes.data,
  };
}