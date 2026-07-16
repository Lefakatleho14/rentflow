import { supabase } from "../lib/supabase";

export async function getLeasesForProperty(propertyId) {
  const { data, error } = await supabase
    .from("leases")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getLeasesForLandlord(landlordId) {
  const { data, error } = await supabase
    .from("leases")
    .select("*, properties(title, city)")
    .eq("landlord_id", landlordId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getActiveLeasesForLandlord(landlordId) {
  const { data, error } = await supabase
    .from("leases")
    .select("*, properties(title)")
    .eq("landlord_id", landlordId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getActiveLeaseForTenant(tenantId) {
  const { data, error } = await supabase
    .from("leases")
    .select("*, properties(id, title), landlord_id")
    .eq("tenant_id", tenantId)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createLease(landlordId, propertyId, formData) {
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", formData.tenant_email)
    .maybeSingle();

  const { data, error } = await supabase
    .from("leases")
    .insert({
      ...formData,
      property_id: propertyId,
      landlord_id: landlordId,
      tenant_id: existingProfile?.id || null,
      status: existingProfile ? "active" : "pending_invite",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLease(leaseId, formData) {
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", formData.tenant_email)
    .maybeSingle();

  const updatePayload = { ...formData };

  if (existingProfile) {
    updatePayload.tenant_id = existingProfile.id;
    updatePayload.status = "active";
  }

  const { data, error } = await supabase
    .from("leases")
    .update(updatePayload)
    .eq("id", leaseId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLease(leaseId) {
  const { error } = await supabase.from("leases").delete().eq("id", leaseId);
  if (error) throw error;
}