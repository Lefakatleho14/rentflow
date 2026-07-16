import { supabase } from "../lib/supabase";

export async function getRequestsForTenant(tenantId) {
  const { data, error } = await supabase
    .from("maintenance_requests")
    .select("*, properties(title), maintenance_images(*)")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getRequestsForLandlord(landlordId) {
  const { data, error } = await supabase
    .from("maintenance_requests")
    .select("*, properties(title), profiles!maintenance_requests_tenant_id_fkey(full_name, email), maintenance_images(*)")
    .eq("landlord_id", landlordId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createRequest(tenantId, propertyId, landlordId, formData) {
  const { data, error } = await supabase
    .from("maintenance_requests")
    .insert({
      ...formData,
      tenant_id: tenantId,
      property_id: propertyId,
      landlord_id: landlordId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRequestStatus(requestId, status) {
  const updatePayload = { status };

  if (status === "assigned") updatePayload.assigned_at = new Date().toISOString();
  if (status === "completed") updatePayload.completed_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("maintenance_requests")
    .update(updatePayload)
    .eq("id", requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRequest(requestId) {
  const { error } = await supabase.from("maintenance_requests").delete().eq("id", requestId);
  if (error) throw error;
}

export async function uploadMaintenanceImage(tenantId, requestId, file) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const path = `${tenantId}/${requestId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("maintenance-images")
    .upload(path, file);

  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("maintenance_images")
    .insert({ request_id: requestId, storage_path: path })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMaintenanceImageUrl(storagePath) {
  const { data, error } = await supabase.storage
    .from("maintenance-images")
    .createSignedUrl(storagePath, 60 * 60);

  if (error) throw error;
  return data.signedUrl;
}