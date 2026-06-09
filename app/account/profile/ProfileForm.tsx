"use client";

import { useState } from "react";
import { User, Mail, Phone, Shield, Lock, AlertTriangle } from "lucide-react";
import { updateProfile, setPassword, deleteAccount } from "./actions";
import { signOut } from "next-auth/react";

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    phone: string | null;
  };
  hasPassword?: boolean;
}

export default function ProfileForm({ user, hasPassword }: ProfileFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Split name for UI (first and last name)
  const nameParts = user.name.split(" ");
  const initialFirstName = nameParts[0] || "";
  const initialLastName = nameParts.slice(1).join(" ") || "";

  const [formData, setFormData] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    phone: user.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(false);
    setError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);
    setError("");

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

    const result = await updateProfile({
      name: fullName,
      phone: formData.phone,
    });

    setIsSaving(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPassword(true);
    setPasswordError("");
    setPasswordSuccess(false);

    const result = await setPassword(passwordValue);
    
    setIsSavingPassword(false);
    
    if (result.error) {
      setPasswordError(result.error);
    } else {
      setPasswordSuccess(true);
      setShowPasswordForm(false);
      setPasswordValue("");
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const result = await deleteAccount();
    if (result.success) {
      await signOut({ callbackUrl: "/" });
    } else {
      setIsDeleting(false);
      alert("Failed to delete account");
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Profile Form */}
      <div className="md:col-span-2">
        <form onSubmit={handleSave} className="bg-white rounded-[4px] shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-ud-dark mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-ud-burgundy" />
            Personal Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            <div>
              <label htmlFor="firstName" className="block text-xs font-bold text-ud-dark/60 mb-1.5">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-xs font-bold text-ud-dark/60 mb-1.5">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy"
              />
            </div>
          </div>

          <div className="space-y-5 mb-8">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-ud-dark/60 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                disabled
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy bg-gray-50 cursor-not-allowed"
              />
              <p className="text-[11px] text-ud-dark/40 mt-1.5">Email address cannot be changed. Contact support if you need to update it.</p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-ud-dark/60 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-ud-dark/10">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-ud-burgundy text-white text-sm font-bold px-6 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px]"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            {success && <span className="text-sm font-semibold text-green-600">Profile updated successfully!</span>}
            {error && <span className="text-sm font-semibold text-red-600">{error}</span>}
          </div>
        </form>
      </div>

      {/* Security Settings */}
      <div>
        <div className="bg-white rounded-[4px] shadow-sm p-6">
          <h2 className="text-base font-bold text-ud-dark mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-ud-burgundy" />
            Security Settings
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-ud-dark">Password</h3>
              {!hasPassword && !passwordSuccess && (
                <p className="text-xs text-ud-dark/60 mt-1 mb-3">You signed in using a Magic Link. No password is set for your account.</p>
              )}
              {(hasPassword || passwordSuccess) && (
                <p className="text-xs text-ud-dark/60 mt-1 mb-3 text-green-600">Password is set. You can sign in using email and password.</p>
              )}
              
              {showPasswordForm ? (
                <form onSubmit={handleSetPassword} className="mt-3">
                  <input
                    type="password"
                    placeholder="New Password (min 6 chars)"
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    required
                    minLength={6}
                    className="w-full border border-ud-dark/20 rounded-[4px] px-3 py-2 text-sm text-ud-dark focus:outline-none focus:border-ud-burgundy mb-2"
                  />
                  {passwordError && <p className="text-xs text-red-600 mb-2">{passwordError}</p>}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSavingPassword}
                      className="bg-ud-burgundy text-white text-xs font-bold px-3 py-1.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors disabled:opacity-70"
                    >
                      {isSavingPassword ? "Saving..." : "Save Password"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPasswordForm(false)}
                      className="text-xs font-bold text-ud-dark/60 hover:text-ud-dark"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={() => setShowPasswordForm(true)}
                  className="text-xs font-bold text-ud-burgundy hover:underline flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  {hasPassword || passwordSuccess ? "Update Password" : "Set a Password"}
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-ud-dark/10">
              <h3 className="text-sm font-bold text-red-600">Danger Zone</h3>
              <p className="text-xs text-ud-dark/60 mt-1 mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
              
              {showDeleteConfirm ? (
                <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                  <p className="text-xs text-red-800 font-bold mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Are you absolutely sure?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-[4px] hover:bg-red-700 transition-colors disabled:opacity-70"
                    >
                      {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="text-xs font-bold text-ud-dark/60 hover:text-ud-dark px-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Delete Account
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
