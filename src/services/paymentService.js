import { supabase } from "../lib/supabase";

function sanitizePaymentData(formData) {
  const cleaned = { ...formData };
  if (cleaned.payment_date === "") cleaned.payment_date = null;
  if (cleaned.reference_number === "") cleaned.reference_number = null;
  if (cleaned.payment_method === "") cleaned.payment_method = null;
  return cleaned;
}

export async function getPaymentsForLandlord(landlordId) {
  const { data, error } = await supabase
    .from("payments")
    .select("*, leases(tenant_email), properties(title)")
    .eq("landlord_id", landlordId)
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPaymentsForTenant(tenantId) {
  const { data, error } = await supabase
    .from("payments")
    .select("*, properties(title)")
    .eq("tenant_id", tenantId)
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createPayment(landlordId, leaseData, formData) {
  const { data, error } = await supabase
    .from("payments")
    .insert({
      ...sanitizePaymentData(formData),
      lease_id: leaseData.id,
      property_id: leaseData.property_id,
      landlord_id: landlordId,
      tenant_id: leaseData.tenant_id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePayment(paymentId, formData) {
  const { data, error } = await supabase
    .from("payments")
    .update(sanitizePaymentData(formData))
    .eq("id", paymentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function confirmPayment(paymentId) {
  const { data, error } = await supabase
    .from("payments")
    .update({ status: "paid", payment_date: new Date().toISOString().split("T")[0] })
    .eq("id", paymentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePayment(paymentId) {
  const { error } = await supabase.from("payments").delete().eq("id", paymentId);
  if (error) throw error;
}

// Tenant uploads proof of payment — this is the ONE update a tenant is allowed
// to make, and this function is the only place in the app that calls it this way
export async function uploadPaymentProof(tenantId, paymentId, file) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const path = `${tenantId}/${paymentId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("payment-proofs")
    .upload(path, file);

  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("payments")
    .update({ proof_storage_path: path })
    .eq("id", paymentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPaymentProofUrl(storagePath) {
  const { data, error } = await supabase.storage
    .from("payment-proofs")
    .createSignedUrl(storagePath, 60 * 60); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
}

// Calculations for later dashboard use
export function calculateMonthlyIncome(payments, month, year) {
  return payments
    .filter((p) => p.month === month && p.year === year && p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);
}

export function calculateYearlyIncome(payments, year) {
  return payments
    .filter((p) => p.year === year && p.status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);
}

export function calculateOutstanding(payments) {
  return payments
    .filter((p) => p.status === "pending" || p.status === "overdue")
    .reduce((sum, p) => sum + Number(p.amount), 0);
}