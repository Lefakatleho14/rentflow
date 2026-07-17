import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { CameraIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { updateProfile, uploadAvatar, updatePassword } from "../services/profileService";
import { profileSchema, passwordSchema } from "../lib/profileSchema";

export default function Profile() {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    values: profile
      ? { full_name: profile.full_name || "", phone: profile.phone || "", address: profile.address || "" }
      : undefined,
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  if (loading || !profile) {
    return <p className="text-slate-light text-sm">Loading...</p>;
  }

  const currentAvatar = avatarUrl || profile.avatar_url;

  const onProfileSubmit = async (formData) => {
    setSavingProfile(true);
    try {
      await updateProfile(user.id, formData);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const onPasswordSubmit = async (formData) => {
    setSavingPassword(true);
    try {
      await updatePassword(formData.newPassword);
      toast.success("Password updated");
      resetPasswordForm();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const updated = await uploadAvatar(user.id, file);
      setAvatarUrl(updated.avatar_url);
      toast.success("Avatar updated");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-serif font-semibold text-slate-900">Profile</h2>
      <p className="text-slate-light mt-1 mb-6">Manage your account details.</p>

      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {currentAvatar ? (
              <img src={currentAvatar} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <UserCircleIcon className="h-16 w-16 text-slate-light" />
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 bg-emerald text-white rounded-full p-1.5 hover:bg-emerald-dark transition-colors disabled:opacity-50"
            >
              <CameraIcon className="h-3.5 w-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarSelect}
              className="hidden"
            />
          </div>
          <div>
            <p className="font-medium text-slate-900">{profile.full_name || "Unnamed user"}</p>
            <p className="text-sm text-slate-light capitalize">{profile.role} · {profile.email}</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Full name</label>
            <input
              {...registerProfile("full_name")}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            />
            {profileErrors.full_name && (
              <p className="text-danger text-xs mt-1">{profileErrors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Phone</label>
            <input
              {...registerProfile("phone")}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Address</label>
            <input
              {...registerProfile("address")}
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="bg-emerald text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-emerald-dark transition-colors disabled:opacity-60"
          >
            {savingProfile ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-serif font-semibold text-slate-900 mb-4">Change password</h3>
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">New password</label>
            <input
              {...registerPassword("newPassword")}
              type="password"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            />
            {passwordErrors.newPassword && (
              <p className="text-danger text-xs mt-1">{passwordErrors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Confirm new password</label>
            <input
              {...registerPassword("confirmPassword")}
              type="password"
              className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald"
            />
            {passwordErrors.confirmPassword && (
              <p className="text-danger text-xs mt-1">{passwordErrors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="bg-emerald text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-emerald-dark transition-colors disabled:opacity-60"
          >
            {savingPassword ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}