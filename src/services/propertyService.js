import { supabase } from "../lib/supabase";

export async function getProperties(landlordId) {
  const { data, error } = await supabase
    .from("properties")
    .select("*, property_images(*)")
    .eq("landlord_id", landlordId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createProperty(landlordId, formData) {
  const { data, error } = await supabase
    .from("properties")
    .insert({ ...formData, landlord_id: landlordId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProperty(propertyId, formData) {
  const { data, error } = await supabase
    .from("properties")
    .update(formData)
    .eq("id", propertyId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProperty(propertyId) {
  const { error } = await supabase.from("properties").delete().eq("id", propertyId);
  if (error) throw error;
}

export async function uploadPropertyImage(landlordId, propertyId, file) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const path = `${landlordId}/${propertyId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("property-images")
    .upload(path, file);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("property-images")
    .getPublicUrl(path);

  const { data, error } = await supabase
    .from("property_images")
    .insert({ property_id: propertyId, storage_path: path })
    .select()
    .single();

  if (error) throw error;
  return { ...data, publicUrl: urlData.publicUrl };
}

export async function deletePropertyImage(imageId, storagePath) {
  await supabase.storage.from("property-images").remove([storagePath]);
  const { error } = await supabase.from("property_images").delete().eq("id", imageId);
  if (error) throw error;
}