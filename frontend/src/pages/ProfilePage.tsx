import { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { FormError } from "../components/ui/FormError";
import { useAuth } from "../context/useAuth";
import { authApiClient } from "../lib/apiClient";

export default function ProfilePage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await authApiClient("/auth/profile", {
        method: "PATCH",
        body: { displayName },
      });
      setSaveSuccess(true);
    } catch (err) {
      setSaveError((err as Error).message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);
    if (passwords.next !== passwords.confirm) {
      setPwError("Passwords do not match.");
      return;
    }
    if (passwords.next.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    setPwSaving(true);
    try {
      await authApiClient("/auth/change-password", {
        method: "PATCH",
        body: { currentPassword: passwords.current, newPassword: passwords.next },
      });
      setPwSuccess(true);
      setPasswords({ current: "", next: "", confirm: "" });
    } catch (err) {
      setPwError((err as Error).message || "Failed to change password.");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg py-10">
      <h1 className="mb-8 text-2xl font-extrabold text-text-primary">Profile</h1>

      {/* Display Name */}
      <section className="rainbow-panel mb-8 rounded-2xl border border-border bg-surface/80 p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Account Info</h2>
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          {saveError && <FormError>{saveError}</FormError>}
          {saveSuccess && (
            <div className="rounded-xl border border-[#4df7c866] bg-[#4df7c81a] px-4 py-2 text-sm font-medium text-[#8afbe1]">
              Profile updated!
            </div>
          )}
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={saving}
            theme="light"
          />
          <Input
            label="Email"
            value={user?.email ?? ""}
            disabled
            theme="light"
          />
          <div className="flex justify-end">
            <Button type="submit" loading={saving} disabled={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </section>

      {/* Change Password */}
      <section className="rainbow-panel rounded-2xl border border-border bg-surface/80 p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-text-primary">Change Password</h2>
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          {pwError && <FormError>{pwError}</FormError>}
          {pwSuccess && (
            <div className="rounded-xl border border-[#4df7c866] bg-[#4df7c81a] px-4 py-2 text-sm font-medium text-[#8afbe1]">
              Password changed successfully!
            </div>
          )}
          <Input
            label="Current Password"
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            disabled={pwSaving}
            theme="light"
          />
          <Input
            label="New Password"
            type="password"
            value={passwords.next}
            onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
            disabled={pwSaving}
            theme="light"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
            disabled={pwSaving}
            theme="light"
          />
          <div className="flex justify-end">
            <Button type="submit" loading={pwSaving} disabled={pwSaving}>
              Change Password
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}