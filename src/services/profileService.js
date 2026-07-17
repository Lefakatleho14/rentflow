import { supabase } from "../lib/supabase";

export async function updateProfile(userId, formData) {
  const { data, error } = await supabase
    .from("profiles")
    .update(formData)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadAvatar(userId, file) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const path = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);

  const { data, error } = await supabase
    .from("profiles")
    .update({ avatar_url: urlData.publicUrl })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function updateEmail(newEmail) {
  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) throw error;
}